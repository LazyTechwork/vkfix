import { PhotoSticker } from '../../modules/messenger/types';
import { SearchResult, SearchIndex, MatchDetails, MatchType } from './types';
import { StickerSearchConfig, DEFAULT_SEARCH_CONFIG } from './config';
import { IndexBuilder } from './IndexBuilder';
import { QueryValidator } from './QueryValidator';
import { TextNormalizer } from './TextNormalizer';
import { FuzzyMatcher } from './FuzzyMatcher';
import { stemWord } from './Stemmer';
import { switchKeyboardLayout } from '../../common/helpers/switchKeyboardLayout';
import { Logger } from '../Logger';

/**
 * Регулярное выражение для поиска эмодзи
 */
const EMOJI_REGEX = /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\u200D]+$/u;

/**
 * Насколько каждый тип совпадения закрывает слово запроса.
 * Используется при подсчёте доли совпавших слов.
 */
const MATCH_WEIGHT: Record<MatchType, number> = {
  exact: 1,
  prefix: 1,
  stem: 0.9,
  semantic: 0.8,
  common: 0.7,
  fuzzy: 0.6
};

/**
 * Лучшее совпадение стикера по каждому слову запроса.
 * Слово запроса засчитывается один раз — по самому качественному совпадению.
 */
type StickerMatches = Map<string, MatchDetails>;

/**
 * Оценка стикера относительно запроса
 */
interface StickerScore {
  /** Доля совпавших слов запроса */
  ratio: number;
  /** Какую часть самой короткой подсказки стикера закрыл запрос */
  coverage: number;
  /** Есть ли хоть одно точное совпадение слова */
  hasExact: boolean;
  /** Итоговый балл */
  final: number;
}

/**
 * Проверяет, состоит ли строка только из эмодзи
 */
function isEmojiOnly(str: string): boolean {
  return EMOJI_REGEX.test(str);
}

/**
 * Главный движок поиска стикеров
 */
export class SearchEngine {
  private index: SearchIndex | null = null;
  /** Массив, по которому построен индекс — сравнением ловим подгрузку новых фото */
  private indexedStickers: PhotoSticker[] | null = null;
  private indexBuilder: IndexBuilder;
  private validator: QueryValidator;
  private normalizer: TextNormalizer;
  private fuzzyMatcher: FuzzyMatcher;
  private config: StickerSearchConfig;

  constructor(config: Partial<StickerSearchConfig> = {}) {
    this.config = { ...DEFAULT_SEARCH_CONFIG, ...config };
    this.indexBuilder = new IndexBuilder();
    this.validator = new QueryValidator(this.config.validation);
    this.normalizer = new TextNormalizer();
    this.fuzzyMatcher = new FuzzyMatcher();
  }

  /**
   * Построить индекс для стикеров.
   * Перестраивается, когда пришёл другой массив стикеров — иначе фото,
   * догруженные после старта из кэша, никогда бы не попали в поиск.
   */
  buildIndex(stickers: PhotoSticker[]): void {
    if (this.indexedStickers === stickers) {
      return;
    }

    this.index = this.indexBuilder.buildIndex(stickers);
    this.indexedStickers = stickers;

    Logger.info('SearchEngine: индекс построен', {
      stickers: stickers.length,
      words: this.index.exactWords.size,
      stems: this.index.stemWords.size,
      suggestions: this.index.exactSuggestions.size
    });
  }

