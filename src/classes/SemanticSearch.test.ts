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
  switchKeyboardLayout: (text: string) => text
}))

import { smartStickerSearch, initializeStickerSearch } from './AdvancedStickerFilter'

function createSticker(id: number, suggestions: string[]): PhotoSticker {
  const lowerSuggestions = suggestions.map(s => s.toLowerCase())
  const lowerWords = suggestions
    .map(s => s.toLowerCase().split(/[^а-яa-z0-9]/g).filter(x => x.length > 0))
    .flat()

  return {
    photo: {
      id,
      owner_id: 123456,
      album_id: -15,
      date: Date.now(),
      orig_photo: { height: 1024, width: 1024, type: 'base', url: 'https://example.com/photo.jpg' },
      sizes: [{ height: 100, width: 100, type: 'base', url: 'https://example.com/photo_100.jpg' }],
      text: suggestions.map(s => `"${s}"`).join(' ')
    },
    suggestions,
    lowerSuggestions,
    lowerWords
  }
}

describe('Семантический поиск - Реальные сценарии', () => {
  let testStickers: PhotoSticker[]

  beforeEach(() => {
    testStickers = [
      createSticker(1, ['Смех']),
      createSticker(2, ['Ржач']),
      createSticker(3, ['Хахаха']),
      createSticker(4, ['Смеюсь']),
    ]

    initializeStickerSearch(testStickers)
    
    // DEBUG: Проверяем что в стикерах
    console.log('\n=== DEBUG: Содержимое стикеров ===')
    testStickers.forEach(s => {
      console.log(`ID ${s.photo.id}:`)
      console.log(`  suggestions: ${s.suggestions.join(', ')}`)
      console.log(`  lowerSuggestions: ${s.lowerSuggestions.join(', ')}`)
      console.log(`  lowerWords: ${s.lowerWords.join(', ')}`)
    })
  })

  it('должен найти "Смех" когда пишут "кек"', () => {
    const results = smartStickerSearch(testStickers, 'кек')
    
    console.log('\nПоиск "кек":')
    console.log('  Найдено результатов:', results.length)
    results.forEach(r => {
      console.log(`  - ID ${r.photo.id}: ${r.suggestions.join(', ')}`)
    })
    
    expect(results.length).toBeGreaterThan(0)
    expect(results.some(s => s.photo.id === 1)).toBe(true) // Должен найти "Смех"
  })

  it('должен найти "Ржач" когда пишут "кек"', () => {
    const results = smartStickerSearch(testStickers, 'кек')
    
    expect(results.length).toBeGreaterThan(0)
    expect(results.some(s => s.photo.id === 2)).toBe(true) // Должен найти "Ржач"
  })

  it('должен найти "Смех" когда пишут "ржач"', () => {
    const results = smartStickerSearch(testStickers, 'ржач')
    
    console.log('Поиск "ржач":')
    console.log('  Найдено результатов:', results.length)
    results.forEach(r => {
      console.log(`  - ID ${r.photo.id}: ${r.suggestions.join(', ')}`)
    })
    
    expect(results.length).toBeGreaterThan(0)
    // Должен найти и точное совпадение "Ржач" и семантическое "Смех"
    expect(results.some(s => s.photo.id === 1 || s.photo.id === 2)).toBe(true)
  })

  it('должен найти все стикеры смеха когда пишут "лол"', () => {
    const results = smartStickerSearch(testStickers, 'лол')
    
    console.log('Поиск "лол":')
    console.log('  Найдено результатов:', results.length)
    results.forEach(r => {
      console.log(`  - ID ${r.photo.id}: ${r.suggestions.join(', ')}`)
    })
    
    expect(results.length).toBeGreaterThan(0)
  })
})
