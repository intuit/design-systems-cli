import * as React from 'react';

type Renderable<Props> =
  | React.ComponentType<Props>
  | {
      /** a function to render the component */
      render: React.ComponentType<Props>;
    };

/**
 * Determine whether a HTML element is an instance of a React component.
 *
 * @param element - Element to check the instance of
 * @param component - The component to check for
 *
 * @example
 * isReactInstanceOf(child, MyComponent)
 */
export function isReactInstanceOf<Props>(
  // IDK how to get rid of this any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  element: any,
  component: Renderable<Props>
) {
  const isComponent =
    element && element.type && typeof element.type !== 'string';

  // For functional types
  if (element && element.type === component) {
    return true;
  }

  const renderFn = 'render' in component ? component.render : component;

  return (
    isComponent &&
    element.type.prototype &&
    renderFn.prototype &&
    element.type.prototype instanceof renderFn
  );
}
