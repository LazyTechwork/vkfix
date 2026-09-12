/**
 * Префиксный индекс над отсортированным словарём терминов
 *
 * Заменяет прежний псевдо-индекс, который хранил обрезки слов длиной 3, 4 и 5
 * символов: из-за него запрос «привет» опознавался только как «при» и не мог
 * дотянуться до «приветствие». Здесь слово ищется целиком — любой длины.
 *
 * Термины отсортированы, поэтому все слова с общим префиксом лежат подряд:
 * находим бинарным поиском начало диапазона и идём по нему, пока префикс
 * совпадает.
 */
export class PrefixIndex {
  private readonly sortedTerms: string[];

  constructor(terms: Iterable<string>) {
    this.sortedTerms = [...new Set(terms)].sort();
  }

  /** Все термины словаря (нужны fuzzy-поиску) */
  get terms(): readonly string[] {
    return this.sortedTerms;
  }

  /**
   * Термины, начинающиеся с префикса.
   * Сам префикс, если он есть в словаре, тоже попадает в результат.
   */
  findByPrefix(prefix: string): string[] {
    const result: string[] = [];

    for (let i = this.lowerBound(prefix); i < this.sortedTerms.length; i++) {
      if (!this.sortedTerms[i].startsWith(prefix)) {
        break;
      }

      result.push(this.sortedTerms[i]);
    }

    return result;
  }

  /**
   * Термины с достаточно длинным общим началом со словом.
   *
   * Ловит случаи, где ни одно слово не является префиксом другого:
   * «приветик» и «приветствие» расходятся после «привет». В отсортированном
   * словаре такие слова стоят рядом с местом вставки, а длина общего начала
   * убывает по мере удаления от него — поэтому идём в обе стороны и
   * останавливаемся, как только общее начало стало слишком коротким.
   *
   * @param minLength минимальная длина общего начала, иначе совпадение шумное
   */
  findByCommonPrefix(word: string, minLength: number): Array<{ term: string; length: number }> {
    const insertAt = this.lowerBound(word);
    const result: Array<{ term: string; length: number }> = [];

    for (let i = insertAt - 1; i >= 0; i--) {
      const length = commonPrefixLength(word, this.sortedTerms[i]);
      if (length < minLength) {
        break;
      }

      result.push({ term: this.sortedTerms[i], length });
    }

    for (let i = insertAt; i < this.sortedTerms.length; i++) {
      const length = commonPrefixLength(word, this.sortedTerms[i]);
      if (length < minLength) {
        break;
      }

      result.push({ term: this.sortedTerms[i], length });
    }

    return result;
  }

  /**
   * Индекс первого термина, который не меньше слова
   */
  private lowerBound(word: string): number {
    let low = 0;
    let high = this.sortedTerms.length;

    while (low < high) {
      const middle = (low + high) >>> 1;

      if (this.sortedTerms[middle] < word) {
        low = middle + 1;
      } else {
        high = middle;
      }
    }

    return low;
  }
}

/**
 * Длина общего начала двух слов
 */
function commonPrefixLength(a: string, b: string): number {
  const max = Math.min(a.length, b.length);
  let length = 0;

  while (length < max && a[length] === b[length]) {
    length++;
  }

  return length;
}
