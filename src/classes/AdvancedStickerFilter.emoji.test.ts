import { describe, it, expect, beforeEach } from 'vitest';
import * as AdvancedStickerFilter from './AdvancedStickerFilter';
import { PhotoSticker } from '../modules/messenger/types';

/**
 * Интеграционный тест для проверки работы эмодзи в реальном сценарии
 * Эмулирует поток данных как в messenger.ts
 */
describe('AdvancedStickerFilter - Emoji Integration', () => {
    beforeEach(() => {
        // Сбрасываем searchEngine перед каждым тестом
        AdvancedStickerFilter.resetStickerSearch();
    });

    /**
     * Эмулирует функцию getWords из messenger.ts
     */
    function getWords(str: string): string[] {
        // Разделяем по пробелам и спецсимволам, но сохраняем эмодзи
        const tokens = str.toLowerCase().split(/[\s]+/).filter(x => x.length > 0);
        
        const result: string[] = [];
        for (const token of tokens) {
            // Извлекаем буквы/цифры
            const letterMatches = token.match(/[а-яa-z0-9]+/g);
            if (letterMatches) {
                result.push(...letterMatches);
            }
            
            // Извлекаем эмодзи
            const emojiMatches = token.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]+/gu);
            if (emojiMatches) {
                result.push(...emojiMatches);
            }
        }
        
        return result;
    }

    /**
     * Эмулирует функцию photosToStickers из messenger.ts
     */
    function createStickerFromPhoto(text: string, photoId: number = 1): PhotoSticker {
        const suggestions = [text];
        return {
            photo: {
                id: photoId,
                owner_id: 1,
                album_id: 1,
                date: Date.now(),
                orig_photo: { height: 100, width: 100, type: 'base', url: 'test.png' },
                sizes: [],
                text: text
            },
            suggestions,
            lowerSuggestions: suggestions.map(s => s.toLocaleLowerCase()),
            lowerWords: suggestions.map(s => getWords(s)).flat()
        };
    }

    describe('Поиск эмодзи в photo.text (интеграционный тест)', () => {
        it('должен найти стикер по эмодзи 👊 в тексте', () => {
            // Создаём стикер как в messenger.ts
            const sticker = createStickerFromPhoto('👊 Удар кулаком', 1);
            const stickers = [sticker];

            // Инициализируем поиск
            AdvancedStickerFilter.initializeStickerSearch(stickers);

            // Проверяем, что lowerWords содержит эмодзи
            expect(sticker.lowerWords).toContain('👊');
            expect(sticker.lowerWords).toContain('удар');
            expect(sticker.lowerWords).toContain('кулаком');

            // Ищем по эмодзи
            const results = AdvancedStickerFilter.smartStickerSearch(stickers, '👊');
            
            expect(results.length).toBeGreaterThan(0);
            expect(results[0].photo.id).toBe(1);
        });

        it('должен найти стикер по эмодзи 😂 в конце текста', () => {
            const sticker = createStickerFromPhoto('Смех 😂', 1);
            const stickers = [sticker];

            AdvancedStickerFilter.initializeStickerSearch(stickers);

            const results = AdvancedStickerFilter.smartStickerSearch(stickers, '😂');
            
            expect(results.length).toBeGreaterThan(0);
            expect(results[0].photo.id).toBe(1);
        });

        it('должен найти стикер где только эмодзи 🔥', () => {
            const sticker = createStickerFromPhoto('🔥', 1);
            const stickers = [sticker];

            AdvancedStickerFilter.initializeStickerSearch(stickers);

            expect(sticker.lowerWords).toEqual(['🔥']);

            const results = AdvancedStickerFilter.smartStickerSearch(stickers, '🔥');
            
            expect(results.length).toBeGreaterThan(0);
            expect(results[0].photo.id).toBe(1);
        });

        it('должен найти стикер с комбинацией эмодзи ❤️😍', () => {
            const sticker = createStickerFromPhoto('Любовь ❤️😍', 1);
            const stickers = [sticker];

            AdvancedStickerFilter.initializeStickerSearch(stickers);

            // Проверяем, что оба эмодзи извлечены
            // Примечание: ❤️ может быть извлечён как ❤ (без вариационного селектора)
            expect(sticker.lowerWords).toContain('любовь');
            // Проверяем наличие любого варианта сердца
            expect(sticker.lowerWords.some(w => w.startsWith('❤'))).toBe(true);
            expect(sticker.lowerWords).toContain('😍');

            // Поиск по первому эмодзи (работает с обоими вариантами)
            const results1 = AdvancedStickerFilter.smartStickerSearch(stickers, '❤️');
            expect(results1.length).toBeGreaterThan(0);
            expect(results1[0].photo.id).toBe(1);

            // Поиск по второму эмодзи
            const results2 = AdvancedStickerFilter.smartStickerSearch(stickers, '😍');
            expect(results2.length).toBeGreaterThan(0);
            expect(results2[0].photo.id).toBe(1);
        });

        it('должен найти стикер по смешанному запросу "привет 👋"', () => {
            const sticker = createStickerFromPhoto('Привет 👋', 1);
            const stickers = [sticker];

            AdvancedStickerFilter.initializeStickerSearch(stickers);

            expect(sticker.lowerWords).toContain('привет');
            expect(sticker.lowerWords).toContain('👋');

            const results = AdvancedStickerFilter.smartStickerSearch(stickers, 'привет 👋');
            
            expect(results.length).toBeGreaterThan(0);
            expect(results[0].photo.id).toBe(1);
        });

        it('должен найти стикер по тексту содержащему эмодзи "огонь 🔥"', () => {
            const sticker = createStickerFromPhoto('Круто 🔥', 1);
            const stickers = [sticker];

            AdvancedStickerFilter.initializeStickerSearch(stickers);

            const results = AdvancedStickerFilter.smartStickerSearch(stickers, 'огонь 🔥');
            
            // Должен найти по эмодзи
            expect(results.length).toBeGreaterThan(0);
        });

        it('должен работать с несколькими стикерами с эмодзи', () => {
            const stickers = [
                createStickerFromPhoto('👊 Удар', 1),
                createStickerFromPhoto('👋 Привет', 2),
                createStickerFromPhoto('😂 Смех', 3),
                createStickerFromPhoto('❤️ Любовь', 4)
            ];

            AdvancedStickerFilter.initializeStickerSearch(stickers);

            // Поиск по каждому эмодзи
            const result1 = AdvancedStickerFilter.smartStickerSearch(stickers, '👊');
            expect(result1.length).toBe(1);
            expect(result1[0].photo.id).toBe(1);

            const result2 = AdvancedStickerFilter.smartStickerSearch(stickers, '👋');
            expect(result2.length).toBe(1);
            expect(result2[0].photo.id).toBe(2);

            const result3 = AdvancedStickerFilter.smartStickerSearch(stickers, '😂');
            expect(result3.length).toBe(1);
            expect(result3[0].photo.id).toBe(3);

            const result4 = AdvancedStickerFilter.smartStickerSearch(stickers, '❤️');
            expect(result4.length).toBe(1);
            expect(result4[0].photo.id).toBe(4);
        });

        it('не должен ломаться на сложных эмодзи с модификаторами', () => {
            // Эмодзи с модификатором кожи
            const sticker1 = createStickerFromPhoto('👍🏻', 1);
            // Семейный эмодзи
            const sticker2 = createStickerFromPhoto('👨‍👩‍👧‍👦', 2);
            
            const stickers = [sticker1, sticker2];

            AdvancedStickerFilter.initializeStickerSearch(stickers);

            // Просто проверяем, что не падает
            const results1 = AdvancedStickerFilter.smartStickerSearch(stickers, '👍🏻');
            const results2 = AdvancedStickerFilter.smartStickerSearch(stickers, '👨‍👩‍👧‍👦');
            
            // Хотя бы один результат должен быть
            expect(results1.length + results2.length).toBeGreaterThan(0);
        });
    });
});
