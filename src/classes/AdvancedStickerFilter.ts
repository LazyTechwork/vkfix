import { PhotoSticker } from "../modules/messenger/types";
import { Logger } from "./Logger";
import { SearchEngine } from "./sticker-search/SearchEngine";

// Экспортируем типы для обратной совместимости
export interface SearchResult {
    sticker: PhotoSticker;
    score: number;
    matches: MatchDetails[];
}

export interface MatchDetails {
    type: 'exact' | 'partial' | 'fuzzy' | 'semantic';
    field: 'word' | 'suggestion';
    value: string;
    score: number;
    position?: number;
}

export interface SearchOptions {
    enableSemantic?: boolean;
    boostExactMatches?: number;
    boostStartsWith?: number;
    maxResults?: number;
    minScore?: number;
}

// Singleton экземпляр движка поиска
let searchEngine: SearchEngine | null = null;

/**
 * Умный поиск стикеров (главная функция)
 */
export function smartStickerSearch(
    stickers: PhotoSticker[],
    userMessage: string
): PhotoSticker[] {
    if (!searchEngine) {
        Logger.error('smartStickerSearch: search engine not initialized');
        return [];
    }

    try {
        return searchEngine.search(stickers, userMessage);
    } catch (error) {
        Logger.error('smartStickerSearch: error during search', error);
        return [];
    }
}

/**
 * Инициализация поиска стикеров
 */
export function initializeStickerSearch(stickers: PhotoSticker[]): void {
    if (!searchEngine) {
        searchEngine = new SearchEngine();
    }
    searchEngine.buildIndex(stickers);
}

/**
 * Сброс поиска стикеров (для тестов)
 */
export function resetStickerSearch(): void {
    searchEngine = null;
}