  /**
   * Основная функция поиска
   *
   * @param limit сколько результатов нужно вызывающей стороне.
   *              Ранжирование всегда полное, лимит влияет только на длину
   *              выдачи и на то, можно ли пропустить дорогой fuzzy-поиск.
   */
  search(
    stickers: PhotoSticker[],
    query: string,
    limit: number = this.config.limits.maxResults
  ): PhotoSticker[] {
    this.buildIndex(stickers);

    const validation = this.validator.validate(query);
    if (!validation.isValid) {
      Logger.info('SearchEngine: запрос отклонён', { query, reason: validation.reason });
      return [];
    }

    const normalizedQuery = this.normalizer.normalizeQuery(query);

    // Проверяем, является ли запрос чистым эмодзи
    const emojiQuery = normalizedQuery.replace(/[\s\u200D]/g, '');
    if (emojiQuery.length > 0 && isEmojiOnly(emojiQuery)) {
      return this.searchEmoji(normalizedQuery, limit);
    }

    const queryWords = this.normalizer.selectQueryWords(
      this.normalizer.extractWords(normalizedQuery),
      this.config.limits.maxQueryWords
    );

    if (queryWords.length === 0) {
      return [];
    }

    // Одна буква — совпадений слишком много, они бессмысленны
    if (queryWords.length === 1 && queryWords[0].length === 1) {
      return [];
    }

    let results = this.performSearch(normalizedQuery, queryWords, limit);

    // Если ничего не нашли и включено переключение раскладки, пробуем переключить
    if (results.length === 0 && this.config.features.enableLayoutSwitch) {
      const switchedQuery = switchKeyboardLayout(normalizedQuery);
      if (switchedQuery !== normalizedQuery) {
        const switchedWords = this.normalizer.selectQueryWords(
          this.normalizer.extractWords(switchedQuery),
          this.config.limits.maxQueryWords
        );
        results = this.performSearch(switchedQuery, switchedWords, limit);
      }
    }

    Logger.info('SearchEngine: поиск завершён', {
      query,
      queryWords,
      limit,
      found: results.length,
      top: results.slice(0, 5).map(r => ({ text: r.sticker.suggestions[0], score: r.score }))
    });

    return results.map(r => r.sticker);
  }

  /**
   * Поиск стикеров по эмодзи
   */
  private searchEmoji(emojiQuery: string, limit: number): PhotoSticker[] {
    if (!this.index) {
      return [];
    }

    const matches = new Map<PhotoSticker, StickerMatches>();

    for (const emoji of extractEmojiChars(emojiQuery)) {
      this.addStickers(matches, this.index.exactWords.get(emoji), {
        type: 'exact', field: 'word', value: emoji, queryWord: emoji, score: 3.0
      });

      this.addStickers(matches, this.index.exactSuggestions.get(emoji), {
        type: 'exact', field: 'suggestion', value: emoji, queryWord: emoji, score: 2.5
      });
    }

    const results: SearchResult[] = [];

    for (const [sticker, stickerMatches] of matches) {
      const details = [...stickerMatches.values()];

      results.push({
        sticker,
        score: details.reduce((sum, match) => sum + match.score, 0),
        matches: details
      });
    }

    Logger.info('SearchEngine: поиск по эмодзи', { emojiQuery, found: results.length });

    return this.sortAndLimitResults(results, limit).map(r => r.sticker);
  }

  /**
   * Выполнить поиск по словам запроса
   */
  private performSearch(query: string, queryWords: string[], limit: number): SearchResult[] {
    if (!this.index || queryWords.length === 0) {
      return [];
    }

    const matches = new Map<PhotoSticker, StickerMatches>();

    this.matchWholeQuery(query, queryWords, matches);
    this.matchExact(queryWords, matches);
    this.matchPrefix(queryWords, matches);
    this.matchStem(queryWords, matches);
    this.matchCommonPrefix(queryWords, matches);

    if (this.config.features.enableSemantic) {
      this.matchSemantic(queryWords, matches);
    }

    const results = this.buildResults(matches, queryWords, limit);

    // Fuzzy — единственная дорогая стадия (расстояние Левенштейна по всему
    // словарю). Пропускаем её только когда выдача от неё измениться не может.
    if (!this.config.features.enableFuzzy || this.isPageFinal(results, queryWords, limit)) {
      return results;
    }

    this.matchFuzzy(queryWords, matches);

    return this.buildResults(matches, queryWords, limit);
  }

