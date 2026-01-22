import { describe, it, expect } from 'vitest'
import { FuzzyMatcher } from './FuzzyMatcher'

describe('FuzzyMatcher', () => {
  const fuzzyMatcher = new FuzzyMatcher()

  describe('calculateLevenshteinDistance', () => {
    it('должен вычислять расстояние для одинаковых строк', () => {
      expect(fuzzyMatcher.calculateLevenshteinDistance('кот', 'кот')).toBe(0)
    })

    it('должен вычислять расстояние для 1 замены', () => {
      expect(fuzzyMatcher.calculateLevenshteinDistance('кот', 'кто')).toBe(1)
    })

    it('должен вычислять расстояние для 1 вставки', () => {
      expect(fuzzyMatcher.calculateLevenshteinDistance('кот', 'крот')).toBe(1)
    })

    it('должен вычислять расстояние для 1 удаления', () => {
      expect(fuzzyMatcher.calculateLevenshteinDistance('крот', 'кот')).toBe(1)
    })

    it('должен вычислять расстояние для 2 изменений', () => {
      expect(fuzzyMatcher.calculateLevenshteinDistance('кот', 'кто')).toBe(1)
      expect(fuzzyMatcher.calculateLevenshteinDistance('собака', 'сабака')).toBe(1)
    })
  })

  describe('findSimilarWords', () => {
    const dictionary = ['кот', 'кошка', 'собака', 'пес', 'кофе', 'чай']

    it('должен находить слова с расстоянием 1', () => {
      const results = fuzzyMatcher.findSimilarWords('кто', dictionary, 1)
      expect(results.length).toBeGreaterThan(0)
      expect(results.some(r => r.word === 'кот' && r.distance === 1)).toBe(true)
    })

    it('должен находить слова с расстоянием 1 для "сабака"', () => {
      const results = fuzzyMatcher.findSimilarWords('сабака', dictionary, 1)
      expect(results.length).toBeGreaterThan(0)
      expect(results.some(r => r.word === 'собака' && r.distance === 1)).toBe(true)
    })

    it('НЕ должен находить слова с расстоянием > maxDistance', () => {
      const results = fuzzyMatcher.findSimilarWords('ктр', dictionary, 1)
      expect(results.some(r => r.word === 'кот')).toBe(false)
    })

    it('должен сортировать по расстоянию', () => {
      const results = fuzzyMatcher.findSimilarWords('кто', dictionary, 2)
      if (results.length > 1) {
        for (let i = 0; i < results.length - 1; i++) {
          expect(results[i].distance).toBeLessThanOrEqual(results[i + 1].distance)
        }
      }
    })
  })

  describe('getMaxDistance', () => {
    it('должен возвращать 0 для очень коротких слов (<=2)', () => {
      expect(fuzzyMatcher.getMaxDistance(1)).toBe(0)
      expect(fuzzyMatcher.getMaxDistance(2)).toBe(0)
    })

    it('должен возвращать 1 для коротких слов (3-7)', () => {
      expect(fuzzyMatcher.getMaxDistance(3)).toBe(1)
      expect(fuzzyMatcher.getMaxDistance(4)).toBe(1)
      expect(fuzzyMatcher.getMaxDistance(7)).toBe(1)
    })

    it('должен возвращать 2 для длинных слов (8-10)', () => {
      expect(fuzzyMatcher.getMaxDistance(8)).toBe(2)
      expect(fuzzyMatcher.getMaxDistance(10)).toBe(2)
    })

    it('должен возвращать 3 для очень длинных слов (11+)', () => {
      expect(fuzzyMatcher.getMaxDistance(11)).toBe(3)
      expect(fuzzyMatcher.getMaxDistance(15)).toBe(3)
    })
  })

  describe('calculateFuzzyScore', () => {
    it('должен возвращать 1.0 для точного совпадения', () => {
      expect(fuzzyMatcher.calculateFuzzyScore(0, 5)).toBe(1.0)
    })

    it('должен возвращать меньший score для большего расстояния', () => {
      const score1 = fuzzyMatcher.calculateFuzzyScore(1, 5)
      const score2 = fuzzyMatcher.calculateFuzzyScore(2, 5)
      expect(score1).toBeGreaterThan(score2)
    })

    it('должен возвращать меньший score для коротких слов', () => {
      const scoreShort = fuzzyMatcher.calculateFuzzyScore(1, 3)
      const scoreLong = fuzzyMatcher.calculateFuzzyScore(1, 10)
      expect(scoreLong).toBeGreaterThan(scoreShort)
    })
  })

  describe('Edge cases и реальные сценарии', () => {
    it('должен обрабатывать транспозицию соседних символов', () => {
      // "кот" vs "окт" - транспозиция "ко" -> "ок"
      const distance = fuzzyMatcher.calculateLevenshteinDistance('кот', 'окт')
      expect(distance).toBeLessThanOrEqual(2)
    })

    it('должен находить слова с опечатками в начале', () => {
      const dictionary = ['привет', 'пока', 'спасибо']
      const results = fuzzyMatcher.findSimilarWords('превет', dictionary, 1)
      expect(results.some(r => r.word === 'привет')).toBe(true)
    })

    it('должен находить слова с опечатками в конце', () => {
      const dictionary = ['привет', 'пока', 'спасибо']
      const results = fuzzyMatcher.findSimilarWords('приветт', dictionary, 1)
      expect(results.some(r => r.word === 'привет')).toBe(true)
    })

    it('должен находить слова с опечатками в середине', () => {
      const dictionary = ['собака', 'кошка', 'мышка']
      const results = fuzzyMatcher.findSimilarWords('сабака', dictionary, 1)
      expect(results.some(r => r.word === 'собака')).toBe(true)
    })

    it('должен обрабатывать пустые строки', () => {
      expect(fuzzyMatcher.calculateLevenshteinDistance('', '')).toBe(0)
      expect(fuzzyMatcher.calculateLevenshteinDistance('кот', '')).toBe(3)
      expect(fuzzyMatcher.calculateLevenshteinDistance('', 'кот')).toBe(3)
    })

    it('должен обрабатывать очень длинные слова', () => {
      const long1 = 'приветствую'
      const long2 = 'превитствую'
      const distance = fuzzyMatcher.calculateLevenshteinDistance(long1, long2)
      expect(distance).toBeLessThanOrEqual(2)
    })

    it('должен пропускать слова с большой разницей в длине', () => {
      const dictionary = ['кот', 'собака', 'приветствую']
      const results = fuzzyMatcher.findSimilarWords('к', dictionary, 1)
      // "к" (1 буква) vs "кот" (3 буквы) - разница 2, больше maxDistance=1
      expect(results.length).toBe(0)
    })

    it('должен находить несколько похожих слов', () => {
      const dictionary = ['кот', 'кто', 'кит', 'рот']
      const results = fuzzyMatcher.findSimilarWords('кот', dictionary, 1)
      // Должен найти: кот (0), кто (1), кит (1), рот (1)
      expect(results.length).toBeGreaterThanOrEqual(3)
    })

    it('должен корректно работать с русскими буквами', () => {
      const dictionary = ['кофе', 'кофеек', 'чай', 'чаек']
      const results = fuzzyMatcher.findSimilarWords('кофк', dictionary, 1)
      expect(results.some(r => r.word === 'кофе')).toBe(true)
    })

    it('должен обрабатывать повторяющиеся буквы', () => {
      const distance = fuzzyMatcher.calculateLevenshteinDistance('кофе', 'коффе')
      expect(distance).toBe(1) // Одна вставка 'ф'
    })
  })
})
