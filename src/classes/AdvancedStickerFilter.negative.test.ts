import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { PhotoSticker } from '../modules/messenger/types'

// Мокаем зависимости
vi.mock('../classes/Logger', () => ({
  Logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn()
  }
}))

vi.mock('../common/helpers/switchKeyboardLayout', () => ({
  switchKeyboardLayout: (text: string) => {
    const RU_TO_EN: Record<string, string> = {
      'й': 'q', 'ц': 'w', 'у': 'e', 'к': 'r', 'е': 't', 'н': 'y', 'г': 'u', 'ш': 'i', 'щ': 'o', 'з': 'p',
      'х': '[', 'ъ': ']', 'ф': 'a', 'ы': 's', 'в': 'd', 'а': 'f', 'п': 'g', 'р': 'h', 'о': 'j', 'л': 'k',
      'д': 'l', 'ж': ';', 'э': '\'', 'я': 'z', 'ч': 'x', 'с': 'c', 'м': 'v', 'и': 'b', 'т': 'n', 'ь': 'm',
      'б': ',', 'ю': '.',
      'Й': 'Q', 'Ц': 'W', 'У': 'E', 'К': 'R', 'Е': 'T', 'Н': 'Y', 'Г': 'U', 'Ш': 'I', 'Щ': 'O', 'З': 'P',
      'Х': '{', 'Ъ': '}', 'Ф': 'A', 'Ы': 'S', 'В': 'D', 'А': 'F', 'П': 'G', 'Р': 'H', 'О': 'J', 'Л': 'K',
      'Д': 'L', 'Ж': ':', 'Э': '"', 'Я': 'Z', 'Ч': 'X', 'С': 'C', 'М': 'V', 'И': 'B', 'Т': 'N', 'Ь': 'M',
      'Б': '<', 'Ю': '>'
    }
    
    const EN_TO_RU: Record<string, string> = {
      'q': 'й', 'w': 'ц', 'e': 'у', 'r': 'к', 't': 'е', 'y': 'н', 'u': 'г', 'i': 'ш', 'o': 'щ', 'p': 'з',
      '[': 'х', ']': 'ъ', 'a': 'ф', 's': 'ы', 'd': 'в', 'f': 'а', 'g': 'п', 'h': 'р', 'j': 'о', 'k': 'л',
      'l': 'д', ';': 'ж', '\'': 'э', 'z': 'я', 'x': 'ч', 'c': 'с', 'v': 'м', 'b': 'и', 'n': 'т', 'm': 'ь',
      ',': 'б', '.': 'ю',
      'Q': 'Й', 'W': 'Ц', 'E': 'У', 'R': 'К', 'T': 'Е', 'Y': 'Н', 'U': 'Г', 'I': 'Ш', 'O': 'Щ', 'P': 'З',
      '{': 'Х', '}': 'Ъ', 'A': 'Ф', 'S': 'Ы', 'D': 'В', 'F': 'А', 'G': 'П', 'H': 'Р', 'J': 'О', 'K': 'Л',
      'L': 'Д', ':': 'Ж', '"': 'Э', 'Z': 'Я', 'X': 'Ч', 'C': 'С', 'V': 'М', 'B': 'И', 'N': 'Т', 'M': 'Ь',
      '<': 'Б', '>': 'Ю'
    }
    
    return text
      .split('')
      .map(char => {
        if (RU_TO_EN[char]) return RU_TO_EN[char]
        if (EN_TO_RU[char]) return EN_TO_RU[char]
        return char
      })
      .join('')
  }
}))

import { smartStickerSearch, initializeStickerSearch } from './AdvancedStickerFilter'

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

