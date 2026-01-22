# Документация модуля VK Photo Sticker

## Обзор

Модуль VK Photo Sticker предоставляет систему всплывающих подсказок с фото-стикерами в мессенджере ВКонтакте. При вводе текста в поле сообщения система автоматически предлагает релевантные фото-стикеры из указанных альбомов пользователя.

## Архитектура

### Основные компоненты

1. **messenger.ts** - главный модуль, управляющий логикой отображения стикеров
2. **VPhotoStickersPopup.vue** - компонент всплывающего окна со списком стикеров
3. **VPhotoSticker.vue** - компонент отдельного стикера
4. **AdvancedStickerFilter.ts** - система фильтрации и поиска стикеров
5. **PhotoCache.ts** - кэширование загруженных фото
6. **types.ts** - TypeScript типы

### Поток данных

```
Ввод текста → Debounce (200ms) → Фильтрация → Отображение подсказок → Отправка стикера
```

## Система всплывающих подсказок

### Механизм работы

1. **Инициализация**
   - Загрузка фото из указанных альбомов через VK API
   - Парсинг описаний фото для извлечения подсказок (текст в кавычках)
   - Построение поискового индекса
   - Кэширование данных в localStorage

2. **Отслеживание ввода**
   - Слушатель события `keydown` на поле ввода
   - Debounce 200ms для предотвращения избыточных вычислений
   - Игнорирование служебных клавиш (Shift, Enter, Escape)

3. **Отображение подсказок**
   - Всплывающее окно появляется над полем ввода
   - Горизонтальная прокрутка для просмотра всех вариантов
   - Максимум 50 стикеров (настраивается)
   - Анимация появления/исчезновения

4. **Скрытие подсказок**
   - При нажатии Enter или Escape
   - При потере фокуса полем ввода
   - При редактировании существующего сообщения
   - При пустом поле ввода

### Условия показа подсказок

Подсказки **НЕ** отображаются если:
- Текст пустой
- Пользователь редактирует существующее сообщение (`.ConvoComposer__editing`)
- Длина сообщения > 50 символов
- Сообщение начинается с `/` (команда)
- Сообщение содержит `http` (ссылка)
- Сообщение состоит только из цифр
- Количество слов > 3
- Запрос состоит из одной буквы

## Система фильтрации стикеров

### Структура данных PhotoSticker

```typescript
interface PhotoSticker {
    photo: Photo;              // Объект фото из VK API
    suggestions: string[];     // Подсказки из описания (в кавычках)
    lowerSuggestions: string[]; // Подсказки в нижнем регистре
    lowerWords: string[];      // Все слова из подсказок в нижнем регистре
}
```

### Поисковый индекс

Система использует предварительно построенные индексы для быстрого поиска:

```typescript
interface SearchIndex {
    exactWords: Map<string, PhotoSticker[]>;        // Точные совпадения слов
    exactSuggestions: Map<string, PhotoSticker[]>;  // Точные совпадения подсказок
    partialWords: Map<string, PhotoSticker[]>;      // Префиксы (от 2 символов)
    semanticMap: Map<string, Set<string>>;          // Семантические связи (синонимы)
}
```

### Алгоритм поиска

Поиск выполняется в несколько этапов с накоплением баллов релевантности:

#### 1. Точные совпадения (приоритет: высокий)
- Поиск полного совпадения слова в `lowerWords`
- Поиск полного совпадения в `lowerSuggestions`
- Бонус: **×2.5** к базовому баллу

#### 2. Частичные совпадения (приоритет: средний)
- Активируется если найдено мало результатов
- Поиск по префиксам длиной 3-6 символов
- Бонус: **0.6 × (длина_префикса / длина_слова)**
- **НЕ** применяется для запросов из одной буквы

#### 3. Семантический поиск (приоритет: низкий)
- Активируется если включен `enableSemantic` и мало результатов
- Поиск синонимов через `semanticMap`
- Бонус: **0.7** к базовому баллу
- **НЕ** применяется для запросов из одной буквы

