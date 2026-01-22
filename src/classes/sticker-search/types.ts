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
 * Опции поиска
 */
export interface SearchOptions {
  enableSemantic?: boolean;
  boostExactMatches?: number;
  boostStartsWith?: number;
  maxResults?: number;
  minScore?: number;
}
