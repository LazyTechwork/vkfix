import {PhotoSticker} from "../modules/messenger/types";

interface SearchResult {
    sticker: PhotoSticker;
    score: number;
    matches: MatchDetails[];
}

interface MatchDetails {
    type: 'exact' | 'partial' | 'fuzzy' | 'semantic';
    field: 'word' | 'suggestion';
    value: string;
    score: number;
    position?: number;
}

interface SearchOptions {
    enableSemantic?: boolean;
    boostExactMatches?: number;
    boostStartsWith?: number;
    maxResults?: number;
    minScore?: number;
}

// Предварительно вычисленные индексы для быстрого поиска
interface SearchIndex {
    exactWords: Map<string, PhotoSticker[]>; // точные совпадения слов
    exactSuggestions: Map<string, PhotoSticker[]>; // точные совпадения подсказок
    partialWords: Map<string, PhotoSticker[]>; // частичные совпадения (префиксы)
    semanticMap: Map<string, string[]>; // семантические связи
}

class OptimizedStickerFilter {
    private readonly defaultOptions: Required<SearchOptions> = {
        enableSemantic: true,
        boostExactMatches: 2.5,
        boostStartsWith: 1.8,
        maxResults: 8,
        minScore: 0.2
    };

    private searchIndex: SearchIndex | null = null;
    private isIndexBuilt = false;

    public buildIndex(stickers: PhotoSticker[]): void {
        if (this.isIndexBuilt) return;

        const exactWords = new Map<string, PhotoSticker[]>();
        const exactSuggestions = new Map<string, PhotoSticker[]>();
        const partialWords = new Map<string, PhotoSticker[]>();

        for (const sticker of stickers) {
            for (const word of sticker.lowerWords) {
                if (!exactWords.has(word)) {
                    exactWords.set(word, []);
                }
                exactWords.get(word)!.push(sticker);

                for (let i = 2; i <= word.length; i++) {
                    const prefix = word.substring(0, i);
                    if (!partialWords.has(prefix)) {
                        partialWords.set(prefix, []);
                    }
                    if (!partialWords.get(prefix)!.includes(sticker)) {
                        partialWords.get(prefix)!.push(sticker);
                    }
                }
            }

            for (const suggestion of sticker.lowerSuggestions) {
                if (!exactSuggestions.has(suggestion)) {
                    exactSuggestions.set(suggestion, []);
                }
                exactSuggestions.get(suggestion)!.push(sticker);

                for (let i = 2; i <= suggestion.length; i++) {
                    const prefix = suggestion.substring(0, i);
                    if (!partialWords.has(prefix)) {
                        partialWords.set(prefix, []);
                    }
                    if (!partialWords.get(prefix)!.includes(sticker)) {
                        partialWords.get(prefix)!.push(sticker);
                    }
                }
            }
        }

        this.searchIndex = {
            exactWords,
            exactSuggestions,
            partialWords,
            semanticMap: this.buildSemanticMap()
        };

        this.isIndexBuilt = true;
    }

