import { STOP_WORDS } from './config';

/**
 * Нормализатор текста для поиска
 */
export class TextNormalizer {
  /**
   * Нормализует запрос для поиска
   */
  normalizeQuery(query: string): string {
    return query
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s\u0400-\u04FF]/g, '');
  }

  /**
   * Извлекает слова из текста
   */
  extractWords(text: string): string[] {
    return text
      .split(/\s+/)
      .filter(word => word.length > 0)
      .filter(word => !this.isStopWord(word));
  }

  /**
   * Извлекает ключевые слова для поиска (удаляет стоп-слова)
   */
  extractSearchKeywords(message: string): string {
    const cleaned = message
      .replace(/[^\w\s\u0400-\u04FF]/g, ' ')
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
   */
  getWords(str: string): string[] {
    return str
      .toLowerCase()
      .split(/[^а-яa-z0-9]/g)
      .filter(x => x.length > 0);
  }
}
