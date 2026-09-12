/**
 * Лёгкий стеммер русского языка (усечение окончаний)
 *
 * Правила взяты из алгоритма Snowball для русского языка в упрощённом виде:
 * без выделения областей R2/RV, но с сохранением ключевого условия —
 * окончания первой группы отсекаются только после «а» или «я».
 * Именно это условие не даёт испортить существительные:
 * «привет» остаётся «привет», а не превращается в «прив».
 *
 * Нужен для случаев, которые не решаются префиксным поиском:
 * «работе» → «работ» находит «работаю», «приветствую» → «приветств»
 * находит «приветствие». Префикс работает, когда запрос — начало слова,
 * стем — когда слова расходятся в окончании.
 */

/** Минимальная длина основы: короче резать нельзя, получится мусор */
const MIN_STEM_LENGTH = 3;

/** Минимальная длина слова, которое имеет смысл стеммить */
const MIN_WORD_LENGTH = 4;

/** Слово целиком из кириллицы */
const CYRILLIC_WORD = /^[а-яё]+$/;

/** Гласные — по ним доводим основу до согласной */
const VOWEL = /[аеёиоуыэюя]/;

/** Деепричастия, отсекаются только после «а»/«я» */
const GERUND_GROUP_1 = ['вшись', 'вши', 'в'];

/** Деепричастия, отсекаются безусловно */
const GERUND_GROUP_2 = ['ившись', 'ывшись', 'ивши', 'ывши', 'ив', 'ыв'];

/** Возвратные частицы */
const REFLEXIVE = ['ся', 'сь'];

/** Прилагательные */
const ADJECTIVE = [
  'ыми', 'ими', 'его', 'ому', 'ого', 'ему', 'ее', 'ие', 'ые', 'ое', 'ей', 'ий',
  'ый', 'ой', 'ем', 'им', 'ым', 'ом', 'их', 'ых', 'ую', 'юю', 'ая', 'яя', 'ою', 'ею'
];

/** Причастия после прилагательного окончания, только после «а»/«я» */
const PARTICIPLE_GROUP_1 = ['ющ', 'нн', 'вш', 'ем', 'щ'];

/** Причастия после прилагательного окончания, безусловно */
const PARTICIPLE_GROUP_2 = ['ивш', 'ывш', 'ующ'];

/** Глаголы, отсекаются только после «а»/«я» */
const VERB_GROUP_1 = [
  'нно', 'ете', 'йте', 'ешь', 'ла', 'на', 'ли', 'ем', 'ло', 'но', 'ет', 'ют',
  'ны', 'ть', 'й', 'л', 'н'
];

/** Глаголы, отсекаются безусловно */
const VERB_GROUP_2 = [
  'ейте', 'уйте', 'ила', 'ыла', 'ена', 'ите', 'или', 'ыли', 'ило', 'ыло', 'ено',
  'ует', 'уют', 'ить', 'ыть', 'ишь', 'ены', 'ей', 'уй', 'ил', 'ыл', 'им', 'ым',
  'ен', 'ят', 'ит', 'ыт', 'ую', 'ю'
];

/** Существительные */
const NOUN = [
  'иями', 'ями', 'ами', 'ией', 'иям', 'ием', 'иях', 'ев', 'ов', 'ие', 'ье',
  'еи', 'ии', 'ей', 'ой', 'ий', 'ям', 'ем', 'ам', 'ом', 'ах', 'ях', 'ию',
  'ью', 'ия', 'ья', 'а', 'е', 'и', 'й', 'о', 'у', 'ы', 'ь', 'ю', 'я'
];

/**
 * Возвращает основу слова.
 * Не-кириллица и короткие слова возвращаются без изменений.
 */
export function stemWord(word: string): string {
  if (word.length < MIN_WORD_LENGTH || !CYRILLIC_WORD.test(word)) {
    return word;
  }

  const normalized = word.replaceAll('ё', 'е');

  // Деепричастие поглощает слово целиком — дальше ничего не отсекаем
  const gerund = cutEnding(normalized, GERUND_GROUP_2) ?? cutGroupOne(normalized, GERUND_GROUP_1);
  if (gerund !== null) {
    return gerund;
  }

  const base = cutEnding(normalized, REFLEXIVE) ?? normalized;

  const stem = cutAdjectival(base)
    ?? cutEnding(base, VERB_GROUP_2)
    ?? cutGroupOne(base, VERB_GROUP_1)
    ?? cutEnding(base, NOUN)
    ?? base;

  return cutTrailingVowel(stem);
}

/**
 * Убирает гласную на конце основы.
 *
 * Snowball оставляет разные основы у форм одного слова: «работаю» → «работа»,
 * но «работе» → «работ». Для поиска важно, чтобы формы сходились в один ключ,
 * поэтому доводим основу до согласной.
 */
function cutTrailingVowel(stem: string): string {
  if (stem.length - 1 < MIN_STEM_LENGTH || !VOWEL.test(stem.at(-1)!)) {
    return stem;
  }

  return stem.slice(0, -1);
}

/**
 * Отсекает окончание прилагательного вместе с причастным суффиксом,
 * если он есть: «читающего» → «чита»
 */
function cutAdjectival(word: string): string | null {
  const withoutAdjective = cutEnding(word, ADJECTIVE);
  if (withoutAdjective === null) {
    return null;
  }

  return cutEnding(withoutAdjective, PARTICIPLE_GROUP_2)
    ?? cutGroupOne(withoutAdjective, PARTICIPLE_GROUP_1)
    ?? withoutAdjective;
}

/**
 * Отсекает самое длинное подходящее окончание.
 * Возвращает null, если ни одно не подошло или основа стала слишком короткой.
 */
function cutEnding(word: string, endings: string[]): string | null {
  let longest: string | null = null;

  for (const ending of endings) {
    if (!word.endsWith(ending) || word.length - ending.length < MIN_STEM_LENGTH) {
      continue;
    }

    if (longest === null || ending.length > longest.length) {
      longest = ending;
    }
  }

  return longest === null ? null : word.slice(0, -longest.length);
}

/**
 * Отсекает окончание первой группы — только если перед ним стоит «а» или «я».
 * Это условие не даёт срезать глагольные окончания с существительных.
 */
function cutGroupOne(word: string, endings: string[]): string | null {
  for (const ending of [...endings].sort((a, b) => b.length - a.length)) {
    if (!word.endsWith(ending)) {
      continue;
    }

    const stem = word.slice(0, -ending.length);
    if (stem.length >= MIN_STEM_LENGTH && (stem.endsWith('а') || stem.endsWith('я'))) {
      return stem;
    }
  }

  return null;
}
