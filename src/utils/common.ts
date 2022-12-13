/**
 * Clones an object.
 *
 * @template T
 * @param {T} obj The object.
 * @return {T} The clone.
 */
export function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Determines whether the given value is numeric.
 *
 * @param {*} value The value.
 * @return {boolean} A value indicating whether the value is numeric.
 */
export function isNumeric(value: any): boolean {
  if (Array.isArray(value)) {
    return false;
  }

  value = "" + value;
  return !isNaN(value) && !isNaN(parseFloat(value));
}

/**
 * Determines whether the given value is an array.
 *
 * @param {*} value The value.
 * @return {boolean} A value indicating whether the value is an array.
 */
export function isArray(value: any): boolean {
  return Array.isArray(value);
}

/**
 * Memoizes a function
 *
 * @param {any} func The function.
 * @return {any} The memoized function.
 */
export function memoize<T>(func: (...args: any[]) => T): (...args: any[]) => T {
  const lookup = new Map<string, any>();

  return function () {
    const key = [...arguments].map((x) => String(x)).join("|");

    if (lookup.has(key)) {
      return lookup.get(key);
    }

    const result = func(...arguments);

    lookup.set(key, result);

    return result;
  };
}
