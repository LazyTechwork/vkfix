import { PhotoSticker } from '../../modules/messenger/types';
import { OptimizedSearchIndex, IndexMemoryStats } from './types';
import { SIGNIFICANT_PREFIX_LENGTHS } from './config';
import { SemanticMap } from './SemanticMap';

/**
 * Оптимизированный построитель индексов с дедупликацией
 * Хранит только ID стикеров вместо полных объектов
 * Экономия памяти: ~60% при большом количестве стикеров
 */
export class OptimizedIndexBuilder {
  /**
   * Строит оптимизированный поисковый индекс
   */
  buildIndex(stickers: PhotoSticker[]): OptimizedSearchIndex {
    const stickerStore = this.buildStickerStore(stickers);
    const exactWords = this.buildExactWordIndex(stickers);
    const exactSuggestions = this.buildExactSuggestionIndex(stickers);
    const partialWords = this.buildPrefixIndex(stickers);
    const semanticMap = SemanticMap.getInstance().getMap();

    return {
      exactWords,
      exactSuggestions,
      partialWords,
      semanticMap,
      stickerStore
    };
  }

  /**
   * Строит хранилище стикеров (stickerId -> PhotoSticker)
   */
  private buildStickerStore(stickers: PhotoSticker[]): Map<number, PhotoSticker> {
    const store = new Map<number, PhotoSticker>();
    
    for (const sticker of stickers) {
      store.set(sticker.photo.id, sticker);
    }
    
    return store;
  }

  /**
   * Строит индекс точных совпадений слов
   * Хранит только ID стикеров
   */
  private buildExactWordIndex(stickers: PhotoSticker[]): Map<string, Set<number>> {
    const index = new Map<string, Set<number>>();

    for (const sticker of stickers) {
      for (const word of sticker.lowerWords) {
        if (!index.has(word)) {
          index.set(word, new Set<number>());
        }
        index.get(word)!.add(sticker.photo.id);
      }
    }

    return index;
  }

  /**
   * Строит индекс точных совпадений подсказок
   * Хранит только ID стикеров
   */
  private buildExactSuggestionIndex(stickers: PhotoSticker[]): Map<string, Set<number>> {
    const index = new Map<string, Set<number>>();

    for (const sticker of stickers) {
      for (const suggestion of sticker.lowerSuggestions) {
        if (!index.has(suggestion)) {
          index.set(suggestion, new Set<number>());
        }
        index.get(suggestion)!.add(sticker.photo.id);
      }
    }

    return index;
  }

  /**
   * Строит оптимизированный индекс префиксов
   * Создает префиксы только для значимых длин (3, 4, 5)
   * Хранит только ID стикеров
   */
  private buildPrefixIndex(stickers: PhotoSticker[]): Map<string, Set<number>> {
    const index = new Map<string, Set<number>>();

    for (const sticker of stickers) {
      // Индексируем слова
      for (const word of sticker.lowerWords) {
        this.addPrefixes(index, word, sticker.photo.id);
      }

      // Индексируем подсказки
      for (const suggestion of sticker.lowerSuggestions) {
        this.addPrefixes(index, suggestion, sticker.photo.id);
      }
    }

    return index;
  }

  /**
   * Добавляет префиксы для слова в индекс
   */
  private addPrefixes(
    index: Map<string, Set<number>>,
    text: string,
    stickerId: number
  ): void {
    for (const length of SIGNIFICANT_PREFIX_LENGTHS) {
      if (text.length >= length) {
        const prefix = text.substring(0, length);
        if (!index.has(prefix)) {
          index.set(prefix, new Set<number>());
        }
        index.get(prefix)!.add(stickerId);
      }
    }
  }

  /**
   * Вычисляет статистику использования памяти индексом
   */
  calculateMemoryStats(index: OptimizedSearchIndex): IndexMemoryStats {
    let totalStickerReferences = 0;
    
    // Подсчитываем ссылки в exactWords
    for (const stickerIds of index.exactWords.values()) {
      totalStickerReferences += stickerIds.size;
    }
    
    // Подсчитываем ссылки в exactSuggestions
    for (const stickerIds of index.exactSuggestions.values()) {
      totalStickerReferences += stickerIds.size;
    }
    
    // Подсчитываем ссылки в partialWords
    for (const stickerIds of index.partialWords.values()) {
      totalStickerReferences += stickerIds.size;
    }

    // Оценка памяти:
    // - Каждый стикер: ~1KB (фото объект + данные)
    // - Каждая ссылка (ID): ~8 байт (number)
    // - Каждый ключ в Map: ~50 байт (строка + overhead)
    const stickerStoreBytes = index.stickerStore.size * 1024;
    const referencesBytes = totalStickerReferences * 8;
    const keysBytes = (
      index.exactWords.size +
      index.exactSuggestions.size +
      index.partialWords.size
    ) * 50;

    return {
      uniqueStickers: index.stickerStore.size,
      exactWordsEntries: index.exactWords.size,
      exactSuggestionsEntries: index.exactSuggestions.size,
      partialWordsEntries: index.partialWords.size,
      totalStickerReferences,
      estimatedMemoryBytes: stickerStoreBytes + referencesBytes + keysBytes
    };
  }

  /**
   * Получает стикеры по их ID из хранилища
   */
  getStickersByIds(
    stickerIds: Set<number>,
    stickerStore: Map<number, PhotoSticker>
  ): PhotoSticker[] {
    const stickers: PhotoSticker[] = [];
    
    for (const id of stickerIds) {
      const sticker = stickerStore.get(id);
      if (sticker) {
        stickers.push(sticker);
      }
    }
    
    return stickers;
  }
}