#### 4. Расчет финального балла

```
finalScore = baseScore × (0.5 + matchRatio × 0.5)

где matchRatio = количество_совпавших_слов / количество_слов_в_запросе
```

### Параметры фильтрации

```typescript
interface SearchOptions {
    enableSemantic: boolean;    // Включить семантический поиск (по умолчанию: true)
    boostExactMatches: number;  // Множитель для точных совпадений (по умолчанию: 2.5)
    boostStartsWith: number;    // Множитель для префиксов (по умолчанию: 1.8)
    maxResults: number;         // Максимум результатов (по умолчанию: 50)
    minScore: number;           // Минимальный порог релевантности (по умолчанию: 0.2)
}
```

### Семантическая карта

Система содержит ~100 групп синонимов для русского языка:

- **Животные**: кот, котик, кошка, киса, мурка...
- **Эмоции**: смех, хах, лол, кек, ржака...
- **Еда**: чай, кофе, пиво, пицца...
- **Мат**: бля, хуй, пизда, ебать, сука... (для реалистичного поиска)
- **Сленг**: крутой, кул, топ, огонь...
- И другие категории

### Переключение раскладки

Если поиск не дал результатов, система автоматически пробует переключить раскладку клавиатуры:
- `ghbdtn` → `привет`
- `hello` → `руддщ`

---

## 🔴 ПРОБЛЕМЫ ТЕКУЩЕЙ РЕАЛИЗАЦИИ (Нейросплоп)

### 1. Монолитная архитектура класса OptimizedStickerFilter

**Проблема**: Класс на 500+ строк выполняет слишком много обязанностей:
- Построение индексов
- Поиск по разным стратегиям
- Расчет релевантности
- Семантический анализ
- Нормализация текста

**Последствия**:
- Сложность тестирования
- Невозможность переиспользования компонентов
- Высокая связанность кода

### 2. Хардкод семантической карты

**Проблема**: 
- 100+ групп синонимов захардкожены в методе `buildSemanticMap()`
- Невозможно обновить без изменения кода
- Нет возможности пользовательской настройки
- Отсутствует версионирование

**Последствия**:
- Сложность поддержки и расширения
- Невозможность A/B тестирования разных наборов
- Нет возможности загрузки из внешнего источника

### 3. Магические числа повсюду

**Проблема**: Множество необъяснимых констант:
```typescript
boostExactMatches: 2.5      // Почему 2.5?
boostStartsWith: 1.8        // Почему 1.8?
minScore: 0.2               // Почему 0.2?
maxResults: 50              // Почему 50?
finalScore = baseScore × (0.5 + matchRatio × 0.5)  // Откуда 0.5?
```

**Последствия**:
- Невозможно понять логику без глубокого анализа
- Сложность настройки и оптимизации
- Риск регрессии при изменениях

### 4. Неэффективное построение индекса префиксов

**Проблема**:
```typescript
for (let i = 2; i <= word.length; i++) {
    const prefix = word.substring(0, i);
    // Создается префикс для КАЖДОЙ длины
}
```

Для слова "привет" (6 букв) создается 5 префиксов: пр, при, прив, приве, привет

**Последствия**:
- Избыточное потребление памяти
- Медленная инициализация
- Дублирование данных

### 5. Отсутствие приоритизации по контексту

**Проблема**: Система не учитывает:
- Частоту использования стикеров
- Время суток
- Контекст диалога
- Историю выбора пользователя

**Последствия**:
- Неоптимальная релевантность
- Одинаковые результаты для разных пользователей

### 6. Слабая обработка опечаток

**Проблема**: 
- Нет fuzzy matching (расстояние Левенштейна)
- Переключение раскладки работает только для полного текста
- Не обрабатываются транслитерация и смешанные раскладки

