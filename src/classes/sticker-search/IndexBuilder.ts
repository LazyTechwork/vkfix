import { PhotoSticker } from '../../modules/messenger/types';
import { SearchIndex } from './types';
import { SemanticMap } from './SemanticMap';
import { PrefixIndex } from './PrefixIndex';
import { stemWord } from './Stemmer';
import { normalizeLetters, normalizeText } from './TextNormalizer';

/**
 * Регулярное выражение для поиска эмодзи
 */
const EMOJI_REGEX = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]+/gu;

/**
 * Построитель поисковых индексов
 */
export class IndexBuilder {
  /**
   * Строит полный поисковый индекс
   */
  buildIndex(stickers: PhotoSticker[]): SearchIndex {
    const exactWords = new Map<string, PhotoSticker[]>();
    const exactSuggestions = new Map<string, PhotoSticker[]>();
    const stemWords = new Map<string, PhotoSticker[]>();
    const minSuggestionWords = new Map<PhotoSticker, number>();

    for (const sticker of stickers) {
      minSuggestionWords.set(sticker, countShortestSuggestion(sticker));
      this.indexWords(sticker, exactWords, stemWords);
      this.indexSuggestions(sticker, exactSuggestions);
    }

    return {
      exactWords,
      exactSuggestions,
      stemWords,
      prefixIndex: new PrefixIndex(exactWords.keys()),
      minSuggestionWords,
      semanticMap: SemanticMap.getInstance().getMap()
    };
  }

  /**
   * Загружает семантическую карту из JSON (опционально)
   */
  async loadSemanticMapFromJSON(jsonPath: string): Promise<void> {
    try {
      // В браузерном окружении используем fetch
      const response = await fetch(jsonPath);
      const jsonData = await response.json();
      await SemanticMap.getInstance().loadFromJSON(jsonData);
    } catch (error) {
      console.warn('Failed to load semantic map from JSON, using default:', error);
    }
  }

  /**
   * Индексирует слова стикера: само слово, его эмодзи и основу
   */
  private indexWords(
    sticker: PhotoSticker,
    exactWords: Map<string, PhotoSticker[]>,
    stemWords: Map<string, PhotoSticker[]>
  ): void {
    for (const word of sticker.lowerWords) {
      const normalized = normalizeLetters(word);
      addToIndex(exactWords, normalized, sticker);

      for (const emoji of extractEmojis(word)) {
        addToIndex(exactWords, emoji, sticker);
      }

      // Основу храним отдельно, только если она отличается от слова
      const stem = stemWord(normalized);
      if (stem !== normalized) {
        addToIndex(stemWords, stem, sticker);
      }
    }
  }

  /**
   * Индексирует подсказки стикера целиком и эмодзи внутри них
   */
  private indexSuggestions(
    sticker: PhotoSticker,
    exactSuggestions: Map<string, PhotoSticker[]>
  ): void {
    for (const suggestion of sticker.lowerSuggestions) {
      addToIndex(exactSuggestions, normalizeText(suggestion), sticker);

      for (const emoji of extractEmojis(suggestion)) {
        addToIndex(exactSuggestions, emoji, sticker);
      }
    }
  }
}

/**
 * Длина самой короткой подсказки стикера в словах.
 *
 * Подсказки — взаимозаменяемые варианты одной и той же реплики, поэтому берём
 * минимум: стикер с вариантом «Хахаха» остаётся коротким, даже если рядом
 * лежит вариант из трёх слов.
 */
function countShortestSuggestion(sticker: PhotoSticker): number {
  let shortest = sticker.lowerWords.length || 1;

  for (const suggestion of sticker.lowerSuggestions) {
    const words = suggestion.split(/\s+/).filter(word => word.length > 0).length;

    if (words > 0 && words < shortest) {
      shortest = words;
    }
  }

  return shortest;
}

/**
 * Извлекает эмодзи: и слитные последовательности, и каждый символ отдельно
 */
function extractEmojis(text: string): string[] {
  const blocks = text.match(EMOJI_REGEX);
  if (!blocks) {
    return [];
  }

  const result: string[] = [];

  for (const block of blocks) {
    result.push(block);

    const individual = block.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu);
    if (individual && individual.length > 1) {
      result.push(...individual);
    }
  }

  return result;
}

/**
 * Добавляет стикер в индекс без дублей
 */
function addToIndex(
  index: Map<string, PhotoSticker[]>,
  key: string,
  sticker: PhotoSticker
): void {
  const stickers = index.get(key);

  if (!stickers) {
    index.set(key, [sticker]);
    return;
  }

  if (!stickers.includes(sticker)) {
    stickers.push(sticker);
  }
}