  /**
   * Запрос целиком совпал с подсказкой стикера — самый сильный сигнал.
   * Совпадение записывается на каждое слово запроса, поэтому запрос считается
   * покрытым полностью.
   */
  private matchWholeQuery(
    query: string,
    queryWords: string[],
    matches: Map<PhotoSticker, StickerMatches>
  ): void {
    const stickers = this.index!.exactSuggestions.get(query);

    for (const word of queryWords) {
      this.addStickers(matches, stickers, {
        type: 'exact',
        field: 'suggestion',
        value: query,
        queryWord: word,
        score: this.config.scoring.exactMatch
      });
    }
  }

  /**
   * Точные совпадения слов и односложных подсказок
   */
  private matchExact(queryWords: string[], matches: Map<PhotoSticker, StickerMatches>): void {
    for (const word of queryWords) {
      this.addStickers(matches, this.index!.exactWords.get(word), {
        type: 'exact', field: 'word', value: word, queryWord: word,
        score: this.config.scoring.exactMatch
      });

      this.addStickers(matches, this.index!.exactSuggestions.get(word), {
        type: 'exact', field: 'suggestion', value: word, queryWord: word,
        score: this.config.scoring.exactMatch
      });
    }
  }

  /**
   * Слово запроса является началом слова стикера: «привет» → «приветствие».
   * Чем большую часть найденного слова закрывает запрос, тем выше балл.
   */
  private matchPrefix(queryWords: string[], matches: Map<PhotoSticker, StickerMatches>): void {
    for (const word of queryWords) {
      if (word.length < this.config.limits.minPrefixLength) {
        continue;
      }

      for (const term of this.index!.prefixIndex.findByPrefix(word)) {
        if (term === word) {
          continue; // Точное совпадение уже учтено
        }

        this.addStickers(matches, this.index!.exactWords.get(term), {
          type: 'prefix', field: 'word', value: term, queryWord: word,
          score: this.config.scoring.prefixMatch * (word.length / term.length)
        });
      }
    }
  }

  /**
   * Совпадение по основе слова: «работе» → «работаю», «приветствую» → «приветствие»
   */
  private matchStem(queryWords: string[], matches: Map<PhotoSticker, StickerMatches>): void {
    for (const word of queryWords) {
      const stem = stemWord(word);

      this.addStickers(matches, this.index!.stemWords.get(stem), {
        type: 'stem', field: 'word', value: stem, queryWord: word,
        score: this.config.scoring.stemMatch
      });

      if (stem === word || stem.length < this.config.limits.minPrefixLength) {
        continue;
      }

      this.addStickers(matches, this.index!.exactWords.get(stem), {
        type: 'stem', field: 'word', value: stem, queryWord: word,
        score: this.config.scoring.stemMatch
      });

      // Основа запроса как начало слова стикера: «работ» → «работаю»
      for (const term of this.index!.prefixIndex.findByPrefix(stem)) {
        this.addStickers(matches, this.index!.exactWords.get(term), {
          type: 'stem', field: 'word', value: term, queryWord: word,
          score: this.config.scoring.stemMatch * (stem.length / term.length)
        });
      }
    }
  }

  /**
   * У слов общее начало, но ни одно не является префиксом другого:
   * «приветик» и «приветствие» расходятся после «привет».
   */
  private matchCommonPrefix(
    queryWords: string[],
    matches: Map<PhotoSticker, StickerMatches>
  ): void {
    for (const word of queryWords) {
      if (word.length < this.config.limits.minCommonPrefixLength) {
        continue;
      }

      const found = this.index!.prefixIndex.findByCommonPrefix(
        word,
        this.config.limits.minCommonPrefixLength
      );

      for (const { term, length } of found) {
        if (term.startsWith(word)) {
          continue; // Префиксное совпадение уже учтено
        }

        this.addStickers(matches, this.index!.exactWords.get(term), {
          type: 'common', field: 'word', value: term, queryWord: word,
          score: this.config.scoring.commonPrefixMatch * (length / Math.max(word.length, term.length))
        });
      }
    }
  }

