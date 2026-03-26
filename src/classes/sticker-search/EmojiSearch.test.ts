import { describe, it, expect, beforeEach } from 'vitest';
import { SearchEngine } from './SearchEngine';
import { PhotoSticker } from '../../modules/messenger/types';

/**
 * Тесты для поддержки эмодзи в поиске стикеров
 */
describe('Emoji Search', () => {
  let searchEngine: SearchEngine;

  const createSticker = (
    id: number,
    suggestions: string[],
    words: string[] = []
  ): PhotoSticker => {
    const lowerSuggestions = suggestions.map(s => s.toLowerCase());
    const lowerWords = words.length > 0 ? words.map(w => w.toLowerCase()) : lowerSuggestions;
    
    return {
      photo: {
        id,
        owner_id: 1,
        album_id: 1,
        date: Date.now(),
        orig_photo: { height: 100, width: 100, type: 'base', url: 'test.png' },
        sizes: [],
        text: ''
      },
      suggestions,
      lowerSuggestions,
      lowerWords
    };
  };

  beforeEach(() => {
    searchEngine = new SearchEngine();
  });

  describe('Поиск по одиночным эмодзи', () => {
    it('должен найти стикер по эмодзи 👊', () => {
      const stickers = [
        createSticker(1, ['Удар', '👊'], ['удар', '👊']),
        createSticker(2, ['Привет', '👋'], ['привет', '👋']),
        createSticker(3, ['Смех', '😂'], ['смех', '😂'])
      ];

      const results = searchEngine.search(stickers, '👊');
      
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toBe(stickers[0]);
    });

    it('должен найти стикер по эмодзи 😂', () => {
      const stickers = [
        createSticker(1, ['Удар', '👊'], ['удар', '👊']),
        createSticker(2, ['Привет', '👋'], ['привет', '👋']),
        createSticker(3, ['Смех', '😂'], ['смех', '😂'])
      ];

      const results = searchEngine.search(stickers, '😂');
      
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toBe(stickers[2]);
    });

    it('должен найти стикер по эмодзи ❤️', () => {
      const stickers = [
        createSticker(1, ['Любовь', '❤️'], ['любовь', '❤️']),
        createSticker(2, ['Привет', '👋'], ['привет', '👋'])
      ];

      const results = searchEngine.search(stickers, '❤️');
      
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toBe(stickers[0]);
    });
  });

  describe('Поиск по комбинациям эмодзи', () => {
    it('должен найти стикер по комбинации эмодзи', () => {
      const stickers = [
        // Эмодзи хранятся раздельно в lowerWords
        createSticker(1, ['Любовь', '❤️😍'], ['любовь', '❤️', '😍']),
        createSticker(2, ['Привет', '👋'], ['привет', '👋'])
      ];

      const results = searchEngine.search(stickers, '❤️😍');
      
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toBe(stickers[0]);
    });

    it('должен найти стикер по эмодзи с пробелами', () => {
      const stickers = [
        createSticker(1, ['Любовь', '❤️ 😍'], ['любовь', '❤️ 😍']),
        createSticker(2, ['Привет', '👋'], ['привет', '👋'])
      ];

      const results = searchEngine.search(stickers, '❤️ 😍');
      
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toBe(stickers[0]);
    });
  });

  describe('Смешанный поиск (текст + эмодзи)', () => {
    it('должен найти стикер по тексту с эмодзи', () => {
      const stickers = [
        createSticker(1, ['Привет 👋'], ['привет', '👋']),
        createSticker(2, ['Удар 👊'], ['удар', '👊'])
      ];

      const results = searchEngine.search(stickers, 'привет 👋');
      
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toBe(stickers[0]);
    });

    it('должен найти стикер по тексту содержащему эмодзи', () => {
      const stickers = [
        createSticker(1, ['Круто 🔥'], ['круто', '🔥']),
        createSticker(2, ['Смех 😂'], ['смех', '😂'])
      ];

      const results = searchEngine.search(stickers, '🔥');
      
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toBe(stickers[0]);
    });
  });

  describe('Валидация эмодзи запросов', () => {
    it('должен разрешать одиночные эмодзи', () => {
      const stickers = [
        createSticker(1, ['Удар', '👊'], ['удар', '👊'])
      ];

      const results = searchEngine.search(stickers, '👊');
      expect(results.length).toBeGreaterThan(0);
    });

    it('должен разрешать несколько эмодзи подряд', () => {
      const stickers = [
        createSticker(1, ['Огонь', '🔥🔥🔥'], ['огонь', '🔥🔥🔥'])
      ];

      const results = searchEngine.search(stickers, '🔥🔥🔥');
      expect(results.length).toBeGreaterThan(0);
    });

    it('должен возвращать пустой результат для пустого запроса', () => {
      const stickers = [
        createSticker(1, ['Удар', '👊'], ['удар', '👊'])
      ];

      const results = searchEngine.search(stickers, '');
      expect(results.length).toBe(0);
    });
  });

  describe('Релевантность результатов', () => {
    it('должен сортировать результаты по релевантности для эмодзи', () => {
      const stickers = [
        createSticker(1, ['👊 Удар'], ['👊', 'удар']), // Эмодзи в начале
        createSticker(2, ['Удар 👊'], ['удар', '👊']), // Эмодзи в конце
        createSticker(3, ['Привет 👋'], ['привет', '👋']) // Другой эмодзи
      ];

      const results = searchEngine.search(stickers, '👊');
      
      expect(results.length).toBe(2);
      expect(results[0]).toBe(stickers[0]);
      expect(results[1]).toBe(stickers[1]);
    });

    it('должен отдавать приоритет точным совпадениям эмодзи', () => {
      const stickers = [
        createSticker(1, ['Смех 😂'], ['смех', '😂']),
        createSticker(2, ['Просто смех'], ['смех'])
      ];

      const results = searchEngine.search(stickers, '😂');
      
      expect(results.length).toBe(1);
      expect(results[0]).toBe(stickers[0]);
    });
  });

  describe('Различные типы эмодзи', () => {
    it('должен работать с эмодзи людей', () => {
      const stickers = [
        createSticker(1, ['Привет', '👨‍👩‍👧‍👦'], ['привет', '👨‍👩‍👧‍👦'])
      ];

      const results = searchEngine.search(stickers, '👨‍👩‍👧‍👦');
      expect(results.length).toBeGreaterThan(0);
    });

    it('должен работать с эмодзи животных', () => {
      const stickers = [
        createSticker(1, ['Кот', '🐱'], ['кот', '🐱']),
        createSticker(2, ['Собака', '🐶'], ['собака', '🐶'])
      ];

      const results = searchEngine.search(stickers, '🐱');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toBe(stickers[0]);
    });

    it('должен работать с эмодзи еды', () => {
      const stickers = [
        createSticker(1, ['Пицца', '🍕'], ['пицца', '🍕']),
        createSticker(2, ['Бургер', '🍔'], ['бургер', '🍔'])
      ];

      const results = searchEngine.search(stickers, '🍕');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toBe(stickers[0]);
    });

    it('должен работать с эмодзи жестов', () => {
      const stickers = [
        createSticker(1, ['Класс', '👍'], ['класс', '👍']),
        createSticker(2, ['Дай пять', '👋'], ['дай пять', '👋'])
      ];

      const results = searchEngine.search(stickers, '👍');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toBe(stickers[0]);
    });
  });

  describe('Поиск эмодзи в тексте фото (photo.text)', () => {
    it('должен найти стикер с эмодзи 👊 в тексте фото', () => {
      // Эмуляция данных из photo.text как в messenger.ts
      const stickers = [
        {
          photo: {
            id: 1,
            owner_id: 1,
            album_id: 1,
            date: Date.now(),
            orig_photo: { height: 100, width: 100, type: 'base', url: 'test.png' },
            sizes: [],
            text: '👊 Удар кулаком'
          },
          suggestions: ['👊 Удар кулаком'],
          lowerSuggestions: ['👊 удар кулаком'],
          lowerWords: ['👊', 'удар', 'кулаком'] // Так формирует getWords в messenger.ts
        },
        {
          photo: {
            id: 2,
            owner_id: 1,
            album_id: 1,
            date: Date.now(),
            orig_photo: { height: 100, width: 100, type: 'base', url: 'test.png' },
            sizes: [],
            text: 'Привет 👋'
          },
          suggestions: ['Привет 👋'],
          lowerSuggestions: ['привет 👋'],
          lowerWords: ['привет', '👋']
        }
      ];

      const results = searchEngine.search(stickers, '👊');
      
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].photo.id).toBe(1);
    });

    it('должен найти стикер где эмодзи в конце текста', () => {
      const stickers = [
        {
          photo: {
            id: 1,
            owner_id: 1,
            album_id: 1,
            date: Date.now(),
            orig_photo: { height: 100, width: 100, type: 'base', url: 'test.png' },
            sizes: [],
            text: 'Смех 😂'
          },
          suggestions: ['Смех 😂'],
          lowerSuggestions: ['смех 😂'],
          lowerWords: ['смех', '😂']
        }
      ];

      const results = searchEngine.search(stickers, '😂');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].photo.id).toBe(1);
    });

    it('должен найти стикер где только эмодзи в тексте', () => {
      const stickers = [
        {
          photo: {
            id: 1,
            owner_id: 1,
            album_id: 1,
            date: Date.now(),
            orig_photo: { height: 100, width: 100, type: 'base', url: 'test.png' },
            sizes: [],
            text: '🔥'
          },
          suggestions: ['🔥'],
          lowerSuggestions: ['🔥'],
          lowerWords: ['🔥']
        }
      ];

      const results = searchEngine.search(stickers, '🔥');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].photo.id).toBe(1);
    });

    it('должен найти стикер с комбинацией эмодзи в тексте', () => {
      const stickers = [
        {
          photo: {
            id: 1,
            owner_id: 1,
            album_id: 1,
            date: Date.now(),
            orig_photo: { height: 100, width: 100, type: 'base', url: 'test.png' },
            sizes: [],
            text: 'Любовь ❤️😍'
          },
          suggestions: ['Любовь ❤️😍'],
          lowerSuggestions: ['любовь ❤️😍'],
          lowerWords: ['любовь', '❤️', '😍']
        }
      ];

      const results = searchEngine.search(stickers, '❤️');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].photo.id).toBe(1);
    });
  });
});
