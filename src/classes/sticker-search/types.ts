import { PhotoSticker } from '../../modules/messenger/types';
import { PrefixIndex } from './PrefixIndex';

/**
 * Тип совпадения
 *
 * Порядок отражает качество: exact — слово совпало целиком, prefix — запрос
 * является началом слова, stem — слова совпали основами, common — у слов общее
 * начало, но ни одно не является префиксом другого, semantic — синоним,
 * fuzzy — совпадение с опечаткой.
 */
export type MatchType = 'exact' | 'prefix' | 'stem' | 'common' | 'semantic' | 'fuzzy';

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
  /** Слово индекса, с которым совпал запрос */
  value: string;
  /** Слово запроса, породившее совпадение — по нему считается доля совпавших слов */
  queryWord: string;
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
  /** Точные совпадения подсказок целиком */
  exactSuggestions: Map<string, PhotoSticker[]>;
  /** Совпадения по основе слова */
  stemWords: Map<string, PhotoSticker[]>;
  /** Словарь слов для префиксного поиска */
  prefixIndex: PrefixIndex;
  /** Длина самой короткой подсказки стикера в словах — по ней считается покрытие */
  minSuggestionWords: Map<PhotoSticker, number>;
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