  /**
   * Поиск по синонимам
   */
  private matchSemantic(queryWords: string[], matches: Map<PhotoSticker, StickerMatches>): void {
    for (const word of queryWords) {
      for (const synonym of this.index!.semanticMap.get(word) ?? []) {
        if (synonym === word) {
          continue;
        }

        this.addStickers(matches, this.index!.exactWords.get(synonym), {
          type: 'semantic', field: 'word', value: synonym, queryWord: word,
          score: this.config.scoring.semanticMatch
        });
      }
    }
  }

  /**
   * Поиск с учётом опечаток
   */
  private matchFuzzy(queryWords: string[], matches: Map<PhotoSticker, StickerMatches>): void {
    const dictionary = this.index!.prefixIndex.terms;

    for (const word of queryWords) {
      const maxDistance = this.fuzzyMatcher.getMaxDistance(word.length);
      if (maxDistance === 0) {
        continue;
      }

      const similarWords = this.fuzzyMatcher.findSimilarWords(word, dictionary, maxDistance);

      for (const { word: term, distance } of similarWords) {
        if (distance === 0) {
          continue; // Точное совпадение уже учтено
        }

        const fuzzyScore = this.fuzzyMatcher.calculateFuzzyScore(distance, word.length);

        this.addStickers(matches, this.index!.exactWords.get(term), {
          type: 'fuzzy', field: 'word', value: term, queryWord: word,
          score: fuzzyScore * this.config.scoring.fuzzyMatch
        });
      }
    }
  }

  /**
   * Добавляет совпадение сразу нескольким стикерам
   */
  private addStickers(
    matches: Map<PhotoSticker, StickerMatches>,
    stickers: PhotoSticker[] | undefined,
    match: MatchDetails
  ): void {
    for (const sticker of stickers ?? []) {
      this.addMatch(matches, sticker, match);
    }
  }

  /**
   * Сохраняет совпадение, если оно лучше уже найденного по этому слову запроса
   */
  private addMatch(
    matches: Map<PhotoSticker, StickerMatches>,
    sticker: PhotoSticker,
    match: MatchDetails
  ): void {
    let stickerMatches = matches.get(sticker);

    if (!stickerMatches) {
      stickerMatches = new Map();
      matches.set(sticker, stickerMatches);
    }

    const current = stickerMatches.get(match.queryWord);
    if (!current || match.score > current.score) {
      stickerMatches.set(match.queryWord, match);
    }
  }

  /**
   * Построить отсортированные результаты
   */
  private buildResults(
    matches: Map<PhotoSticker, StickerMatches>,
    queryWords: string[],
    limit: number
  ): SearchResult[] {
    const results: SearchResult[] = [];
    const stopWordsOnly = this.normalizer.isStopWordsOnly(queryWords);

    for (const [sticker, stickerMatches] of matches) {
      const score = this.evaluate(sticker, stickerMatches, queryWords);

      if (!this.isRelevant(score, stopWordsOnly)) {
        continue;
      }

      results.push({
        sticker,
        score: Math.min(score.final, 10),
        matches: [...stickerMatches.values()].sort((a, b) => b.score - a.score)
      });
    }

    return this.sortAndLimitResults(results, limit);
  }

