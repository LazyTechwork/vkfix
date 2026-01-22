import { PhotoSticker } from '../../modules/messenger/types';
import { SearchIndex } from './types';
import { SIGNIFICANT_PREFIX_LENGTHS } from './config';
import { SemanticMap } from './SemanticMap';

/**
 * Построитель поисковых индексов
 */
export class IndexBuilder {
  /**
   * Строит полный поисковый индекс
   */
  buildIndex(stickers: PhotoSticker[]): SearchIndex {
    const exactWords = this.buildExactWordIndex(stickers);
    const exactSuggestions = this.buildExactSuggestionIndex(stickers);
    const partialWords = this.buildPrefixIndex(stickers);
    const semanticMap = SemanticMap.getInstance().getMap();

    return {
      exactWords,
      exactSuggestions,
      partialWords,
      semanticMap
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
   * Строит индекс точных совпадений слов
   */
  private buildExactWordIndex(stickers: PhotoSticker[]): Map<string, PhotoSticker[]> {
    const index = new Map<string, PhotoSticker[]>();

    for (const sticker of stickers) {
      for (const word of sticker.lowerWords) {
        if (!index.has(word)) {
          index.set(word, []);
        }
        index.get(word)!.push(sticker);
      }
    }

    return index;
  }

  /**
   * Строит индекс точных совпадений подсказок
   */
  private buildExactSuggestionIndex(stickers: PhotoSticker[]): Map<string, PhotoSticker[]> {
    const index = new Map<string, PhotoSticker[]>();

    for (const sticker of stickers) {
      for (const suggestion of sticker.lowerSuggestions) {
        if (!index.has(suggestion)) {
          index.set(suggestion, []);
        }
        index.get(suggestion)!.push(sticker);
      }
    }

    return index;
  }

  /**
   * Строит оптимизированный индекс префиксов
   * Создает префиксы только для значимых длин (3, 4, 5)
   */
  private buildPrefixIndex(stickers: PhotoSticker[]): Map<string, PhotoSticker[]> {
    const index = new Map<string, PhotoSticker[]>();

    for (const sticker of stickers) {
      // Индексируем слова
      for (const word of sticker.lowerWords) {
        this.addPrefixes(index, word, sticker);
      }

      // Индексируем подсказки
      for (const suggestion of sticker.lowerSuggestions) {
        this.addPrefixes(index, suggestion, sticker);
      }
    }

    return index;
  }

  /**
   * Добавляет префиксы для слова в индекс
   */
  private addPrefixes(
    index: Map<string, PhotoSticker[]>,
    text: string,
    sticker: PhotoSticker
  ): void {
    for (const length of SIGNIFICANT_PREFIX_LENGTHS) {
      if (text.length >= length) {
        const prefix = text.substring(0, length);
        if (!index.has(prefix)) {
          index.set(prefix, []);
        }
        const stickers = index.get(prefix)!;
        if (!stickers.includes(sticker)) {
          stickers.push(sticker);
        }
      }
    }
  }
}
