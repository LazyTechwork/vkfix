import { describe, it, expect, beforeEach } from 'vitest'
import { OptimizedIndexBuilder } from './OptimizedIndexBuilder'
import type { PhotoSticker } from '../../modules/messenger/types'

// Вспомогательная функция для создания тестовых стикеров
function createSticker(
  id: number,
  suggestions: string[],
  albumId: number = -15,
  date: number = Date.now()
): PhotoSticker {
  const lowerSuggestions = suggestions.map(s => s.toLowerCase())
  const lowerWords = suggestions
    .map(s => s.toLowerCase().split(/[^а-яa-z0-9]/g).filter(x => x.length > 0))
    .flat()

  return {
    photo: {
      id,
      owner_id: 123456,
      album_id: albumId,
      date,
      orig_photo: { height: 1024, width: 1024, type: 'base', url: 'https://example.com/photo.jpg' },
      sizes: [{ height: 100, width: 100, type: 'base', url: 'https://example.com/photo_100.jpg' }],
      text: suggestions.map(s => `"${s}"`).join(' ')
    },
    suggestions,
    lowerSuggestions,
    lowerWords
  }
}

describe('OptimizedIndexBuilder', () => {
  let builder: OptimizedIndexBuilder
  let testStickers: PhotoSticker[]

  beforeEach(() => {
    builder = new OptimizedIndexBuilder()
    
    testStickers = [
      createSticker(1, ['Кот спит', 'Котик мяукает']),
      createSticker(2, ['Собака лает', 'Пёс играет']),
      createSticker(3, ['Кошка умывается']),
      createSticker(4, ['Кофе пью', 'Кофеек']),
      createSticker(5, ['Чай с печеньем'])
    ]
  })

  describe('buildIndex', () => {
    it('должен строить оптимизированный индекс', () => {
      const index = builder.buildIndex(testStickers)
      
      expect(index.stickerStore.size).toBe(5)
      expect(index.exactWords.size).toBeGreaterThan(0)
      expect(index.exactSuggestions.size).toBeGreaterThan(0)
      expect(index.partialWords.size).toBeGreaterThan(0)
    })

    it('должен хранить стикеры в stickerStore по ID', () => {
      const index = builder.buildIndex(testStickers)
      
      expect(index.stickerStore.has(1)).toBe(true)
      expect(index.stickerStore.has(2)).toBe(true)
      expect(index.stickerStore.has(5)).toBe(true)
      
      const sticker1 = index.stickerStore.get(1)
      expect(sticker1?.photo.id).toBe(1)
      expect(sticker1?.suggestions).toContain('Кот спит')
    })

    it('должен хранить только ID в индексах', () => {
      const index = builder.buildIndex(testStickers)
      
      // Проверяем что в exactWords хранятся Set<number>
      const kotIds = index.exactWords.get('кот')
      expect(kotIds).toBeInstanceOf(Set)
      expect(kotIds?.has(1)).toBe(true)
      
      // Проверяем что это именно числа (ID)
      for (const id of kotIds!) {
        expect(typeof id).toBe('number')
      }
    })
  })

  describe('buildExactWordIndex', () => {
    it('должен индексировать все слова', () => {
      const index = builder.buildIndex(testStickers)
      
      expect(index.exactWords.has('кот')).toBe(true)
      expect(index.exactWords.has('собака')).toBe(true)
      expect(index.exactWords.has('кофе')).toBe(true)
    })

    it('должен связывать слова с ID стикеров', () => {
      const index = builder.buildIndex(testStickers)
      
      const kotIds = index.exactWords.get('кот')
      expect(kotIds?.has(1)).toBe(true)
      
      const kofeIds = index.exactWords.get('кофе')
      expect(kofeIds?.has(4)).toBe(true)
    })

    it('должен обрабатывать несколько стикеров с одним словом', () => {
      const stickers = [
        createSticker(1, ['Кот спит']),
        createSticker(2, ['Кот играет']),
        createSticker(3, ['Кот мяукает'])
      ]
      
      const index = builder.buildIndex(stickers)
      const kotIds = index.exactWords.get('кот')
      
      expect(kotIds?.size).toBe(3)
      expect(kotIds?.has(1)).toBe(true)
      expect(kotIds?.has(2)).toBe(true)
      expect(kotIds?.has(3)).toBe(true)
    })
  })

  describe('buildPrefixIndex', () => {
    it('должен создавать префиксы только для значимых длин', () => {
      const index = builder.buildIndex(testStickers)
      
      // Для "кофе" (4 буквы) должны быть префиксы: коф (3), кофе (4)
      expect(index.partialWords.has('коф')).toBe(true)
      expect(index.partialWords.has('кофе')).toBe(true)
      
      // Не должно быть префиксов длиной 2
      expect(index.partialWords.has('ко')).toBe(false)
    })

    it('должен хранить только ID в префиксном индексе', () => {
      const index = builder.buildIndex(testStickers)
      
      const kofIds = index.partialWords.get('коф')
      expect(kofIds).toBeInstanceOf(Set)
      expect(kofIds?.has(4)).toBe(true)
    })
  })

  describe('getStickersByIds', () => {
    it('должен получать стикеры по ID', () => {
      const index = builder.buildIndex(testStickers)
      const ids = new Set([1, 3, 5])
      
      const stickers = builder.getStickersByIds(ids, index.stickerStore)
      
      expect(stickers.length).toBe(3)
      expect(stickers.map(s => s.photo.id)).toContain(1)
      expect(stickers.map(s => s.photo.id)).toContain(3)
      expect(stickers.map(s => s.photo.id)).toContain(5)
    })

    it('должен игнорировать несуществующие ID', () => {
      const index = builder.buildIndex(testStickers)
      const ids = new Set([1, 999, 3])
      
      const stickers = builder.getStickersByIds(ids, index.stickerStore)
      
      expect(stickers.length).toBe(2)
      expect(stickers.map(s => s.photo.id)).not.toContain(999)
    })

    it('должен возвращать пустой массив для пустого Set', () => {
      const index = builder.buildIndex(testStickers)
      const ids = new Set<number>()
      
      const stickers = builder.getStickersByIds(ids, index.stickerStore)
      
      expect(stickers.length).toBe(0)
    })
  })

  describe('calculateMemoryStats', () => {
    it('должен вычислять статистику памяти', () => {
      const index = builder.buildIndex(testStickers)
      const stats = builder.calculateMemoryStats(index)
      
      expect(stats.uniqueStickers).toBe(5)
      expect(stats.exactWordsEntries).toBeGreaterThan(0)
      expect(stats.exactSuggestionsEntries).toBeGreaterThan(0)
      expect(stats.partialWordsEntries).toBeGreaterThan(0)
      expect(stats.totalStickerReferences).toBeGreaterThan(0)
      expect(stats.estimatedMemoryBytes).toBeGreaterThan(0)
    })

    it('должен показывать экономию памяти по сравнению с дублированием', () => {
      const index = builder.buildIndex(testStickers)
      const stats = builder.calculateMemoryStats(index)
      
      // Без дедупликации: каждая ссылка = полный объект (~1KB)
      const withoutDeduplication = stats.totalStickerReferences * 1024
      
      // С дедупликацией: стикеры хранятся один раз + ссылки (8 байт)
      const withDeduplication = stats.estimatedMemoryBytes
      
      // Экономия должна быть значительной
      const savings = 1 - (withDeduplication / withoutDeduplication)
      console.log(`Экономия памяти: ${(savings * 100).toFixed(1)}%`)
      
      expect(savings).toBeGreaterThan(0.5) // Минимум 50% экономии
    })

    it('должен корректно подсчитывать ссылки', () => {
      const stickers = [
        createSticker(1, ['Кот спит']), // слова: кот, спит
        createSticker(2, ['Кот играет']) // слова: кот, играет
      ]
      
      const index = builder.buildIndex(stickers)
      const stats = builder.calculateMemoryStats(index)
      
      // "кот" встречается в 2 стикерах
      // Каждый стикер имеет 2 слова
      // Плюс префиксы для каждого слова
      expect(stats.totalStickerReferences).toBeGreaterThan(4)
    })
  })

  describe('Производительность', () => {
    it('должен строить индекс быстро для 1000 стикеров', () => {
      const largeSet = Array.from({ length: 1000 }, (_, i) =>
        createSticker(i, [`Стикер ${i}`, `Тест ${i % 10}`])
      )
      
      const start = performance.now()
      const index = builder.buildIndex(largeSet)
      const duration = performance.now() - start
      
      console.log(`Время построения индекса для 1000 стикеров: ${duration.toFixed(2)}ms`)
      
      expect(duration).toBeLessThan(500)
      expect(index.stickerStore.size).toBe(1000)
    })

    it('должен эффективно использовать память для больших наборов', () => {
      const largeSet = Array.from({ length: 1000 }, (_, i) =>
        createSticker(i, [`Стикер ${i}`, `Тест ${i % 10}`])
      )
      
      const index = builder.buildIndex(largeSet)
      const stats = builder.calculateMemoryStats(index)
      
      console.log(`Память для 1000 стикеров: ${(stats.estimatedMemoryBytes / 1024 / 1024).toFixed(2)}MB`)
      console.log(`Уникальных стикеров: ${stats.uniqueStickers}`)
      console.log(`Всего ссылок: ${stats.totalStickerReferences}`)
      
      // Память должна быть разумной (< 10MB для 1000 стикеров)
      expect(stats.estimatedMemoryBytes).toBeLessThan(10 * 1024 * 1024)
    })
  })
})
