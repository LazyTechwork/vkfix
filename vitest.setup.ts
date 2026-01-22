import { vi } from 'vitest'

// Мокаем глобальные объекты браузера для тестов
global.window = {
  console: console,
  opera: undefined,
  location: {
    host: 'vk.com'
  }
} as any

global.document = {
  createElement: vi.fn(),
  body: {
    appendChild: vi.fn()
  }
} as any

// Мокаем GM API
global.GM_getValue = vi.fn()
global.GM_setValue = vi.fn()
global.GM_log = vi.fn()

// Мокаем Logger
vi.mock('./src/classes/Logger', () => ({
  Logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn()
  }
}))

// Мокаем switchKeyboardLayout
vi.mock('./src/common/helpers/switchKeyboardLayout', () => ({
  switchKeyboardLayout: (text: string) => {
    // Простая реализация для тестов с поддержкой заглавных букв
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
