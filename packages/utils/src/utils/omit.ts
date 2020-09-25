import { fromEntries } from './fromEntries';

/**
 * Omit keys from a type.
 *
 * @example
 * Omit<{foo: string, bar: string}, 'foo'>
 * // = { bar: string }
 */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Omit keys from an object.
 *
 * @param obj - The object to omit props from
 * @param keys - A list of keys to omit
 *
 * @example Here is a simple example
 * ```ts
 * const result = omit({ foo: 'a', bar: 'b' }, 'foo')
 * // result = { bar: 'b' }
 * ```
 *
 * @example Here is a another example
 * ```ts
 * const result = omit({ baz: 'a', bar: 'b' }, 'baz')
 * // result = { bar: 'b' }
 * ```
 */
export const omit = <Props, Prop extends keyof Props>(
  obj: Props,
  keys: Prop[]
) =>
  fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key as Prop))
  ) as Omit<Props, Prop>;
