import {PhotoSize, PhotoSticker} from "../modules/messenger/types";

interface SearchResult {
    sticker: PhotoSticker;
    score: number;
    matches: MatchDetails[];
}

interface MatchDetails {
    type: 'exact' | 'partial' | 'fuzzy' | 'semantic' | 'phonetic';
    field: 'word' | 'suggestion' | 'tag';
    value: string;
    score: number;
    position?: number;
}

interface SearchOptions {
    fuzzyThreshold?: number; // 0-1, порог для нечеткого поиска
    enablePhonetic?: boolean; // фонетический поиск
    enableSemantic?: boolean; // семантический поиск
    boostExactMatches?: number; // множитель для точных совпадений
    boostStartsWith?: number; // множитель для совпадений в начале
    boostPopularity?: boolean; // учитывать популярность
    maxResults?: number; // максимум результатов
    minScore?: number; // минимальный score для включения в результат
}

class AdvancedStickerFilter {
    private readonly defaultOptions: Required<SearchOptions> = {
        fuzzyThreshold: 0.7,
        enablePhonetic: true,
        enableSemantic: true,
        boostExactMatches: 2.0,
        boostStartsWith: 1.5,
        boostPopularity: true,
        maxResults: 50,
        minScore: 0.1
    };

    private phoneticCache = new Map<string, string>();
    private semanticCache = new Map<string, string[]>();

    /**
     * Основная функция поиска и сортировки стикеров
     */
    public searchStickers(
        stickers: PhotoSticker[],
        query: string,
        options: SearchOptions = {}
    ): SearchResult[] {
        const opts = { ...this.defaultOptions, ...options };
        const normalizedQuery = this.normalizeQuery(query);
        const queryWords = this.extractWords(normalizedQuery);

        if (!normalizedQuery.trim() || queryWords.length === 0) {
            return this.getDefaultResults(stickers, opts);
        }

        const results: SearchResult[] = [];

        for (const sticker of stickers) {
            const searchResult = this.evaluateSticker(sticker, normalizedQuery, queryWords, opts);
            if (searchResult.score >= opts.minScore) {
                results.push(searchResult);
            }
        }

        return this.sortAndLimitResults(results, opts);
    }

    /**
     * Оценка релевантности стикера для поискового запроса
     */
    private evaluateSticker(
        sticker: PhotoSticker,
        query: string,
        queryWords: string[],
        options: Required<SearchOptions>
    ): SearchResult {
        const matches: MatchDetails[] = [];
        let totalScore = 0;

        // 1. Точные совпадения в словах (lowerWords используем как теги)
        const exactWordMatches = this.findExactMatches(sticker.lowerWords, queryWords, 'tag');
        matches.push(...exactWordMatches);
        totalScore += exactWordMatches.reduce((sum, m) => sum + m.score, 0) * options.boostExactMatches;

        // 2. Точные совпадения в подсказках
        const exactSuggestionMatches = this.findExactMatches(sticker.lowerSuggestions, queryWords, 'suggestion');
        matches.push(...exactSuggestionMatches);
        totalScore += exactSuggestionMatches.reduce((sum, m) => sum + m.score, 0) * options.boostExactMatches;

        // 3. Частичные совпадения
        const partialMatches = this.findPartialMatches(
            [...sticker.lowerWords, ...sticker.lowerSuggestions],
            query,
            queryWords
        );
        matches.push(...partialMatches);
        totalScore += partialMatches.reduce((sum, m) => sum + m.score, 0);

        // 4. Нечеткий поиск (Fuzzy matching)
        if (options.fuzzyThreshold > 0) {
            const fuzzyMatches = this.findFuzzyMatches(
                [...sticker.lowerWords, ...sticker.lowerSuggestions],
                queryWords,
                options.fuzzyThreshold
            );
            matches.push(...fuzzyMatches);
            totalScore += fuzzyMatches.reduce((sum, m) => sum + m.score, 0) * 0.8;
        }

        // 5. Фонетический поиск
        if (options.enablePhonetic) {
            const phoneticMatches = this.findPhoneticMatches(
                [...sticker.lowerWords, ...sticker.lowerSuggestions],
                queryWords
            );
            matches.push(...phoneticMatches);
            totalScore += phoneticMatches.reduce((sum, m) => sum + m.score, 0) * 0.6;
        }

        // 6. Семантический поиск (упрощенный)
        if (options.enableSemantic) {
            const semanticMatches = this.findSemanticMatches(sticker, queryWords);
            matches.push(...semanticMatches);
            totalScore += semanticMatches.reduce((sum, m) => sum + m.score, 0) * 0.7;
        }

        // 7. Бонусы за позицию совпадения
        totalScore += this.calculatePositionBonus(matches, options);

        // 8. Нормализация score
        const normalizedScore = Math.min(totalScore / Math.max(queryWords.length, 1), 10);

        return {
            sticker,
            score: normalizedScore,
            matches: matches.sort((a, b) => b.score - a.score)
        };
    }