**Последствия**:
- Пользователь не находит стикер при опечатке
- Плохой UX

### 7. Неоптимальная работа с памятью

**Проблема**:
- Индекс строится один раз и хранится в памяти
- Нет механизма очистки неиспользуемых данных
- Дублирование стикеров в разных индексах

**Последствия**:
- Высокое потребление памяти
- Возможные утечки памяти

### 8. Отсутствие метрик и аналитики

**Проблема**:
- Нет логирования качества поиска
- Нет метрик времени выполнения
- Невозможно оценить эффективность алгоритма

**Последствия**:
- Невозможность data-driven оптимизации
- Нет понимания реального поведения пользователей

### 9. Хрупкая логика фильтрации в messenger.ts

**Проблема**: Условия показа стикеров разбросаны по коду:
```typescript
if (text === '' || !composerInputInput.value) { ... }
if (getConvoComposerEditing()) { ... }
if (queryWords.length === 1 && queryWords[0].length === 1) { ... }
```

**Последствия**:
- Сложность понимания всех правил
- Риск конфликтов между условиями
- Дублирование логики

### 10. Отсутствие тестов

**Проблема**: 
- Нет unit-тестов для алгоритмов поиска
- Нет интеграционных тестов
- Нет тестов производительности

**Последствия**:
- Высокий риск регрессии
- Невозможность безопасного рефакторинга
- Неизвестная производительность на больших данных

---

## 📋 ПЛАН ПЕРЕПИСЫВАНИЯ СИСТЕМЫ ФИЛЬТРАЦИИ

### Фаза 1: Рефакторинг архитектуры (Приоритет: ВЫСОКИЙ)

#### 1.1. Разделение ответственности

Разбить `OptimizedStickerFilter` на отдельные модули:

```typescript
// Построение индексов
class StickerIndexBuilder {
    buildExactWordIndex(stickers: PhotoSticker[]): Map<string, PhotoSticker[]>
    buildPrefixIndex(stickers: PhotoSticker[]): Map<string, PhotoSticker[]>
    buildSemanticIndex(semanticMap: SemanticMap): Map<string, Set<string>>
}

// Стратегии поиска
interface SearchStrategy {
    search(query: string, index: SearchIndex): SearchResult[]
}

class ExactMatchStrategy implements SearchStrategy { }
class PrefixMatchStrategy implements SearchStrategy { }
class SemanticMatchStrategy implements SearchStrategy { }
class FuzzyMatchStrategy implements SearchStrategy { } // НОВОЕ

// Расчет релевантности
class RelevanceScorer {
    calculateScore(matches: MatchDetails[], options: ScoringOptions): number
    applyBoosts(score: number, matchType: MatchType): number
}

// Главный координатор
class StickerSearchEngine {
    constructor(
        private indexBuilder: StickerIndexBuilder,
        private strategies: SearchStrategy[],
        private scorer: RelevanceScorer
    ) {}
    
    search(query: string, options: SearchOptions): PhotoSticker[]
}
```

**Преимущества**:
- Каждый класс отвечает за одну задачу (SRP)
- Легко тестировать изолированно
- Можно заменять стратегии без изменения основного кода

#### 1.2. Вынести конфигурацию

```typescript
// config/stickerSearchConfig.ts
export const SEARCH_CONFIG = {
    scoring: {
        exactMatch: 2.5,
        prefixMatch: 1.8,
        semanticMatch: 0.7,
        fuzzyMatch: 0.5,
        baseWeight: 0.5,
        matchRatioWeight: 0.5
    },
    limits: {
        maxResults: 50,
        minScore: 0.2,
        maxQueryWords: 5,
        minPrefixLength: 3,
        maxPrefixLength: 6
    },
    features: {
        enableSemantic: true,
        enableFuzzy: true,
        enableLayoutSwitch: true,
        enableContextual: false // НОВОЕ
    }
} as const;
```