    /**
     * Основная функция поиска (оптимизированная)
     */
    public searchStickers(
        stickers: PhotoSticker[],
        query: string,
        options: SearchOptions = {}
    ): SearchResult[] {
        // Строим индекс если его нет
        if (!this.isIndexBuilt) {
            this.buildIndex(stickers);
        }

        const opts = { ...this.defaultOptions, ...options };
        const normalizedQuery = this.normalizeQuery(query);
        const queryWords = this.extractWords(normalizedQuery);

        if (!normalizedQuery.trim() || queryWords.length === 0) {
            return this.getDefaultResults(stickers, opts);
        }

        // Проверяем, является ли запрос одной буквой
        const isSingleLetterQuery = queryWords.length === 1 && queryWords[0].length === 1;

        // Используем Set для быстрого поиска уникальных стикеров
        const candidateStickers = new Set<PhotoSticker>();
        const stickerScores = new Map<PhotoSticker, { score: number; matches: MatchDetails[] }>();

        // 1. Поиск точных совпадений
        for (const word of queryWords) {
            const exactWordMatches = this.searchIndex!.exactWords.get(word) || [];
            for (const sticker of exactWordMatches) {
                if (isSingleLetterQuery) {
                    // Для одной буквы требуем полное совпадение
                    if (!sticker.lowerWords.includes(word)) continue;
                }

                candidateStickers.add(sticker);
                this.addMatch(stickerScores, sticker, {
                    type: 'exact',
                    field: 'word',
                    value: word,
                    score: 1.0 * opts.boostExactMatches
                });
            }

            // Точные совпадения в подсказках
            const exactSuggestionMatches = this.searchIndex!.exactSuggestions.get(word) || [];
            for (const sticker of exactSuggestionMatches) {
                if (isSingleLetterQuery) {
                    // Для одной буквы требуем полное совпадение
                    if (!sticker.lowerWords.includes(word)) continue;
                }
                candidateStickers.add(sticker);
                this.addMatch(stickerScores, sticker, {
                    type: 'exact',
                    field: 'suggestion',
                    value: word,
                    score: 1.0 * opts.boostExactMatches
                });
            }
        }

        // 2. Частичный поиск (только если не одна буква и мало результатов)
        if (!isSingleLetterQuery && candidateStickers.size < opts.maxResults * 2) {
            for (const word of queryWords) {
                if (word.length >= 3) {
                    for (let i = 3; i <= Math.min(word.length, 6); i++) {
                        const prefix = word.substring(0, i);
                        const partialMatches = this.searchIndex!.partialWords.get(prefix) || [];
                        for (const sticker of partialMatches) {
                            if (!candidateStickers.has(sticker)) {
                                candidateStickers.add(sticker);
                                this.addMatch(stickerScores, sticker, {
                                    type: 'partial',
                                    field: 'word',
                                    value: prefix,
                                    score: 0.6 * (i / word.length)
                                });
                            }
                        }
                    }
                }
            }
        }

        // 3. Семантический поиск (только если не одна буква и включен)
        if (opts.enableSemantic && !isSingleLetterQuery && candidateStickers.size < opts.maxResults) {
            for (const word of queryWords) {
                const synonyms = this.searchIndex!.semanticMap.get(word) || [];
                for (const synonym of synonyms) {
                    const semanticMatches = this.searchIndex!.exactWords.get(synonym) || [];
                    for (const sticker of semanticMatches) {
                        if (!candidateStickers.has(sticker)) {
                            candidateStickers.add(sticker);
                            this.addMatch(stickerScores, sticker, {
                                type: 'semantic',
                                field: 'word',
                                value: synonym,
                                score: 0.7
                            });
                        }
                    }
                }
            }
        }

        // 4. Формирование результатов
        const results: SearchResult[] = [];
        for (const sticker of candidateStickers) {
            const stickerData = stickerScores.get(sticker);
            if (stickerData && stickerData.score >= opts.minScore) {
                // Бонус за количество совпавших слов запроса
                const matchedQueryWords = new Set(
                    stickerData.matches.map(m => m.value.toLowerCase())
                );
                const queryWordsSet = new Set(queryWords);
                const matchRatio = this.calculateMatchRatio(matchedQueryWords, queryWordsSet);
                const finalScore = stickerData.score * (0.5 + matchRatio * 0.5);

                results.push({
                    sticker,
                    score: Math.min(finalScore, 10),
                    matches: stickerData.matches.sort((a, b) => b.score - a.score)
                });
            }
        }

        return this.sortAndLimitResults(results, opts);
    }

    /**
     * Вычисляет коэффициент совпадения слов запроса
     */
    private calculateMatchRatio(matchedWords: Set<string>, queryWords: Set<string>): number {
        if (queryWords.size === 0) return 0;

        let matches = 0;
        for (const queryWord of queryWords) {
            // Проверяем точные совпадения
            if (matchedWords.has(queryWord)) {
                matches++;
                continue;
            }

            // Проверяем частичные совпадения
            for (const matchedWord of matchedWords) {
                if (matchedWord.includes(queryWord) || queryWord.includes(matchedWord)) {
                    matches += 0.7; // Частичное совпадение
                    break;
                }
            }
        }

        return Math.min(matches / queryWords.size, 1);
    }

