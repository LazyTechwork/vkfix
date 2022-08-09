export function lastOrDefault<T, D = undefined>(
  array: Array<T> | undefined,
  _default = undefined,
) {
  if (!array || array.length === 0) {
    return _default as never as D;
  }

  return array[array.length - 1];
}