    /**
     * Поиск точных совпадений
     */
    private findExactMatches(
        searchFields: string[],
        queryWords: string[],
        fieldType: 'word' | 'suggestion' | 'tag'
    ): MatchDetails[] {
        const matches: MatchDetails[] = [];

        for (const word of queryWords) {
            for (let i = 0; i < searchFields.length; i++) {
                const field = searchFields[i];
                if (field === word) {
                    matches.push({
                        type: 'exact',
                        field: fieldType,
                        value: field,
                        score: 1.0,
                        position: i
                    });
                }
            }
        }

        return matches;
    }

    /**
     * Поиск частичных совпадений
     */
    private findPartialMatches(
        searchFields: string[],
        query: string,
        queryWords: string[]
    ): MatchDetails[] {
        const matches: MatchDetails[] = [];

        for (const field of searchFields) {
            // Проверка содержания полного запроса
            if (field.includes(query)) {
                const score = query.length / field.length;
                matches.push({
                    type: 'partial',
                    field: 'word',
                    value: field,
                    score: score * 0.8,
                    position: field.indexOf(query)
                });
            }

            // Проверка содержания отдельных слов
            for (const word of queryWords) {
                if (word.length > 2 && field.includes(word) && field !== word) {
                    const score = word.length / field.length;
                    matches.push({
                        type: 'partial',
                        field: 'word',
                        value: field,
                        score: score * 0.6,
                        position: field.indexOf(word)
                    });
                }
            }
        }

        return matches;
    }

    /**
     * Нечеткий поиск (упрощенная реализация расстояния Левенштейна)
     */
    private findFuzzyMatches(
        searchFields: string[],
        queryWords: string[],
        threshold: number
    ): MatchDetails[] {
        const matches: MatchDetails[] = [];

        for (const word of queryWords) {
            if (word.length < 3) continue; // Слишком короткие слова пропускаем

            for (const field of searchFields) {
                const similarity = this.calculateSimilarity(word, field);
                if (similarity >= threshold) {
                    matches.push({
                        type: 'fuzzy',
                        field: 'word',
                        value: field,
                        score: similarity * 0.7
                    });
                }
            }
        }

        return matches;
    }

    /**
     * Фонетический поиск (упрощенная реализация)
     */
    private findPhoneticMatches(
        searchFields: string[],
        queryWords: string[]
    ): MatchDetails[] {
        const matches: MatchDetails[] = [];

        for (const word of queryWords) {
            const phoneticWord = this.getPhoneticKey(word);

            for (const field of searchFields) {
                const phoneticField = this.getPhoneticKey(field);
                if (phoneticWord === phoneticField && word !== field) {
                    matches.push({
                        type: 'phonetic',
                        field: 'word',
                        value: field,
                        score: 0.5
                    });
                }
            }
        }

        return matches;
    }

    /**
     * Семантический поиск (упрощенный)
     */
    private findSemanticMatches(
        sticker: PhotoSticker,
        queryWords: string[]
    ): MatchDetails[] {
        const matches: MatchDetails[] = [];

        // Простая семантическая связь через категории и синонимы
        const semanticMap = this.getSemanticMap();

        for (const word of queryWords) {
            const synonyms = semanticMap.get(word) || [];

            for (const synonym of synonyms) {
                const searchFields = [...sticker.lowerWords, ...sticker.lowerSuggestions];

                if (searchFields.includes(synonym)) {
                    matches.push({
                        type: 'semantic',
                        field: 'word',
                        value: synonym,
                        score: 0.4
                    });
                }
            }
        }

        return matches;
    }

    /**
     * Расчет бонуса за позицию совпадения
     */
    private calculatePositionBonus(
        matches: MatchDetails[],
        options: Required<SearchOptions>
    ): number {
        let bonus = 0;

        for (const match of matches) {
            if (match.position !== undefined) {
                // Бонус за совпадения в начале
                if (match.position === 0) {
                    bonus += match.score * options.boostStartsWith * 0.2;
                }

                // Убывающий бонус по позиции
                const positionBonus = Math.max(0, (1 - match.position / 10)) * 0.1;
                bonus += match.score * positionBonus;
            }
        }

        return bonus;
    }

