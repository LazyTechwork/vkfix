import { PhotoSticker } from '../../modules/messenger/types';

/**
 * Тип совпадения
 */
export type MatchType = 'exact' | 'partial' | 'fuzzy' | 'semantic';

/**
 * Поле для поиска
 */
export type SearchField = 'word' | 'suggestion';

/**
 * Детали совпадения
 */
export interface MatchDetails {
  type: MatchType;
  field: SearchField;
  value: string;
  score: number;
  position?: number;
}

/**
 * Результат поиска
 */
export interface SearchResult {
  sticker: PhotoSticker;
  score: number;
  matches: MatchDetails[];
}

/**
 * Поисковый индекс
 */
export interface SearchIndex {
  /** Точные совпадения слов */
  exactWords: Map<string, PhotoSticker[]>;
  /** Точные совпадения подсказок */
  exactSuggestions: Map<string, PhotoSticker[]>;
  /** Частичные совпадения (префиксы) */
  partialWords: Map<string, PhotoSticker[]>;
  /** Семантические связи */
  semanticMap: Map<string, Set<string>>;
}

/**
 * Оптимизированный поисковый индекс с дедупликацией
 * Хранит только ID стикеров вместо полных объектов
 */
export interface OptimizedSearchIndex {
  /** Точные совпадения слов (слово -> Set<stickerId>) */
  exactWords: Map<string, Set<number>>;
  /** Точные совпадения подсказок (подсказка -> Set<stickerId>) */
  exactSuggestions: Map<string, Set<number>>;
  /** Частичные совпадения (префикс -> Set<stickerId>) */
  partialWords: Map<string, Set<number>>;
  /** Семантические связи (слово -> Set<синонимов>) */
  semanticMap: Map<string, Set<string>>;
  /** Хранилище стикеров (stickerId -> PhotoSticker) */
  stickerStore: Map<number, PhotoSticker>;
}

/**
 * Статистика использования памяти индексом
 */
export interface IndexMemoryStats {
  /** Количество уникальных стикеров */
  uniqueStickers: number;
  /** Количество записей в exactWords */
  exactWordsEntries: number;
  /** Количество записей в exactSuggestions */
  exactSuggestionsEntries: number;
  /** Количество записей в partialWords */
  partialWordsEntries: number;
  /** Общее количество ссылок на стикеры */
  totalStickerReferences: number;
  /** Оценка использования памяти (байты) */
  estimatedMemoryBytes: number;
}

/**
 * Опции поиска
 */
export interface SearchOptions {
  enableSemantic?: boolean;
  boostExactMatches?: number;
  boostStartsWith?: number;
  maxResults?: number;
  minScore?: number;
}
