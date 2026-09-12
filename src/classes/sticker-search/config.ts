/**
 * Конфигурация системы поиска стикеров
 */

export interface ScoringConfig {
  /** Множитель для точных совпадений */
  exactMatch: number;
  /** Множитель для префиксных совпадений (запрос — начало слова) */
  prefixMatch: number;
  /** Множитель для совпадений по основе слова */
  stemMatch: number;
  /** Множитель для совпадений по общему началу слов */
  commonPrefixMatch: number;
  /** Множитель для семантических совпадений */
  semanticMatch: number;
  /** Множитель для fuzzy совпадений */
  fuzzyMatch: number;
  /** Базовый вес в формуле финального балла */
  baseWeight: number;
  /** Вес коэффициента совпадения в формуле финального балла */
  matchRatioWeight: number;
}

export interface SearchLimits {
  /** Размер выдачи по умолчанию */
  maxResults: number;
  /** Минимальный порог релевантности */
  minScore: number;
  /** Сколько значимых слов запроса участвует в поиске */
  maxQueryWords: number;
  /** Минимальная длина слова, по которому имеет смысл искать префиксом */
  minPrefixLength: number;
  /**
   * Минимальная длина общего начала слов.
   * Короткое общее начало у длинных слов отсеет сама формула балла:
   * он считается как доля общего начала от более длинного слова.
   */
  minCommonPrefixLength: number;
  /** Минимальная доля совпавших слов запроса */
  minMatchRatio: number;
  /** Минимальное покрытие подсказки, если точных совпадений слов нет */
  minWeakCoverage: number;
  /** Минимальное покрытие подсказки для запроса из одних стоп-слов */
  minStopWordCoverage: number;
}

export interface SearchFeatures {
  /** Включить семантический поиск */
  enableSemantic: boolean;
  /** Включить fuzzy matching */
  enableFuzzy: boolean;
  /** Включить переключение раскладки */
  enableLayoutSwitch: boolean;
  /** Включить контекстную релевантность */
  enableContextual: boolean;
}

export interface ValidationRules {
  /** Минимальная длина запроса */
  minQueryLength: number;
  /** Максимальная длина запроса */
  maxQueryLength: number;
  /** Разрешить запросы из одной буквы */
  allowSingleLetter: boolean;
}

export interface StickerSearchConfig {
  scoring: ScoringConfig;
  limits: SearchLimits;
  features: SearchFeatures;
  validation: ValidationRules;
}

/**
 * Конфигурация по умолчанию
 */
export const DEFAULT_SEARCH_CONFIG: StickerSearchConfig = {
  scoring: {
    exactMatch: 2.5,
    prefixMatch: 1.8,
    stemMatch: 1.5,
    commonPrefixMatch: 1.0,
    semanticMatch: 0.7,
    fuzzyMatch: 0.5,
    baseWeight: 0.25,      // Баланс между base и matchRatio
    matchRatioWeight: 0.75  // Больше веса на % совпадения слов
  },
  limits: {
    maxResults: 50,
    minScore: 0.3,         // Понижен для точных совпадений
    maxQueryWords: 5,
    minPrefixLength: 3,    // По двум буквам префиксный поиск даёт только шум
    minCommonPrefixLength: 3,
    minMatchRatio: 0.5,    // Половина слов запроса должна совпасть
    minWeakCoverage: 0.25,
    minStopWordCoverage: 0.5
  },
  features: {
    enableSemantic: true,
    enableFuzzy: true,
    enableLayoutSwitch: true,
    enableContextual: false
  },
  validation: {
    minQueryLength: 1,
    maxQueryLength: 50,
    allowSingleLetter: false
  }
} as const;

/**
 * Стоп-слова для фильтрации
 */
export const STOP_WORDS = new Set([
  'я', 'ты', 'он', 'она', 'оно', 'мы', 'вы', 'они',
  'и', 'в', 'на', 'с', 'а', 'но', 'что', 'как',
  'это', 'то', 'все', 'еще', 'уже', 'только'
]);

/**
 * Значимые длины префиксов для оптимизации
 */
export const SIGNIFICANT_PREFIX_LENGTHS = [3, 4, 5];
