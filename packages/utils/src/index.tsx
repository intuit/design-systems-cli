import * as React from 'react';

export * from './utils/arrayify';
export * from './utils/omit';
export * from './utils/getProp';
export * from './utils/displayName';
export * from './utils/focus-lock';
export * from './utils/isReactInstanceOf';
export * from './utils/styled';
export * from './utils/portal';
export * from './utils/createInstanceIfDefined';
export * from './utils/createSlots';
export * from './utils/debounce';
export * from './utils/fromEntries';
export * from './utils/logger';

/* Utility Types */

/** Mark some keys of an interface as required
 *
 * @property T - interface to augment
 * @property K - keys to convert to required
 *
 * @example
 * type Example = { foo?: string; bar?: string };
 * type WithFooRequired = Require<Example, 'foo'>;
 */
export declare type Require<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Get all of the props for an HTML element. Used to easily type
 * the rest props of a component.
 *
 * @property T - element to extend
 *
 * @example
 * interface CardProps extends Element<'div'> {
 *   isRound?: boolean;
 * }
 *
 * const Card: React.FC<CardProps> = ({ isRound, children, ...html }) => (
 *  <div {...html} style={{ borderRadius: isRound ? '4px' : 0 }}>
 *    {children}
 *  </div>
 * )
 * @example
 * const Card: React.FC<Element<'div'>> = ({ children, ...html }) => (
 *  <div {...html}>
 *    {children}
 *  </div>
 * )
 */
export type Element<
  T extends keyof JSX.IntrinsicElements
> = React.PropsWithoutRef<JSX.IntrinsicElements[T]>;

/**
 * Create an interface that has all the properties of the input
 * interface set to 'never'.
 *
 * @property T - The input interface
 *
 * @example
 * type A = { a: string };
 * type B = { b: string };
 * type C = A & Never<B>;
 *
 * const test: C = {
 *   a: 'foo',
 *   b: 'bar' // <- This line will create an error
 * }
 */
export type Never<T> = { [P in keyof T]?: never };

/**
 * Create an interface that only accepts one of the two provided interface
 *
 * @example
 * type A = { a: string };
 * type B = { b: string };
 * type C = OneOf<A, B>;
 *
 * const test: C = {
 *   a: 'foo',
 *   b: 'bar', // <- This line will create an error
 * }
 */
export type OneOf<T1, T2> = (T1 & Never<T2>) | (T2 & Never<T1>);

/**
 * Create an interface that only accepts one of the three provided interface
 *
 * @example
 * type A = { a: string };
 * type B = { b: string };
 * type C = { c: string };
 * type D = OneOf<A, B, C>;
 *
 * const test: D = {
 *   a: 'foo',
 *   c: 'bar', // <- This line will create an error
 * }
 */
export type OneOf3<
  T1,
  T2,
  T3,
  NT1 = Never<T1>,
  NT2 = Never<T2>,
  NT3 = Never<T3>
> = (T1 & NT2 & NT3) | (T2 & NT1 & NT3) | (T3 & NT1 & NT2);