    /**
     * Добавляет совпадение к стикеру
     */
    private addMatch(
        stickerScores: Map<PhotoSticker, { score: number; matches: MatchDetails[] }>,
        sticker: PhotoSticker,
        match: MatchDetails
    ): void {
        if (!stickerScores.has(sticker)) {
            stickerScores.set(sticker, { score: 0, matches: [] });
        }

        const data = stickerScores.get(sticker)!;
        data.score += match.score;
        data.matches.push(match);
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
                // Наконец, по дате
                const aDate = a.sticker.photo.date || 0;
                const bDate = b.sticker.photo.date || 0;
                return bDate - aDate;
            })
            .slice(0, options.maxResults);
    }

    /**
     * Результаты по умолчанию
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
                const aDate = a.sticker.photo.date || 0;
                const bDate = b.sticker.photo.date || 0;
                return bDate - aDate;
            })
            .slice(0, options.maxResults);
    }

    /**
     * Нормализация запроса (упрощенная)
     */
    private normalizeQuery(query: string): string {
        return query
            .toLowerCase()
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/[^\w\s\u0400-\u04FF]/g, '');
    }

    /**
     * Извлечение слов (упрощенное)
     */
    private extractWords(query: string): string[] {
        return query
            .split(/\s+/)
            .filter(word => word.length > 0)
            .filter(word => !this.isStopWord(word))
            .slice(0, 5); // Ограничиваем количество слов для скорости
    }

    /**
     * Проверка на стоп-слова (минимальный набор)
     */
    private isStopWord(word: string): boolean {
        const stopWords = new Set(['и', 'в', 'на', 'с', 'а', 'но', 'что', 'как']);
        return stopWords.has(word);
    }

    /**
     * Построение семантической карты
     */
    private buildSemanticMap(): Map<string, string[]> {
        const semanticPairs: Array<[string, string[]]> = [
            // Животные
            ['кот', ['котик', 'кошка', 'киса', 'мурка', 'котэ', 'котя', 'мяу', 'мурзик']],
            ['собака', ['пес', 'щенок', 'песик', 'собачка', 'догго', 'пёсель', 'гав', 'барбос']],
            ['птица', ['птичка', 'чирик', 'воробей', 'голубь', 'попугай']],
            ['рыба', ['рыбка', 'золотая рыбка', 'акула', 'дельфин']],
            ['медведь', ['мишка', 'косолапый', 'топтыгин', 'умка']],
            ['заяц', ['зайчик', 'кролик', 'ушастик', 'косой']],

            // Эмоции позитивные
            ['смех', ['смеется', 'хахаха', 'ржака', 'прикол', 'лол', 'кек', 'ржунимагу', 'угар', 'ржач', 'юмор', 'шутка', 'весело']],
            ['радость', ['счастье', 'веселье', 'восторг', 'ура', 'йес', 'класс', 'круто', 'супер', 'отлично']],
            ['любовь', ['сердце', 'влюблен', 'романтика', 'поцелуй', 'милый', 'дорогой', 'люблю', 'обожаю']],
            ['кайф', ['кайфует', 'наслаждение', 'релакс', 'блаженство', 'тайм-аут', 'чилл']],
            ['удивление', ['вау', 'ого', 'офигеть', 'ничего себе', 'блин', 'капец']],

            // Эмоции негативные
            ['грусть', ['печаль', 'слезы', 'плачет', 'расстроен', 'тоска', 'депрессия', 'уныние']],
            ['злость', ['бесит', 'ярость', 'гнев', 'раздражение', 'ненависть', 'достал']],
            ['страх', ['боюсь', 'ужас', 'кошмар', 'паника', 'жуть']],
            ['усталость', ['устал', 'сонный', 'выматывает', 'замотался', 'измотался']],

            // Мат и ругательства
            ['бля', ['блять', 'бл', 'блин', 'блядь', 'бляха']],
            ['хуй', ['хер', 'хрен', 'фиг', 'dick']],
            ['пизда', ['пизд', 'п*зда', 'pussy']],
            ['ебать', ['ебал', 'ебёт', 'ебу', 'fuck', 'ёб', 'еб']],
            ['сука', ['сук', 'сучка', 'bitch']],
            ['дерьмо', ['говно', 'shit', 'гавно', 'херня']],
            ['дебил', ['идиот', 'тупой', 'дурак', 'долбоеб', 'кретин', 'мудак']],
            ['пиздец', ['пздц', 'капец', 'пипец', 'кранты']],
            ['нахуй', ['нах', 'нахер', 'нафиг']],

            // Еда и напитки
            ['еда', ['кушать', 'вкусно', 'голодный', 'аппетит', 'жрать', 'хавать', 'обжираться']],
            ['чай', ['чаек', 'чаепитие', 'напиток', 'заварка']],
            ['кофе', ['кофеек', 'эспресс', 'капучино', 'латте', 'американо']],
            ['пиво', ['пивко', 'пивас', 'beer', 'бухло', 'алкоголь']],
            ['водка', ['беленькая', 'горькая', 'алкашка']],
            ['пицца', ['pizza', 'пиццерия']],
            ['мясо', ['стейк', 'шашлык', 'барбекю', 'колбаса']],
            ['сладкое', ['торт', 'конфеты', 'шоколад', 'мороженое', 'печенье']],

            // Работа и учеба
            ['работа', ['работать', 'job', 'офис', 'трудиться', 'пахать', 'вкалывать']],
            ['учеба', ['учиться', 'школа', 'универ', 'экзамен', 'зачет']],
            ['деньги', ['бабки', 'баблос', 'зарплата', 'кэш', 'лавэ', 'капуста']],
            ['босс', ['начальник', 'шеф', 'руководитель']],

            // Время и даты
            ['утро', ['утром', 'рассвет', 'подъем']],
            ['день', ['днем', 'обед', 'полдень']],
            ['вечер', ['вечером', 'закат', 'ужин']],
            ['ночь', ['ночью', 'спать', 'сон', 'кровать']],
            ['понедельник', ['пн', 'monday', 'начало недели']],
            ['пятница', ['пт', 'friday', 'конец', 'выходные']],
            ['выходные', ['суббота', 'воскресенье', 'отдых', 'weekend']],

            // Погода
            ['дождь', ['дождик', 'ливень', 'мокро', 'зонт']],
            ['снег', ['снежок', 'зима', 'холодно', 'мороз']],
            ['солнце', ['солнышко', 'жара', 'лето', 'тепло']],
            ['ветер', ['ветерок', 'дует', 'прохладно']],

            // Транспорт
            ['машина', ['авто', 'тачка', 'car', 'автомобиль']],
            ['автобус', ['bus', 'маршрутка', 'транспорт']],
            ['поезд', ['train', 'электричка', 'метро']],
            ['самолет', ['plane', 'лайнер', 'полет']],

            // Технологии
            ['телефон', ['phone', 'мобила', 'смартфон', 'айфон']],
            ['компьютер', ['computer', 'комп', 'ПК', 'ноутбук']],
            ['интернет', ['net', 'онлайн', 'сеть', 'wifi']],
            ['игры', ['game', 'геймер', 'играть', 'консоль']],

            // Здоровье
            ['болеть', ['болезнь', 'больной', 'температура', 'простуда']],
            ['врач', ['доктор', 'лечение', 'больница', 'поликлиника']],
            ['спорт', ['тренировка', 'фитнес', 'зал', 'качалка']],

            // Отношения
            ['друг', ['дружба', 'приятель', 'товарищ', 'братан', 'кореш']],
            ['девушка', ['подруга', 'girlfriend', 'баба', 'телка', 'чикса']],
            ['парень', ['boyfriend', 'мужик', 'пацан', 'чувак']],
            ['семья', ['родители', 'мама', 'папа', 'дети', 'родственники']],

            // Интернет-сленг
            ['лайк', ['like', 'нравится', 'плюс', 'апвот']],
            ['репост', ['repost', 'шара', 'поделиться']],
            ['мем', ['meme', 'мемас', 'мемчик', 'картинка']],
            ['тролль', ['троллинг', 'прикол', 'развод']],
            ['хейт', ['hate', 'ненависть', 'хейтер']],
            ['спам', ['флуд', 'навязывание', 'реклама']],

            // Повседневные дела
            ['спать', ['сон', 'спокойной ночи', 'храп', 'дрыхнуть', 'вырубиться']],
            ['есть', ['жрать', 'кушать', 'обедать', 'ужинать', 'завтракать']],
            ['гулять', ['прогулка', 'улица', 'воздух', 'парк']],
            ['дом', ['домой', 'квартира', 'хата', 'жилье']],
            ['покупки', ['магазин', 'шоппинг', 'торговый']],

            // Сленг
            ['крутой', ['кул', 'cool', 'топ', 'огонь', 'бомба']],
            ['отстой', ['фигня', 'дрянь', 'лажа', 'шлак']],
            ['тупить', ['тормозить', 'не понимать', 'глупить']],
            ['зависать', ['тусить', 'чилить', 'отдыхать']],
            ['базарить', ['говорить', 'болтать', 'трещать']],
        ];
        const semanticMap = new Map<string, string[]>();
        for (const [key, synonyms] of semanticPairs) {
            semanticMap.set(key, synonyms);
            for (const synonym of synonyms) {
                const relatedWords = synonyms.filter(s => s !== synonym);
                relatedWords.push(key);
                semanticMap.set(synonym, relatedWords);
            }
        }
        return semanticMap;
    }
}

