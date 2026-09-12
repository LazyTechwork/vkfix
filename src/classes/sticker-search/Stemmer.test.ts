import { describe, it, expect } from 'vitest'
import { stemWord } from './Stemmer'

describe('Stemmer', () => {
  it('сводит формы одного слова к общей основе', () => {
    expect(stemWord('работаю')).toBe(stemWord('работе'))
    expect(stemWord('работаю')).toBe(stemWord('работа'))
    expect(stemWord('ночи')).toBe(stemWord('ночь'))
    expect(stemWord('приветствую')).toBe(stemWord('приветствие'))
    expect(stemWord('спокойной')).toBe(stemWord('спокойный'))
  })

  it('не режет глагольные окончания у существительных', () => {
    // «ет» отсекается только после «а»/«я», иначе «привет» стал бы «прив»
    expect(stemWord('привет')).toBe('привет')
    expect(stemWord('совет')).toBe('совет')
    expect(stemWord('билет')).toBe('билет')
  })

  it('оставляет короткие слова и латиницу как есть', () => {
    expect(stemWord('кот')).toBe('кот')
    expect(stemWord('ok')).toBe('ok')
    expect(stemWord('hello')).toBe('hello')
  })

  it('не оставляет слишком короткую основу', () => {
    expect(stemWord('еда').length).toBeGreaterThanOrEqual(3)
    expect(stemWord('дома').length).toBeGreaterThanOrEqual(3)
  })

  it('приводит «ё» к «е»', () => {
    expect(stemWord('ёжика')).toBe(stemWord('ежика'))
  })
})