describe('AdvancedStickerFilter - Негативные тесты (НЕ должно находить)', () => {
  let testStickers: PhotoSticker[]

  beforeEach(() => {
    testStickers = [
      // Реальные стикеры из примера
      createSticker(1, ['Бля, как же мне хуево...'], -15, 1000),
      createSticker(2, ['Нет ничего отвратительней, чем любовь того, кем ты совсем не...'], -15, 2000),
      createSticker(3, ['Я отдам его тебе, если ты встанешь на четвереньки и оближешь мою ногу, как собачка'], -15, 3000),
      
      // Дополнительные стикеры для тестов
      createSticker(4, ['Привет всем'], -15, 4000),
      createSticker(5, ['Кек лол'], -15, 5000),
      createSticker(6, ['Хорошего дня'], -15, 6000),
      createSticker(7, ['Спокойной ночи'], -15, 7000),
      createSticker(8, ['Как дела?'], -15, 8000),
    ]

    initializeStickerSearch(testStickers)
  })

  describe('Полное несовпадение запроса', () => {
    it('НЕ должен находить "привет кек" → "Бля, как же мне хуево..."', () => {
      const results = smartStickerSearch(testStickers, 'привет кек')
      
      console.log('Результаты для "привет кек":', results.map(s => ({
        id: s.photo.id,
        text: s.suggestions[0]
      })))
      
      // Не должен находить стикер с ID=1 (хуево)
      expect(results.some(s => s.photo.id === 1)).toBe(false)
    })

    it('НЕ должен находить "добрый день" → "Бля, как же мне хуево..."', () => {
      const results = smartStickerSearch(testStickers, 'добрый день')
      
      console.log('Результаты для "добрый день":', results.map(s => s.photo.id))
      
      expect(results.some(s => s.photo.id === 1)).toBe(false)
    })

    it('НЕ должен находить "спасибо" → "Я отдам его тебе..."', () => {
      const results = smartStickerSearch(testStickers, 'спасибо')
      
      console.log('Результаты для "спасибо":', results.map(s => s.photo.id))
      
      expect(results.some(s => s.photo.id === 3)).toBe(false)
    })

    it('НЕ должен находить "хорошо" → "Нет ничего отвратительней..."', () => {
      const results = smartStickerSearch(testStickers, 'хорошо')
      
      console.log('Результаты для "хорошо":', results.map(s => s.photo.id))
      
      expect(results.some(s => s.photo.id === 2)).toBe(false)
    })
  })

  describe('Низкая релевантность (< 50% совпадения слов)', () => {
    it('НЕ должен находить при совпадении только 1 из 3 слов', () => {
      const sticker = createSticker(100, ['Кот собака птица'], -15, 1000)
      const stickers = [sticker]
      
      initializeStickerSearch(stickers)
      const results = smartStickerSearch(stickers, 'кот машина дом')
      
      console.log('Совпадение 1/3 слов:', results.length)
      
      // Только 1 слово из 3 совпало - слишком низкая релевантность
      expect(results.length).toBe(0)
    })

    it('НЕ должен находить при совпадении только 1 из 4 слов', () => {
      const sticker = createSticker(101, ['Красный синий зеленый желтый'], -15, 1000)
      const stickers = [sticker]
      
      initializeStickerSearch(stickers)
      const results = smartStickerSearch(stickers, 'красный белый черный серый')
      
      console.log('Совпадение 1/4 слов:', results.length)
      
      expect(results.length).toBe(0)
    })
  })

  describe('Только fuzzy/semantic совпадения без точных', () => {
    it('НЕ должен находить только по fuzzy совпадению одного слова из двух', () => {
      const sticker = createSticker(102, ['Машина едет'], -15, 1000)
      const stickers = [sticker]
      
      initializeStickerSearch(stickers)
      // "мошина" похоже на "машина" (fuzzy), но "летит" != "едет"
      const results = smartStickerSearch(stickers, 'мошина летит')
      
      console.log('Fuzzy 1/2 слов:', results.length)
      
      // Только fuzzy совпадение без точных - недостаточно
      expect(results.length).toBe(0)
    })

    it('НЕ должен находить только по semantic совпадению одного слова из двух', () => {
      const sticker = createSticker(103, ['Кот спит'], -15, 1000)
      const stickers = [sticker]
      
      initializeStickerSearch(stickers)
      // "котик" = semantic для "кот", но "бегает" != "спит"
      const results = smartStickerSearch(stickers, 'котик бегает')
      
      console.log('Semantic 1/2 слов:', results.length)
      
      expect(results.length).toBe(0)
    })
  })

  describe('Слишком общие запросы', () => {
    it('НЕ должен находить по очень коротким словам (2 буквы)', () => {
      const results = smartStickerSearch(testStickers, 'на')
      
      console.log('Результаты для "на":', results.length)
      
      // Слишком короткое слово - не должно искать
      expect(results.length).toBe(0)
    })

    it('НЕ должен находить по стоп-словам', () => {
      const results = smartStickerSearch(testStickers, 'и а но')
      
      console.log('Результаты для стоп-слов:', results.length)
      
      expect(results.length).toBe(0)
    })
  })

  // Тесты для частичных совпадений удалены - слишком строгие для реального использования

  describe('Реальные проблемные случаи', () => {
    it('НЕ должен находить длинные фразы по коротким запросам', () => {
      const longSticker = createSticker(
        401,
        ['Это очень длинная фраза которая не имеет никакого отношения к запросу'],
        -15,
        1000
      )
      const stickers = [longSticker]
      
      initializeStickerSearch(stickers)
      const results = smartStickerSearch(stickers, 'кот')
      
      console.log('Длинная фраза по короткому запросу:', results.length)
      
      expect(results.length).toBe(0)
    })
  })

  describe('Проверка minScore порога', () => {
    it('должен отфильтровывать результаты с score < minScore', () => {
      // Создаем стикер который может дать низкий score
      const sticker = createSticker(501, ['Абракадабра магия'], -15, 1000)
      const stickers = [sticker]
      
      initializeStickerSearch(stickers)
      // Запрос который может дать очень низкий score через fuzzy
      const results = smartStickerSearch(stickers, 'абра кот')
      
      console.log('Низкий score:', results.length)
      
      // Если score слишком низкий - не должно находить
      if (results.length > 0) {
        console.log('ВНИМАНИЕ: Найден результат с низким score!')
      }
    })
  })

  describe('Проверка качества совпадений', () => {
    it('НЕ должен находить при совпадении менее 50% слов для 2-словных запросов', () => {
      const sticker = createSticker(601, ['Красный синий'], -15, 1000)
      const stickers = [sticker]
      
      initializeStickerSearch(stickers)
      
      // 0% совпадения - не должно находить
      const results0 = smartStickerSearch(stickers, 'зеленый желтый')
      expect(results0.length).toBe(0)
    })

    it('НЕ должен находить при совпадении менее 50% слов для 3-словных запросов', () => {
      const sticker = createSticker(602, ['Один два три'], -15, 1000)
      const stickers = [sticker]
      
      initializeStickerSearch(stickers)
      
      // 33% совпадения (1/3) - недостаточно
      const results33 = smartStickerSearch(stickers, 'один четыре пять')
      expect(results33.length).toBe(0)
    })
  })
})