    /**
     * Сортировка и ограничение результатов
     */
    private sortAndLimitResults(
        results: SearchResult[],
        options: Required<SearchOptions>
    ): SearchResult[] {
        return results
            .sort((a, b) => {
                // Сначала по релевантности
                if (Math.abs(a.score - b.score) > 0.01) {
                    return b.score - a.score;
                }

                // Затем по количеству совпадений
                if (a.matches.length !== b.matches.length) {
                    return b.matches.length - a.matches.length;
                }

                // Наконец, по дате создания (новые первыми) - используем timestamp из photo.date
                const aDate = a.sticker.photo.date || 0;
                const bDate = b.sticker.photo.date || 0;
                return bDate - aDate;
            })
            .slice(0, options.maxResults);
    }

    /**
     * Результаты по умолчанию (когда нет запроса)
     */
    private getDefaultResults(
        stickers: PhotoSticker[],
        options: Required<SearchOptions>
    ): SearchResult[] {
        return stickers
            .map(sticker => ({
                sticker,
                score: 0,
                matches: []
            }))
            .sort((a, b) => {
                // Сортировка по дате (новые первыми) - используем timestamp из photo.date
                const aDate = a.sticker.photo.date || 0;
                const bDate = b.sticker.photo.date || 0;
                return bDate - aDate;
            })
            .slice(0, options.maxResults);
    }

    /**
     * Нормализация поискового запроса
     */
    private normalizeQuery(query: string): string {
        return query
            .toLowerCase()
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/[^\w\s\u0400-\u04FF]/g, ''); // Поддержка кириллицы
    }

    /**
     * Извлечение слов из запроса
     */
    private extractWords(query: string): string[] {
        return query
            .split(/\s+/)
            .filter(word => word.length > 0)
            .filter(word => !this.isStopWord(word));
    }

    /**
     * Проверка на стоп-слова
     */
    private isStopWord(word: string): boolean {
        const stopWords = new Set([
            'и', 'в', 'на', 'с', 'по', 'для', 'от', 'до', 'или', 'но', 'а', 'то',
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with'
        ]);
        return stopWords.has(word);
    }

    /**
     * Расчет схожести строк (упрощенный)
     */
    private calculateSimilarity(str1: string, str2: string): number {
        if (str1 === str2) return 1.0;
        if (str1.length === 0 || str2.length === 0) return 0.0;

        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;

        if (longer.length === 0) return 1.0;

        const distance = this.levenshteinDistance(longer, shorter);
        return (longer.length - distance) / longer.length;
    }

    /**
     * Расстояние Левенштейна
     */
    private levenshteinDistance(str1: string, str2: string): number {
        const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

        for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
        for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

        for (let j = 1; j <= str2.length; j++) {
            for (let i = 1; i <= str1.length; i++) {
                const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(
                    matrix[j][i - 1] + 1,
                    matrix[j - 1][i] + 1,
                    matrix[j - 1][i - 1] + indicator
                );
            }
        }

        return matrix[str2.length][str1.length];
    }

    /**
     * Получение фонетического ключа (упрощенный Soundex)
     */
    private getPhoneticKey(word: string): string {
        if (this.phoneticCache.has(word)) {
            return this.phoneticCache.get(word)!;
        }

        // Упрощенная фонетическая обработка
        let key = word
            .toLowerCase()
            .replace(/[аяеёиыуюo]/g, 'a') // Гласные
            .replace(/[бп]/g, 'b')
            .replace(/[вф]/g, 'v')
            .replace(/[гк]/g, 'g')
            .replace(/[дт]/g, 'd')
            .replace(/[жш]/g, 'zh')
            .replace(/[зс]/g, 'z')
            .replace(/[лр]/g, 'l')
            .replace(/[мн]/g, 'm')
            .replace(/[цч]/g, 'c');

        this.phoneticCache.set(word, key);
        return key;
    }

    /**
     * Получение семантической карты
     */
    private getSemanticMap(): Map<string, string[]> {
        if (this.semanticCache.size === 0) {
            // Простая семантическая карта - можно расширить
            const semanticPairs: Array<[string, string[]]> = [
                ['кот', ['котик', 'кошка', 'киса', 'мурка']],
                ['собака', ['пес', 'щенок', 'песик', 'собачка']],
                ['смех', ['смеется', 'хахаха', 'ржака', 'прикол']],
                ['грусть', ['печаль', 'слезы', 'плачет', 'расстроен']],
                ['любовь', ['сердце', 'влюблен', 'романтика', 'поцелуй']],
                ['еда', ['кушать', 'вкусно', 'голодный', 'аппетит']],
                ['праздник', ['торжество', 'веселье', 'день рождения', 'новый год']],
                ['работа', ['офис', 'труд', 'карьера', 'бизнес']],
                ['спорт', ['тренировка', 'фитнес', 'здоровье', 'активность']],
                ['музыка', ['песня', 'мелодия', 'концерт', 'ритм']]
            ];

            for (const [key, synonyms] of semanticPairs) {
                // Устанавливаем основное слово со списком синонимов
                this.semanticCache.set(key, synonyms);

                // Добавляем обратные связи: каждый синоним указывает на основное слово и другие синонимы
                for (const synonym of synonyms) {
                    const relatedWords = synonyms.filter(s => s !== synonym);
                    relatedWords.push(key);
                    this.semanticCache.set(synonym, relatedWords);
                }
            }
        }

        return this.semanticCache;
    }
}

