import { describe, it, expect } from 'vitest'
import { switchKeyboardLayout } from './switchKeyboardLayout'

describe('switchKeyboardLayout', () => {
  describe('Русский → Английский', () => {
    it('должен переключать простые слова', () => {
      expect(switchKeyboardLayout('привет')).toBe('ghbdtn')
      expect(switchKeyboardLayout('кот')).toBe('rjn')
      expect(switchKeyboardLayout('собака')).toBe('cj,frf')
    })

    it('должен обрабатывать запятые и точки', () => {
      expect(switchKeyboardLayout('б')).toBe(',')
      expect(switchKeyboardLayout('ю')).toBe('.')
    })

    it('должен сохранять пробелы', () => {
      expect(switchKeyboardLayout('привет мир')).toBe('ghbdtn vbh')
    })
  })

  describe('Английский → Русский', () => {
    it('должен переключать простые слова', () => {
      expect(switchKeyboardLayout('ghbdtn')).toBe('привет')
      expect(switchKeyboardLayout('rjn')).toBe('кот')
      expect(switchKeyboardLayout('cj,frf')).toBe('собака')
    })

    it('должен обрабатывать запятые и точки', () => {
      expect(switchKeyboardLayout(',')).toBe('б')
      expect(switchKeyboardLayout('.')).toBe('ю')
    })

    it('должен сохранять пробелы', () => {
      expect(switchKeyboardLayout('ghbdtn vbh')).toBe('привет мир')
    })
  })

  describe('Смешанный текст', () => {
    it('должен сохранять цифры', () => {
      expect(switchKeyboardLayout('привет123')).toBe('ghbdtn123')
    })

    it('должен сохранять спецсимволы', () => {
      expect(switchKeyboardLayout('привет!')).toBe('ghbdtn!')
      expect(switchKeyboardLayout('привет?')).toBe('ghbdtn?')
    })
  })

  describe('Граничные случаи', () => {
    it('должен обрабатывать пустую строку', () => {
      expect(switchKeyboardLayout('')).toBe('')
    })

    it('должен обрабатывать строку только из пробелов', () => {
      expect(switchKeyboardLayout('   ')).toBe('   ')
    })

    it('должен обрабатывать строку только из цифр', () => {
      expect(switchKeyboardLayout('12345')).toBe('12345')
    })
  })

  describe('Реальные сценарии', () => {
    it('пользователь набрал "ghbdtn" вместо "привет"', () => {
      expect(switchKeyboardLayout('ghbdtn')).toBe('привет')
    })

    it('пользователь набрал "rjn" вместо "кот"', () => {
      expect(switchKeyboardLayout('rjn')).toBe('кот')
    })

    it('пользователь набрал "cj,frf" вместо "собака"', () => {
      expect(switchKeyboardLayout('cj,frf')).toBe('собака')
    })

    it('пользователь набрал "hello" на русской раскладке', () => {
      expect(switchKeyboardLayout('руддщ')).toBe('hello')
    })
  })
})