**Преимущества**:
- Все магические числа в одном месте
- Легко экспериментировать с параметрами
- Можно загружать из внешнего источника

### Фаза 2: Оптимизация индексов (Приоритет: СРЕДНИЙ)

#### 2.1. Умное построение префиксов

Вместо всех префиксов создавать только значимые:

```typescript
class SmartPrefixIndexBuilder {
    // Создавать префиксы только для длин: 3, 4, 5
    // Для "привет": при, прив, приве (вместо 5 префиксов)
    buildOptimizedPrefixIndex(stickers: PhotoSticker[]): Map<string, PhotoSticker[]> {
        const significantLengths = [3, 4, 5];
        // ...
    }
}
```

**Экономия памяти**: ~40% для средних слов

#### 2.2. Дедупликация стикеров в индексах

```typescript
class DeduplicatedIndex {
    // Хранить только ID стикеров, а не полные объекты
    private wordToStickerIds: Map<string, Set<number>>;
    private stickerById: Map<number, PhotoSticker>;
}
```

**Экономия памяти**: ~60% при большом количестве стикеров

### Фаза 3: Внешняя семантическая карта (Приоритет: ВЫСОКИЙ)

#### 3.1. JSON-формат семантической карты

```json
// data/semantic-map.json
{
  "version": "1.0.0",
  "lastUpdated": "2026-01-22",
  "groups": [
    {
      "category": "animals",
      "synonyms": ["кот", "котик", "кошка", "киса"]
    },
    {
      "category": "emotions_positive",
      "synonyms": ["смех", "хах", "лол", "кек"]
    }
  ]
}
```

#### 3.2. Загрузчик семантической карты

```typescript
class SemanticMapLoader {
    async loadFromFile(path: string): Promise<SemanticMap>
    async loadFromUrl(url: string): Promise<SemanticMap>
    async loadFromCache(): Promise<SemanticMap | null>
    
    validateMap(map: any): boolean
    mergeWithDefaults(userMap: SemanticMap): SemanticMap
}
```

**Преимущества**:
- Обновление без изменения кода
- Пользовательские карты
- Версионирование и откат

### Фаза 4: Fuzzy matching (Приоритет: СРЕДНИЙ)

#### 4.1. Расстояние Левенштейна

```typescript
class FuzzyMatcher {
    // Для коротких слов (до 6 букв): допустимо 1 опечатка
    // Для длинных слов (7+ букв): допустимо 2 опечатки
    calculateLevenshteinDistance(a: string, b: string): number
    
    findSimilarWords(
        query: string, 
        dictionary: string[], 
        maxDistance: number
    ): Array<{word: string, distance: number}>
}
```

#### 4.2. Интеграция в поиск

```typescript
class FuzzyMatchStrategy implements SearchStrategy {
    search(query: string, index: SearchIndex): SearchResult[] {
        const results: SearchResult[] = [];
        
        for (const word of queryWords) {
            const similar = this.fuzzyMatcher.findSimilarWords(
                word, 
                Array.from(index.exactWords.keys()),
                word.length <= 6 ? 1 : 2
            );
            
            for (const {word: similarWord, distance} of similar) {
                const stickers = index.exactWords.get(similarWord);
                const score = 0.5 * (1 - distance / word.length);
                // ...
            }
        }
        
        return results;
    }
}
```

### Фаза 5: Контекстная релевантность (Приоритет: НИЗКИЙ)

#### 5.1. Сбор статистики использования

```typescript
interface StickerUsageStats {
    stickerId: number;
    useCount: number;
    lastUsed: Date;
    hourDistribution: number[]; // 24 элемента для каждого часа
    contextTags: string[]; // теги из диалога
}

class StickerAnalytics {
    trackStickerSent(sticker: PhotoSticker, context: MessageContext): void
    getStickerPopularity(stickerId: number): number
    getTimeBasedBoost(stickerId: number, currentHour: number): number
}
```

