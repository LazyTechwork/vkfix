import { STOP_WORDS } from './config';

/**
 * Регулярное выражение для поиска эмодзи
 * Охватывает основные диапазоны Unicode для эмодзи
 */
const EMOJI_REGEX = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u;

/**
 * Проверяет, является ли строка эмодзи (только эмодзи, без других символов)
 */
function isEmoji(str: string): boolean {
  return EMOJI_REGEX.test(str);
}

/**
 * Нормализатор текста для поиска
 */
export class TextNormalizer {
  /**
   * Нормализует запрос для поиска
   * Сохраняет эмодзи, удаляет лишние пробелы и спецсимволы
   */
  normalizeQuery(query: string): string {
    // Проверяем, является ли запрос чистым эмодзи (или последовательностью эмодзи с пробелами)
    const trimmedQuery = query.trim();
    const emojiOnlyQuery = trimmedQuery.replace(/[\s\u200D]/g, '');
    
    // Если запрос состоит только из эмодзи, возвращаем его как есть
    if (emojiOnlyQuery.length > 0 && /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\u200D]+$/u.test(emojiOnlyQuery)) {
      return trimmedQuery;
    }

    // Для смешанных запросов сохраняем буквы, цифры, пробелы и эмодзи
    return query
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s\u0400-\u04FF\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '');
  }

  /**
   * Извлекает слова из текста
   * Обрабатывает эмодзи как отдельные "слова"
   */
  extractWords(text: string): string[] {
    // Разделяем по пробелам, но сохраняем последовательности эмодзи
    const tokens = text.split(/\s+/).filter(token => token.length > 0);
    
    return tokens
      .flatMap(token => {
        // Если токен содержит эмодзи, извлекаем их отдельно
        const emojiMatches = token.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]+/gu);
        const letters = token.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim();
        
        const result: string[] = [];
        if (letters) {
          result.push(letters);
        }
        if (emojiMatches) {
          result.push(...emojiMatches);
        }
        return result;
      })
      .filter(word => !this.isStopWord(word));
  }

  /**
   * Извлекает ключевые слова для поиска (удаляет стоп-слова)
   */
  extractSearchKeywords(message: string): string {
    // Проверяем, является ли запрос чистым эмодзи
    const trimmedMessage = message.trim();
    const emojiOnlyQuery = trimmedMessage.replace(/[\s\u200D]/g, '');
    
    if (emojiOnlyQuery.length > 0 && /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\u200D]+$/u.test(emojiOnlyQuery)) {
      return trimmedMessage;
    }

    const cleaned = message
      .replace(/[^\w\s\u0400-\u04FF\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleaned) {
      return message.trim();
    }

    const words = cleaned.split(' ').filter(word => word.length > 0);
    const meaningfulWords = words.filter(word => !this.isStopWord(word));

    return meaningfulWords.length === 0 ? cleaned : meaningfulWords.join(' ');
  }

  /**
   * Проверяет, является ли слово стоп-словом
   */
  private isStopWord(word: string): boolean {
    return STOP_WORDS.has(word.toLowerCase());
  }

  /**
   * Извлекает слова из текста (для индексации)
   * Поддерживает эмодзи как отдельные единицы
   */
  getWords(str: string): string[] {
    // Разделяем по пробелам и спецсимволам, но сохраняем эмодзи
    const tokens = str.toLowerCase().split(/[\s]+/).filter(x => x.length > 0);
    
    const result: string[] = [];
    for (const token of tokens) {
      // Извлекаем буквы/цифры
      const letterMatches = token.match(/[а-яa-z0-9]+/g);
      if (letterMatches) {
        result.push(...letterMatches);
      }
      
      // Извлекаем эмодзи
      const emojiMatches = token.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]+/gu);
      if (emojiMatches) {
        result.push(...emojiMatches);
      }
    }
    
    return result;
  }
}
