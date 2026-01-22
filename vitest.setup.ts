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
    // Простая реализация для тестов
    const ruToEn: Record<string, string> = {
      'й': 'q', 'ц': 'w', 'у': 'e', 'к': 'r', 'е': 't', 'н': 'y', 'г': 'u', 'ш': 'i', 'щ': 'o', 'з': 'p',
      'х': '[', 'ъ': ']', 'ф': 'a', 'ы': 's', 'в': 'd', 'а': 'f', 'п': 'g', 'р': 'h', 'о': 'j', 'л': 'k',
      'д': 'l', 'ж': ';', 'э': '\'', 'я': 'z', 'ч': 'x', 'с': 'c', 'м': 'v', 'и': 'b', 'т': 'n', 'ь': 'm',
      'б': ',', 'ю': '.'
    }
    
    const enToRu: Record<string, string> = {}
    for (const [ru, en] of Object.entries(ruToEn)) {
      enToRu[en] = ru
    }
    
    let result = ''
    for (const char of text.toLowerCase()) {
      result += enToRu[char] || ruToEn[char] || char
    }
    
    return result
  }
}))