const filter = new AdvancedStickerFilter();

/**
 * Умный поиск стикеров - возвращает подходящие стикеры только когда это уместно
 */
export function smartStickerSearch(
    stickers: PhotoSticker[],
    userMessage: string
): PhotoSticker[] {

    // Нормализуем сообщение пользователя
    const normalizedMessage = userMessage.toLowerCase().trim();

    // Проверяем, стоит ли искать стикеры
    if (!shouldSearchStickers(normalizedMessage)) {
        return [];
    }

    // Извлекаем ключевые слова для поиска
    const searchQuery = extractSearchKeywords(normalizedMessage);

    if (!searchQuery) {
        return [];
    }

    // Выполняем поиск с оптимальными настройками
    const results = filter.searchStickers(stickers, searchQuery, {
        fuzzyThreshold: 0.75,
        enablePhonetic: true,
        enableSemantic: true,
        boostExactMatches: 2.5,
        boostStartsWith: 1.8,
        boostPopularity: false, // Не используем популярность из Photo
        maxResults: 8, // Ограничиваем количество для удобства
        minScore: 0.3 // Довольно высокий порог для качественных результатов
    });

    // Возвращаем только стикеры, оставляя PhotoSticker[]
    return results.map(result => result.sticker);
}

/**
 * Определяет, стоит ли искать стикеры для данного сообщения
 */
function shouldSearchStickers(message: string): boolean {
    // Слишком короткие сообщения (менее 1 символа)
    if (message.length < 1) {
        return false;
    }

    // Технические команды и URL
    if (message.startsWith('/') || message.includes('http') || message.includes('www.')) {
        return false;
    }

    // Только цифры
    if (/^\d+$/.test(message)) {
        return false;
    }

    // Формальные фразы (деловая переписка) - только для длинных сообщений
    if (message.length > 50) {
        const formalPhrases = [
            'уважаемый', 'с уважением', 'благодарю', 'прошу вас', 'информирую',
            'согласно', 'в соответствии', 'докладываю', 'отчет', 'протокол'
        ];

        if (formalPhrases.some(phrase => message.includes(phrase))) {
            return false;
        }
    }

    // Очень длинные сообщения (более 200 символов) - скорее всего серьезный разговор
    if (message.length > 200) {
        return false;
    }

    // Для большинства случаев разрешаем поиск стикеров
    return true;
}

/**
 * Извлекает ключевые слова для поиска из сообщения пользователя
 */
function extractSearchKeywords(message: string): string {
    // Убираем лишние символы и нормализуем
    let cleaned = message
        .replace(/[^\w\s\u0400-\u04FF]/g, ' ') // Оставляем только буквы и кириллицу
        .replace(/\s+/g, ' ')
        .trim();

    // Если после очистки пусто, возвращаем исходное сообщение
    if (!cleaned) {
        return message.trim();
    }

    // Разбиваем на слова
    const words = cleaned.split(' ').filter(word => word.length > 0);

    // Убираем только самые частые стоп-слова, оставляем содержательные
    const stopWords = new Set([
        'я', 'ты', 'он', 'она', 'мы', 'вы', 'они',
        'и', 'а', 'но', 'или', 'что', 'как', 'где',
        'в', 'на', 'за', 'под', 'над', 'при',
        'очень', 'совсем', 'просто'
    ]);

    const meaningfulWords = words.filter(word => !stopWords.has(word));

    // Если после фильтрации ничего не осталось, возвращаем исходное очищенное сообщение
    if (meaningfulWords.length === 0) {
        return cleaned;
    }

    return meaningfulWords.join(' ');
}

/**
 * Проверяет, содержит ли сообщение эмоциональный контент
 */
function containsEmotionalContent(message: string): boolean {
    // Повторяющиеся символы (признак эмоциональности)
    if (/(.)\1{2,}/.test(message)) {
        return true;
    }

    // Много восклицательных или вопросительных знаков
    if (/[!?]{2,}/.test(message)) {
        return true;
    }

    // Междометия и звукоподражания
    const interjections = [
        'ах', 'ох', 'ух', 'эх', 'ого', 'ага', 'угу', 'хм', 'тсс',
        'ой', 'ай', 'уй', 'фу', 'тьфу', 'брр', 'ммм', 'хехе'
    ];

    return interjections.some(interj => message.includes(interj));
}