/**
 * Fuzzy Matcher - поиск с учетом опечаток
 * Использует расстояние Левенштейна
 */
export class FuzzyMatcher {
  /**
   * Вычисляет расстояние Дамерау-Левенштейна между двумя строками
   * (учитывает транспозицию соседних символов как одну операцию)
   */
  calculateLevenshteinDistance(a: string, b: string): number {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const len1 = a.length;
    const len2 = b.length;
    const maxDist = len1 + len2;
    
    // Создаем матрицу H
    const H: number[][] = [];
    for (let i = 0; i <= len1 + 1; i++) {
      H[i] = [];
      for (let j = 0; j <= len2 + 1; j++) {
        H[i][j] = 0;
      }
    }
    
    H[0][0] = maxDist;
    
    for (let i = 0; i <= len1; i++) {
      H[i + 1][0] = maxDist;
      H[i + 1][1] = i;
    }
    
    for (let j = 0; j <= len2; j++) {
      H[0][j + 1] = maxDist;
      H[1][j + 1] = j;
    }
    
    const da: Map<string, number> = new Map();
    
    for (let i = 1; i <= len1; i++) {
      let db = 0;
      for (let j = 1; j <= len2; j++) {
        const k = da.get(b[j - 1]) || 0;
        const l = db;
        let cost = 1;
        
        if (a[i - 1] === b[j - 1]) {
          cost = 0;
          db = j;
        }
        
        H[i + 1][j + 1] = Math.min(
          H[i][j] + cost,           // замена
          H[i + 1][j] + 1,          // вставка
          H[i][j + 1] + 1,          // удаление
          H[k][l] + (i - k - 1) + 1 + (j - l - 1) // транспозиция
        );
      }
      
      da.set(a[i - 1], i);
    }
    
    return H[len1 + 1][len2 + 1];
  }

  /**
   * Находит похожие слова в словаре
   */
  findSimilarWords(
    query: string,
    dictionary: readonly string[],
    maxDistance: number
  ): Array<{ word: string; distance: number }> {
    const results: Array<{ word: string; distance: number }> = [];

    for (const word of dictionary) {
      // Оптимизация: если разница в длине больше maxDistance, пропускаем
      if (Math.abs(word.length - query.length) > maxDistance) {
        continue;
      }

      const distance = this.calculateLevenshteinDistance(query, word);
      if (distance <= maxDistance) {
        results.push({ word, distance });
      }
    }

    // Сортируем по расстоянию (меньше = лучше)
    return results.sort((a, b) => a.distance - b.distance);
  }

  /**
   * Определяет максимально допустимое расстояние для слова
   * Логика: чем длиннее слово, тем больше допустимых опечаток
   * 
   * @param wordLength - длина слова
   * @returns максимальное расстояние Левенштейна
   * 
   * Примеры:
   * - "кот" (3 буквы) → maxDistance = 1 → "кто", "кон" ✅
   * - "собака" (6 букв) → maxDistance = 1 → "сабака", "собаки" ✅
   * - "приветствую" (12 букв) → maxDistance = 2 → "превитствую" ✅
   */
  getMaxDistance(wordLength: number): number {
    if (wordLength <= 2) return 0; // Очень короткие слова - без опечаток
    if (wordLength <= 4) return 1; // Короткие слова (3-4 буквы) - 1 опечатка
    if (wordLength <= 7) return 1; // Средние слова (5-7 букв) - 1 опечатка
    if (wordLength <= 10) return 2; // Длинные слова (8-10 букв) - 2 опечатки
    return 3; // Очень длинные слова (11+ букв) - 3 опечатки
  }

  /**
   * Вычисляет score для fuzzy совпадения
   */
  calculateFuzzyScore(distance: number, wordLength: number): number {
    if (distance === 0) return 1.0;
    
    // Чем больше расстояние, тем меньше score
    // Для коротких слов штраф больше
    const penalty = distance / wordLength;
    return Math.max(0, 1.0 - penalty);
  }
}
