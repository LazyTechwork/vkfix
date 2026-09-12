import { uniq } from 'es-toolkit';
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
 * Приводит буквы к единому виду: нижний регистр и «ё» → «е».
 *
 * «ё» нужна и в индексе, и в запросе: без приведения «ёжик» и «ежик»
 * оказываются разными словами и стикер не находится по одному из написаний.
 */
export function normalizeLetters(text: string): string {
  return text.toLowerCase().replaceAll('ё', 'е');
}

/**
 * Приводит текст к виду, в котором он сравнивается при поиске:
 * без пунктуации, без двойных пробелов, с сохранением эмодзи.
 * Одной функцией пользуются и индекс, и запрос — иначе подсказка
 * «Как дела?» никогда не совпала бы с запросом «как дела».
 */
export function normalizeText(text: string): string {
  // Проверяем, является ли текст чистым эмодзи (или последовательностью эмодзи с пробелами)
  const trimmed = text.trim();
  const emojiOnly = trimmed.replace(/[\s\u200D]/g, '');

  // Если текст состоит только из эмодзи, возвращаем его как есть
  if (emojiOnly.length > 0 && /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\u200D]+$/u.test(emojiOnly)) {
    return trimmed;
  }

  // Для смешанного текста сохраняем буквы, цифры, пробелы и эмодзи
  return normalizeLetters(text)
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s\u0400-\u04FF\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '');
}

/**
 * Нормализатор текста для поиска
 */
export class TextNormalizer {
  /**
   * Нормализует запрос для поиска
   */
  normalizeQuery(query: string): string {
    return normalizeText(query);
  }

  /**
   * Выбирает слова запроса, по которым идёт поиск.
   *
   * Стоп-слова отбрасываются, но если запрос состоит из них целиком
   * («это», «как дела»), возвращаем его как есть — иначе поиск молча
   * вернул бы пустоту. Длинные сообщения урезаем до самых значимых слов:
   * чем слово длиннее, тем оно информативнее.
   */
  selectQueryWords(words: string[], maxWords: number): string[] {
    const unique = uniq(words);
    const meaningful = unique.filter(word => !this.isStopWord(word));
    const selected = meaningful.length > 0 ? meaningful : unique;

    if (selected.length <= maxWords) {
      return selected;
    }

    const significant = new Set(
      [...selected].sort((a, b) => b.length - a.length).slice(0, maxWords)
    );

    // Сохраняем исходный порядок слов
    return selected.filter(word => significant.has(word));
  }

  /**
   * Проверяет, состоит ли набор слов только из стоп-слов
   */
  isStopWordsOnly(words: string[]): boolean {
    return words.length > 0 && words.every(word => this.isStopWord(word));
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
      });
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
      const letterMatches = token.match(/[а-яёa-z0-9]+/g);
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
