import { describe, it, expect, beforeEach } from 'vitest'
import type { PhotoSticker } from '../../modules/messenger/types'
import {
  initializeStickerSearch,
  resetStickerSearch,
  smartStickerSearch
} from '../AdvancedStickerFilter'

/**
 * Повторяет разбор текста фотографии из messenger.ts
 */
function createSticker(id: number, suggestions: string[], date = id): PhotoSticker {
  const lowerSuggestions = suggestions.map(s => s.toLowerCase())
  const lowerWords = lowerSuggestions
    .map(s => s.match(/[а-яёa-z0-9]+/g) ?? [])
    .flat()

  return {
    photo: {
      id,
      owner_id: 1,
      album_id: -15,
      date,
      orig_photo: { height: 1, width: 1, type: 'base', url: '' },
      sizes: [{ height: 1, width: 1, type: 'base', url: '' }],
      text: suggestions.map(s => `"${s}"`).join(' ')
    },
    suggestions,
    lowerSuggestions,
    lowerWords
  }
}

const stickers = [
  createSticker(1, ['Приветствие']),
  createSticker(2, ['Здравствуйте']),
  createSticker(3, ['Спокойной ночи']),
  createSticker(4, ['Работаю']),
  createSticker(5, ['Ёжик']),
  createSticker(6, ['Это база']),
  createSticker(7, ['Доброе утро всем']),
  createSticker(8, ['Это очень длинная фраза которая не имеет никакого отношения к запросу'])
]

function findTexts(query: string, limit?: number): string[] {
  return smartStickerSearch(stickers, query, limit).map(s => s.suggestions[0])
}

describe('Поиск стикеров — регрессия', () => {
  beforeEach(() => {
    resetStickerSearch()
    initializeStickerSearch(stickers)
  })

  describe('Запрос — начало слова', () => {
    it('находит «Приветствие» по запросу «привет»', () => {
      expect(findTexts('привет')).toContain('Приветствие')
    })

    it('находит по обрезанному слову любой длины', () => {
      expect(findTexts('здравств')).toContain('Здравствуйте')
      expect(findTexts('спок')).toContain('Спокойной ночи')
      expect(findTexts('работа')).toContain('Работаю')
    })

    it('ставит более полное совпадение выше', () => {
      const withLongPrefix = smartStickerSearch(stickers, 'приветстви')
      const withShortPrefix = smartStickerSearch(stickers, 'прив')

      expect(withLongPrefix[0].suggestions[0]).toBe('Приветствие')
      expect(withShortPrefix[0].suggestions[0]).toBe('Приветствие')
    })
  })

  describe('Морфология', () => {
    it('находит по другой форме слова', () => {
      expect(findTexts('работе')).toContain('Работаю')
      expect(findTexts('ночь')).toContain('Спокойной ночи')
    })

    it('находит по общему началу слов', () => {
      // «приветик» и «приветствие» расходятся после «привет»
      expect(findTexts('приветик')).toContain('Приветствие')
    })
  })

  describe('Буква «ё»', () => {
    it('находит стикер с «ё» по написанию через «е» и наоборот', () => {
      expect(findTexts('ежик')).toContain('Ёжик')
      expect(findTexts('ёжик')).toContain('Ёжик')
    })
  })

  describe('Обновление индекса', () => {
    it('находит стикеры, догруженные после первой инициализации', () => {
      const updated = [...stickers, createSticker(100, ['Добавленный позже'])]

      initializeStickerSearch(updated)

      expect(smartStickerSearch(updated, 'добавленный').map(s => s.photo.id)).toContain(100)
    })
  })

  describe('Стоп-слова', () => {
    it('ищет по стоп-слову, если весь запрос из них состоит', () => {
      expect(findTexts('это')).toContain('Это база')
    })

    it('не вытаскивает длинную фразу по одному стоп-слову', () => {
      expect(findTexts('это')).not.toContain(
        'Это очень длинная фраза которая не имеет никакого отношения к запросу'
      )
    })
  })

  describe('Длинные сообщения', () => {
    it('ищет по сообщениям длиннее трёх слов', () => {
      expect(findTexts('доброе утро всем друзья')).toContain('Доброе утро всем')
    })
  })

  describe('Точность', () => {
    it('не находит длинную фразу по случайному началу слова', () => {
      // «кот» является началом слова «которая», но фразу это не делает подходящей
      expect(findTexts('кот')).toHaveLength(0)
    })

    it('не находит ничего по бессмысленному запросу', () => {
      expect(findTexts('абракадабра')).toHaveLength(0)
    })
  })

  describe('Постраничная выдача', () => {
    const manyStickers = Array.from({ length: 120 }, (_, i) =>
      createSticker(1000 + i, [`Привет ${i}`], i)
    )

    beforeEach(() => {
      resetStickerSearch()
      initializeStickerSearch(manyStickers)
    })

    it('возвращает не больше запрошенного количества', () => {
      expect(smartStickerSearch(manyStickers, 'привет', 10)).toHaveLength(10)
    })

    it('не меняет порядок при увеличении лимита', () => {
      const firstPage = smartStickerSearch(manyStickers, 'привет', 10)
      const fullPage = smartStickerSearch(manyStickers, 'привет', 100)

      expect(fullPage.slice(0, 10)).toEqual(firstPage)
    })
  })
})