  /**
   * Считает баллы стикера по его лучшим совпадениям
   */
  private evaluate(
    sticker: PhotoSticker,
    stickerMatches: StickerMatches,
    queryWords: string[]
  ): StickerScore {
    let raw = 0;
    let weight = 0;
    let hasExact = false;

    for (const match of stickerMatches.values()) {
      raw += match.score;
      weight += MATCH_WEIGHT[match.type];
      hasExact ||= match.type === 'exact';
    }

    const ratio = Math.min(weight / queryWords.length, 1);
    const suggestionWords = this.index!.minSuggestionWords.get(sticker) ?? 1;
    const { baseWeight, matchRatioWeight } = this.config.scoring;

    return {
      ratio,
      coverage: Math.min(stickerMatches.size / suggestionWords, 1),
      hasExact,
      final: raw * (baseWeight + ratio * matchRatioWeight)
    };
  }

  /**
   * Отсекает нерелевантные совпадения
   */
  private isRelevant(score: StickerScore, stopWordsOnly: boolean): boolean {
    const { minScore, minMatchRatio, minWeakCoverage, minStopWordCoverage } = this.config.limits;

    // Совпасть должна хотя бы половина слов запроса, иначе это случайное пересечение
    if (score.ratio < minMatchRatio) {
      return false;
    }

    // Запрос из одних стоп-слов ищем только там, где стоп-слово — заметная
    // часть подсказки: «это» уместно для «Это база», но не для длинной фразы
    if (stopWordsOnly && score.coverage < minStopWordCoverage) {
      return false;
    }

    // Без единого точного совпадения слова длинную подсказку не показываем:
    // иначе «кот» вытаскивает длинную фразу из-за слова «которая»
    if (!score.hasExact && score.coverage < minWeakCoverage) {
      return false;
    }

    return score.final >= minScore;
  }

  /**
   * Можно ли считать выдачу окончательной без fuzzy-поиска.
   *
   * Fuzzy закрывает слово запроса хуже любой другой стадии, поэтому его вклад
   * ограничен сверху. Если страница уже заполнена стикерами, у которых совпали
   * все слова запроса (добавить им fuzzy нечего), а балл последнего из них выше
   * этого потолка, то ни один fuzzy-результат в страницу не попадёт и порядок
   * внутри неё не изменится.
   */
  private isPageFinal(results: SearchResult[], queryWords: string[], limit: number): boolean {
    if (results.length < limit) {
      return false;
    }

    // В matches лежит по одному лучшему совпадению на слово запроса,
    // поэтому их количество и есть число закрытых слов
    const allWordsMatched = results.every(result => result.matches.length === queryWords.length);

    return allWordsMatched && results.at(-1)!.score >= this.maxFuzzyScore(queryWords.length);
  }

  /**
   * Верхняя граница балла результата, в котором хотя бы одно слово закрыто fuzzy
   */
  private maxFuzzyScore(wordCount: number): number {
    const { exactMatch, fuzzyMatch, baseWeight, matchRatioWeight } = this.config.scoring;

    const raw = exactMatch * (wordCount - 1) + fuzzyMatch;
    const ratio = (wordCount - 1 + MATCH_WEIGHT.fuzzy) / wordCount;

    return raw * (baseWeight + ratio * matchRatioWeight);
  }

  /**
   * Сортировка и ограничение результатов
   */
  private sortAndLimitResults(results: SearchResult[], limit: number): SearchResult[] {
    return results
      .sort((a, b) => {
        // Сначала по релевантности
        if (Math.abs(a.score - b.score) > 0.01) {
          return b.score - a.score;
        }
        // Затем по количеству совпадений
        if (a.matches.length !== b.matches.length) {
          return b.matches.length - a.matches.length;
        }
        // Наконец, по дате
        const aDate = a.sticker.photo.date || 0;
        const bDate = b.sticker.photo.date || 0;
        return bDate - aDate;
      })
      .slice(0, limit);
  }
}

/**
 * Разбивает эмодзи-запрос на отдельные символы
 */
function extractEmojiChars(emojiQuery: string): string[] {
  const blocks = emojiQuery.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]+/gu) ?? [];
  const result: string[] = [];

  for (const block of blocks) {
    const individual = block.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu);
    result.push(...(individual ?? [block]));
  }

  return result;
}
