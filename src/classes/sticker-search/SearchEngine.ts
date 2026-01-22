import { PhotoSticker } from '../../modules/messenger/types';
import { SearchResult, SearchIndex, MatchDetails } from './types';
import { StickerSearchConfig, DEFAULT_SEARCH_CONFIG } from './config';
import { IndexBuilder } from './IndexBuilder';
import { QueryValidator } from './QueryValidator';
import { TextNormalizer } from './TextNormalizer';
import { FuzzyMatcher } from './FuzzyMatcher';
import { switchKeyboardLayout } from '../../common/helpers/switchKeyboardLayout';
import { Logger } from '../Logger';

/**
 * Главный движок поиска стикеров
 */
export class SearchEngine {
  private index: SearchIndex | null = null;
  private isIndexBuilt = false;
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
   * Построить индекс для стикеров
   */
  buildIndex(stickers: PhotoSticker[]): void {
    if (this.isIndexBuilt) return;
    
    this.index = this.indexBuilder.buildIndex(stickers);
    this.isIndexBuilt = true;
  }

  /**
   * Основная функция поиска
   */
  search(stickers: PhotoSticker[], query: string): PhotoSticker[] {
    // Строим индекс если его нет
    if (!this.isIndexBuilt) {
      this.buildIndex(stickers);
    }

    // Валидация запроса
    const validation = this.validator.validate(query);
    if (!validation.isValid) {
      return [];
    }

    const normalizedQuery = this.normalizer.normalizeQuery(query);
    const queryWords = this.normalizer.extractWords(normalizedQuery);

    if (queryWords.length === 0) {
      return [];
    }

    // Проверяем, является ли запрос одной буквой
    const isSingleLetterQuery = queryWords.length === 1 && queryWords[0].length === 1;
    if (isSingleLetterQuery) {
      return [];
    }

    // Пробуем поиск с оригинальным запросом
    let results = this.performSearch(stickers, normalizedQuery, queryWords);

    // Если ничего не нашли и включено переключение раскладки, пробуем переключить
    if (results.length === 0 && this.config.features.enableLayoutSwitch) {
      const switchedQuery = switchKeyboardLayout(normalizedQuery);
      if (switchedQuery !== normalizedQuery) {
        const switchedWords = this.normalizer.extractWords(switchedQuery);
        results = this.performSearch(stickers, switchedQuery, switchedWords);
      }
    }

    return results.map(r => r.sticker);
  }

  /**
   * Выполнить поиск
   */
  private performSearch(
    stickers: PhotoSticker[],
    query: string,
    queryWords: string[]
  ): SearchResult[] {
    const candidateStickers = new Set<PhotoSticker>();
    const stickerScores = new Map<PhotoSticker, { score: number; matches: MatchDetails[] }>();

    // 1. Точные совпадения
    this.searchExactMatches(queryWords, candidateStickers, stickerScores);

    // 2. Частичные совпадения (префиксы)
    if (candidateStickers.size < this.config.limits.maxResults * 2) {
      this.searchPartialMatches(queryWords, candidateStickers, stickerScores);
    }

    // 3. Семантический поиск
    if (this.config.features.enableSemantic) {
      this.searchSemanticMatches(queryWords, candidateStickers, stickerScores);
    }

    // 4. Fuzzy поиск (если включен)
    if (this.config.features.enableFuzzy) {
      this.searchFuzzyMatches(queryWords, candidateStickers, stickerScores);
    }

    // 5. Формирование результатов
    return this.buildResults(stickerScores, queryWords);
  }

  /**
   * Поиск точных совпадений
   */
  private searchExactMatches(
    queryWords: string[],
    candidateStickers: Set<PhotoSticker>,
    stickerScores: Map<PhotoSticker, { score: number; matches: MatchDetails[] }>
  ): void {
    for (const word of queryWords) {
      // Точные совпадения в словах
      const exactWordMatches = this.index!.exactWords.get(word) || [];
      for (const sticker of exactWordMatches) {
        candidateStickers.add(sticker);
        this.addMatch(stickerScores, sticker, {
          type: 'exact',
          field: 'word',
          value: word,
          score: 1.0 * this.config.scoring.exactMatch
        });
      }

      // Точные совпадения в подсказках
      const exactSuggestionMatches = this.index!.exactSuggestions.get(word) || [];
      for (const sticker of exactSuggestionMatches) {
        candidateStickers.add(sticker);
        this.addMatch(stickerScores, sticker, {
          type: 'exact',
          field: 'suggestion',
          value: word,
          score: 1.0 * this.config.scoring.exactMatch
        });
      }
    }
  }

  /**
   * Поиск частичных совпадений (префиксы)
   */
  private searchPartialMatches(
    queryWords: string[],
    candidateStickers: Set<PhotoSticker>,
    stickerScores: Map<PhotoSticker, { score: number; matches: MatchDetails[] }>
  ): void {
    for (const word of queryWords) {
      if (word.length >= this.config.limits.minPrefixLength) {
        for (
          let i = this.config.limits.minPrefixLength;
          i <= Math.min(word.length, this.config.limits.maxPrefixLength);
          i++
        ) {
          const prefix = word.substring(0, i);
          const partialMatches = this.index!.partialWords.get(prefix) || [];
          for (const sticker of partialMatches) {
            if (!candidateStickers.has(sticker)) {
              candidateStickers.add(sticker);
              this.addMatch(stickerScores, sticker, {
                type: 'partial',
                field: 'word',
                value: prefix,
                score: 0.6 * (i / word.length)
              });
            }
          }
        }
      }
    }
  }

