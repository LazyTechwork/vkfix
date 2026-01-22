/**
 * Конфигурация системы поиска стикеров
 */

export interface ScoringConfig {
  /** Множитель для точных совпадений */
  exactMatch: number;
  /** Множитель для префиксных совпадений */
  prefixMatch: number;
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
  /** Максимальное количество результатов */
  maxResults: number;
  /** Минимальный порог релевантности */
  minScore: number;
  /** Максимальное количество слов в запросе */
  maxQueryWords: number;
  /** Минимальная длина префикса для поиска */
  minPrefixLength: number;
  /** Максимальная длина префикса для поиска */
  maxPrefixLength: number;
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
  /** Максимальное количество слов в запросе */
  maxWords: number;
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
    semanticMatch: 0.7,
    fuzzyMatch: 0.5,
    baseWeight: 0.5,
    matchRatioWeight: 0.5
  },
  limits: {
    maxResults: 50,
    minScore: 0.2,
    maxQueryWords: 5,
    minPrefixLength: 3,
    maxPrefixLength: 6
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
    maxWords: 3,
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
