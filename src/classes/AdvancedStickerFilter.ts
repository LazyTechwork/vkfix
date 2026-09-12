import { PhotoSticker } from "../modules/messenger/types";
import { Logger } from "./Logger";
import { SearchEngine } from "./sticker-search/SearchEngine";

// Реэкспорт типов движка — дублировать их здесь нельзя, разойдутся
export type { SearchResult, MatchDetails, MatchType, SearchOptions } from "./sticker-search/types";

// Singleton экземпляр движка поиска
let searchEngine: SearchEngine | null = null;

/**
 * Умный поиск стикеров (главная функция)
 *
 * @param limit сколько стикеров нужно показать. Ранжирование всегда полное,
 *              лимит задаёт только длину выдачи — увеличивайте его при
 *              подгрузке следующей порции.
 */
export function smartStickerSearch(
    stickers: PhotoSticker[],
    userMessage: string,
    limit?: number
): PhotoSticker[] {
    if (!searchEngine) {
        Logger.error('smartStickerSearch: search engine not initialized');
        return [];
    }

    try {
        return searchEngine.search(stickers, userMessage, limit);
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