  /**
   * Поиск семантических совпадений
   */
  private searchSemanticMatches(
    queryWords: string[],
    candidateStickers: Set<PhotoSticker>,
    stickerScores: Map<PhotoSticker, { score: number; matches: MatchDetails[] }>
  ): void {
    for (const word of queryWords) {
      const synonyms = this.index!.semanticMap.get(word) || new Set();
      
      for (const synonym of synonyms) {
        if (synonym === word) continue; // Пропускаем само слово
        
        const semanticMatches = this.index!.exactWords.get(synonym) || [];
        
        for (const sticker of semanticMatches) {
          candidateStickers.add(sticker);
          this.addMatch(stickerScores, sticker, {
            type: 'semantic',
            field: 'word',
            value: synonym,
            score: this.config.scoring.semanticMatch
          });
        }
      }
    }
  }

  /**
   * Поиск с учетом опечаток (Fuzzy Matching)
   */
  private searchFuzzyMatches(
    queryWords: string[],
    candidateStickers: Set<PhotoSticker>,
    stickerScores: Map<PhotoSticker, { score: number; matches: MatchDetails[] }>
  ): void {
    // Получаем словарь всех слов из индекса
    const dictionary = Array.from(this.index!.exactWords.keys());

    for (const queryWord of queryWords) {
      const maxDistance = this.fuzzyMatcher.getMaxDistance(queryWord.length);
      
      // Пропускаем слишком короткие слова
      if (maxDistance === 0) continue;

      const similarWords = this.fuzzyMatcher.findSimilarWords(
        queryWord,
        dictionary,
        maxDistance
      );

      for (const { word, distance } of similarWords) {
        // Пропускаем точные совпадения (они уже найдены)
        if (distance === 0) continue;

        const fuzzyMatches = this.index!.exactWords.get(word) || [];
        for (const sticker of fuzzyMatches) {
          if (!candidateStickers.has(sticker)) {
            candidateStickers.add(sticker);
            
            const fuzzyScore = this.fuzzyMatcher.calculateFuzzyScore(distance, queryWord.length);
            this.addMatch(stickerScores, sticker, {
              type: 'fuzzy',
              field: 'word',
              value: word,
              score: fuzzyScore * this.config.scoring.fuzzyMatch
            });
          }
        }
      }
    }
  }

  /**
   * Добавить совпадение к стикеру
   */
  private addMatch(
    stickerScores: Map<PhotoSticker, { score: number; matches: MatchDetails[] }>,
    sticker: PhotoSticker,
    match: MatchDetails
  ): void {
    if (!stickerScores.has(sticker)) {
      stickerScores.set(sticker, { score: 0, matches: [] });
    }

    const data = stickerScores.get(sticker)!;
    data.score += match.score;
    data.matches.push(match);
  }

  /**
   * Построить финальные результаты
   */
  private buildResults(
    stickerScores: Map<PhotoSticker, { score: number; matches: MatchDetails[] }>,
    queryWords: string[]
  ): SearchResult[] {
    const results: SearchResult[] = [];
    const queryWordsSet = new Set(queryWords);

    for (const [sticker, stickerData] of stickerScores.entries()) {
      // Бонус за количество совпавших слов запроса
      const matchedQueryWords = new Set(
        stickerData.matches.map(m => m.value.toLowerCase())
      );
      const matchRatio = this.calculateMatchRatio(matchedQueryWords, queryWordsSet);
      
      const finalScore =
        stickerData.score *
        (this.config.scoring.baseWeight + matchRatio * this.config.scoring.matchRatioWeight);

      if (finalScore >= this.config.limits.minScore) {
        results.push({
          sticker,
          score: Math.min(finalScore, 10),
          matches: stickerData.matches.sort((a, b) => b.score - a.score)
        });
      }
    }

    return this.sortAndLimitResults(results);
  }

  /**
   * Вычислить коэффициент совпадения слов запроса
   */
  private calculateMatchRatio(matchedWords: Set<string>, queryWords: Set<string>): number {
    if (queryWords.size === 0) return 0;

    let matches = 0;
    for (const queryWord of queryWords) {
      // Проверяем точные совпадения
      if (matchedWords.has(queryWord)) {
        matches++;
        continue;
      }

      // Проверяем семантические совпадения
      const synonyms = this.index!.semanticMap.get(queryWord) || new Set();
      for (const matchedWord of matchedWords) {
        if (synonyms.has(matchedWord)) {
          matches += 0.9; // Семантическое совпадение почти как точное
          break;
        }
      }

      // Проверяем частичные совпадения
      if (matches === 0 || matches % 1 !== 0) { // Если еще не нашли совпадение
        for (const matchedWord of matchedWords) {
          if (matchedWord.includes(queryWord) || queryWord.includes(matchedWord)) {
            matches += 0.7; // Частичное совпадение
            break;
          }
        }
      }
    }

    return Math.min(matches / queryWords.size, 1);
  }

  /**
   * Сортировка и ограничение результатов
   */
  private sortAndLimitResults(results: SearchResult[]): SearchResult[] {
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
      .slice(0, this.config.limits.maxResults);
  }
}