#### 5.2. Применение контекстных бустов

```typescript
class ContextualRelevanceBooster {
    applyBoosts(results: SearchResult[], context: SearchContext): SearchResult[] {
        return results.map(result => {
            let boost = 1.0;
            
            // Буст за частоту использования
            boost *= 1 + (result.sticker.useCount / 100) * 0.2;
            
            // Буст за время суток
            boost *= this.analytics.getTimeBasedBoost(
                result.sticker.photo.id, 
                new Date().getHours()
            );
            
            // Буст за недавнее использование
            if (this.wasUsedRecently(result.sticker, 24 * 60 * 60 * 1000)) {
                boost *= 1.3;
            }
            
            return {
                ...result,
                score: result.score * boost
            };
        });
    }
}
```

### Фаза 6: Правила фильтрации (Приоритет: ВЫСОКИЙ)

#### 6.1. Централизованные правила

```typescript
// Вместо разбросанных условий
class StickerDisplayRules {
    private rules: DisplayRule[] = [
        new EmptyTextRule(),
        new EditingMessageRule(),
        new SingleLetterRule(),
        new TooLongMessageRule(),
        new CommandRule(),
        new LinkRule(),
        new OnlyDigitsRule(),
        new TooManyWordsRule()
    ];
    
    shouldShowStickers(context: DisplayContext): RuleResult {
        for (const rule of this.rules) {
            const result = rule.evaluate(context);
            if (!result.passed) {
                return result; // Возвращаем причину отказа
            }
        }
        return { passed: true };
    }
}

interface DisplayRule {
    evaluate(context: DisplayContext): RuleResult;
}

class SingleLetterRule implements DisplayRule {
    evaluate(context: DisplayContext): RuleResult {
        const words = context.text.trim().split(/\s+/);
        if (words.length === 1 && words[0].length === 1) {
            return {
                passed: false,
                reason: 'Query is a single letter'
            };
        }
        return { passed: true };
    }
}
```

**Преимущества**:
- Все правила в одном месте
- Легко добавлять/удалять правила
- Понятная причина отказа (для отладки)

### Фаза 7: Тестирование (Приоритет: КРИТИЧЕСКИЙ)

#### 7.1. Unit-тесты

```typescript
// tests/StickerSearchEngine.test.ts
describe('StickerSearchEngine', () => {
    describe('ExactMatchStrategy', () => {
        it('should find exact word matches', () => {
            const stickers = createTestStickers([
                { words: ['кот', 'мяу'], suggestions: ['Кот мяукает'] }
            ]);
            const results = engine.search('кот', stickers);
            expect(results).toHaveLength(1);
            expect(results[0].score).toBeGreaterThan(2.0);
        });
        
        it('should not match single letter queries', () => {
            const results = engine.search('к', stickers);
            expect(results).toHaveLength(0);
        });
    });
    
    describe('FuzzyMatchStrategy', () => {
        it('should find words with 1 typo', () => {
            const results = engine.search('кто', stickers); // опечатка: кот
            expect(results).toHaveLength(1);
            expect(results[0].score).toBeLessThan(2.0);
        });
    });
});
```

#### 7.2. Интеграционные тесты

```typescript
// tests/integration/messenger.test.ts
describe('Messenger integration', () => {
    it('should show stickers on valid input', async () => {
        await typeInComposer('привет');
        await waitFor(() => {
            expect(getStickerPopup()).toBeVisible();
            expect(getDisplayedStickers()).toHaveLength.greaterThan(0);
        });
    });
    
    it('should hide stickers on Escape', async () => {
        await typeInComposer('привет');
        await pressKey('Escape');
        expect(getStickerPopup()).not.toBeVisible();
    });
});
```

#### 7.3. Performance тесты

