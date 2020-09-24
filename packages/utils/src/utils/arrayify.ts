/**
 * Normalize a value to an array.
 * 
 * @param value - The value to potentially convert to an array
 *
 * @example
 * arrayify('a') // = ['a']
 * arrayify(['a']) // = ['a']
 */
export const arrayify = <T>(value: T | T[]) =>
  Array.isArray(value) ? value : [value];
