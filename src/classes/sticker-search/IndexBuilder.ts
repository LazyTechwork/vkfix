import { PhotoSticker } from '../../modules/messenger/types';
import { SearchIndex } from './types';
import { SIGNIFICANT_PREFIX_LENGTHS } from './config';
import { SemanticMap } from './SemanticMap';

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
   * Индексирует как обычные слова, так и эмодзи
   */
  private buildExactWordIndex(stickers: PhotoSticker[]): Map<string, PhotoSticker[]> {
    const index = new Map<string, PhotoSticker[]>();

    for (const sticker of stickers) {
      for (const word of sticker.lowerWords) {
        // Индексируем обычные слова
        if (!index.has(word)) {
          index.set(word, []);
        }
        index.get(word)!.push(sticker);
        
        // Если слово содержит эмодзи, индексируем их отдельно
        const emojiMatches = word.match(EMOJI_REGEX);
        if (emojiMatches) {
          for (const emoji of emojiMatches) {
            if (!index.has(emoji)) {
              index.set(emoji, []);
            }
            index.get(emoji)!.push(sticker);
          }
        }
        
        // Если слово содержит несколько эмодзи слитно, индексируем каждый отдельно
        if (emojiMatches && emojiMatches.length > 0) {
          // Разбиваем каждый найденный эмодзи-блок на отдельные эмодзи
          for (const emojiBlock of emojiMatches) {
            const individualEmojis = emojiBlock.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu);
            if (individualEmojis && individualEmojis.length > 1) {
              for (const emoji of individualEmojis) {
                if (!index.has(emoji)) {
                  index.set(emoji, []);
                }
                index.get(emoji)!.push(sticker);
              }
            }
          }
        }
      }
    }

    return index;
  }

  /**
   * Строит индекс точных совпадений подсказок
   * Индексирует как обычные слова, так и эмодзи
   */
  private buildExactSuggestionIndex(stickers: PhotoSticker[]): Map<string, PhotoSticker[]> {
    const index = new Map<string, PhotoSticker[]>();

    for (const sticker of stickers) {
      for (const suggestion of sticker.lowerSuggestions) {
        // Индексируем обычные подсказки
        if (!index.has(suggestion)) {
          index.set(suggestion, []);
        }
        index.get(suggestion)!.push(sticker);
        
        // Если подсказка содержит эмодзи, индексируем их отдельно
        const emojiMatches = suggestion.match(EMOJI_REGEX);
        if (emojiMatches) {
          for (const emoji of emojiMatches) {
            if (!index.has(emoji)) {
              index.set(emoji, []);
            }
            index.get(emoji)!.push(sticker);
          }
        }
        
        // Если подсказка содержит несколько эмодзи слитно, индексируем каждый отдельно
        if (emojiMatches && emojiMatches.length > 0) {
          for (const emojiBlock of emojiMatches) {
            const individualEmojis = emojiBlock.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu);
            if (individualEmojis && individualEmojis.length > 1) {
              for (const emoji of individualEmojis) {
                if (!index.has(emoji)) {
                  index.set(emoji, []);
                }
                index.get(emoji)!.push(sticker);
              }
            }
          }
        }
      }
    }

    return index;
  }

  /**
   * Строит оптимизированный индекс префиксов
   * Создает префиксы только для значимых длин (3, 4, 5)
   * Для эмодзи создает записи без префиксов
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
   * Для эмодзи добавляет запись без префиксов
   */
  private addPrefixes(
    index: Map<string, PhotoSticker[]>,
    text: string,
    sticker: PhotoSticker
  ): void {
    // Проверяем, является ли текст эмодзи
    const isEmoji = /^[\p{Emoji_Presentation}\p{Extended_Pictographic}]+$/u.test(text);
    
    if (isEmoji) {
      // Для эмодзи добавляем точную запись без префиксов
      if (!index.has(text)) {
        index.set(text, []);
      }
      const stickers = index.get(text)!;
      if (!stickers.includes(sticker)) {
        stickers.push(sticker);
      }
      return;
    }

    // Для обычных слов добавляем префиксы
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