let filterInstance: OptimizedStickerFilter | null = null;

export function smartStickerSearch(
    stickers: PhotoSticker[],
    userMessage: string
): PhotoSticker[] {
    if (!filterInstance) {
        filterInstance = new OptimizedStickerFilter();
    }

    const normalizedMessage = userMessage.toLowerCase().trim();
    if (!shouldSearchStickers(normalizedMessage)) {
        return [];
    }

    const searchQuery = extractSearchKeywords(normalizedMessage);
    if (!searchQuery) {
        return [];
    }

    const queryWords = searchQuery.trim().split(/\s+/);
    // Если запрос — одна буква, возвращаем пустой результат
    if (queryWords.length === 1 && queryWords[0].length === 1) {
        return [];
    }

    const originalWordCount = userMessage.trim().split(/\s+/).length;
    const minScore = originalWordCount > 3 ? 0.5 : 0.2;

    const results = filterInstance.searchStickers(stickers, searchQuery, {
        enableSemantic: true,
        boostExactMatches: 2.5,
        boostStartsWith: 1.8,
        maxResults: 50,
        minScore
    });

    return results.map(result => result.sticker);
}

export function initializeStickerSearch(stickers: PhotoSticker[]): void {
    if (!filterInstance) {
        filterInstance = new OptimizedStickerFilter();
    }
    filterInstance.buildIndex(stickers);
}

function shouldSearchStickers(message: string): boolean {
    const normalizedMessage = message.trim();
    if (normalizedMessage.length < 1 || normalizedMessage.length > 50) return false;
    if (normalizedMessage.startsWith('/') || normalizedMessage.includes('http')) return false;
    if (/^\d+$/.test(normalizedMessage)) return false;
    const wordCount = normalizedMessage.split(/\s+/).length;
    return wordCount <= 3;

}

function extractSearchKeywords(message: string): string {
    let cleaned = message
        .replace(/[^\w\s\u0400-\u04FF]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    if (!cleaned) return message.trim();

    const words = cleaned.split(' ').filter(word => word.length > 0);
    const stopWords = new Set(['я', 'ты', 'он', 'она', 'и', 'а', 'но', 'что', 'как', 'в', 'на']);
    const meaningfulWords = words.filter(word => !stopWords.has(word));

    return meaningfulWords.length === 0 ? cleaned : meaningfulWords.join(' ');
}