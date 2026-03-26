import { ValidationRules } from './config';

/**
 * Результат валидации запроса
 */
export interface ValidationResult {
  isValid: boolean;
  reason?: string;
}

/**
 * Регулярное выражение для поиска эмодзи
 */
const EMOJI_REGEX = /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\u200D]+$/u;

/**
 * Проверяет, состоит ли строка только из эмодзи
 */
function isEmojiOnly(str: string): boolean {
  return EMOJI_REGEX.test(str);
}

/**
 * Валидатор поисковых запросов
 */
export class QueryValidator {
  constructor(private rules: ValidationRules) {}

  /**
   * Проверяет, должны ли отображаться стикеры для данного запроса
   */
  validate(query: string): ValidationResult {
    const normalizedQuery = query.trim();

    // Пустой запрос
    if (normalizedQuery.length === 0) {
      return { isValid: false, reason: 'Empty query' };
    }

    // Запрос только из эмодзи - разрешаем даже одиночные символы
    const emojiQuery = normalizedQuery.replace(/[\s\u200D]/g, '');
    if (emojiQuery.length > 0 && isEmojiOnly(emojiQuery)) {
      // Проверяем только максимальную длину
      if (normalizedQuery.length > this.rules.maxQueryLength) {
        return { isValid: false, reason: 'Query too long' };
      }
      return { isValid: true };
    }

    // Слишком короткий запрос
    if (normalizedQuery.length < this.rules.minQueryLength) {
      return { isValid: false, reason: 'Query too short' };
    }

    // Слишком длинный запрос
    if (normalizedQuery.length > this.rules.maxQueryLength) {
      return { isValid: false, reason: 'Query too long' };
    }

    // Команда (начинается с /)
    if (normalizedQuery.startsWith('/')) {
      return { isValid: false, reason: 'Command detected' };
    }

    // Ссылка
    if (normalizedQuery.includes('http')) {
      return { isValid: false, reason: 'URL detected' };
    }

    // Только цифры
    if (/^\d+$/.test(normalizedQuery)) {
      return { isValid: false, reason: 'Only digits' };
    }

    // Количество слов
    const words = normalizedQuery.split(/\s+/);
    if (words.length > this.rules.maxWords) {
      return { isValid: false, reason: 'Too many words' };
    }

    // Одна буква (не применяется к эмодзи)
    if (!this.rules.allowSingleLetter && words.length === 1 && words[0].length === 1) {
      return { isValid: false, reason: 'Single letter query' };
    }

    return { isValid: true };
  }
}