```typescript
// tests/performance/search.bench.ts
describe('Search performance', () => {
    it('should search 1000 stickers in < 50ms', () => {
        const stickers = generateStickers(1000);
        const start = performance.now();
        engine.search('тест', stickers);
        const duration = performance.now() - start;
        expect(duration).toBeLessThan(50);
    });
    
    it('should build index for 1000 stickers in < 200ms', () => {
        const stickers = generateStickers(1000);
        const start = performance.now();
        indexBuilder.buildIndex(stickers);
        const duration = performance.now() - start;
        expect(duration).toBeLessThan(200);
    });
});
```

### Фаза 8: Мониторинг и аналитика (Приоритет: СРЕДНИЙ)

#### 8.1. Метрики поиска

```typescript
class SearchMetrics {
    trackSearch(query: string, resultsCount: number, duration: number): void {
        Logger.info('Search metrics', {
            query,
            resultsCount,
            duration,
            timestamp: Date.now()
        });
    }
    
    trackStickerClick(sticker: PhotoSticker, position: number, query: string): void {
        Logger.info('Sticker clicked', {
            stickerId: sticker.photo.id,
            position,
            query,
            timestamp: Date.now()
        });
    }
    
    getAverageSearchTime(): number { }
    getClickThroughRate(): number { }
    getMostPopularStickers(): PhotoSticker[] { }
}
```

#### 8.2. A/B тестирование

```typescript
class ABTestManager {
    // Тестирование разных параметров поиска
    getSearchConfig(userId: number): SearchConfig {
        const variant = this.getUserVariant(userId);
        
        switch (variant) {
            case 'A': // Контрольная группа
                return DEFAULT_CONFIG;
            case 'B': // Более агрессивный fuzzy matching
                return { ...DEFAULT_CONFIG, fuzzyMaxDistance: 2 };
            case 'C': // Без семантического поиска
                return { ...DEFAULT_CONFIG, enableSemantic: false };
        }
    }
}
```

---

## Приоритизация задач

### Критический приоритет (сделать в первую очередь)
1. ✅ Написать unit-тесты для текущего кода
2. ✅ Вынести конфигурацию (магические числа)
3. ✅ Централизовать правила фильтрации
4. ✅ Внешняя семантическая карта

### Высокий приоритет
5. ✅ Разделить OptimizedStickerFilter на модули
6. ✅ Оптимизировать построение индексов
7. ✅ Добавить fuzzy matching

### Средний приоритет
8. ⏳ Дедупликация данных в индексах
9. ⏳ Метрики и аналитика
10. ⏳ Performance тесты

### Низкий приоритет
11. ⏳ Контекстная релевантность
12. ⏳ A/B тестирование
13. ⏳ ML-модель для ранжирования (будущее)

---

## Ожидаемые результаты

После переписывания системы:

### Качество кода
- ✅ Модульная архитектура (легко тестировать и расширять)
- ✅ Покрытие тестами > 80%
- ✅ Нет магических чисел
- ✅ Понятная документация

### Производительность
- ✅ Поиск < 50ms для 1000 стикеров
- ✅ Построение индекса < 200ms
- ✅ Потребление памяти -50%

### Функциональность
- ✅ Обработка опечаток (fuzzy matching)
- ✅ Пользовательские семантические карты
- ✅ Контекстная релевантность
- ✅ Метрики качества поиска

### UX
- ✅ Более релевантные результаты
- ✅ Работа с опечатками
- ✅ Персонализация под пользователя
- ✅ Быстрый отклик (< 50ms)

---

## Заключение

Текущая реализация системы фильтрации стикеров работает, но имеет серьезные архитектурные проблемы, которые затрудняют поддержку, тестирование и расширение функциональности. 

Предложенный план переписывания решает эти проблемы через:
- Модульную архитектуру
- Внешнюю конфигурацию
- Комплексное тестирование
- Оптимизацию производительности
- Расширенные возможности поиска

Реализация плана займет ~2-3 недели работы одного разработчика при условии последовательного выполнения фаз.
