import * as React from 'react';
import makeClass from 'clsx';
import { arrayify } from './arrayify';

import { Element } from '..';

export interface DocGen {
  /** The generated docs for the react component */
  __docgenInfo?: {
    /** A description for the component */
    description: string | undefined;
  };
}

export interface Slotted {
  /** The slot the styled element should render in */
  _SLOT_: symbol;
}

interface WrappedComponent {
  /** A className to attach to the root component */
  class?: string;
  /** The name to set as the display name for the component */
  name: string;
  /** A description for documentation tools */
  description?: string;
  /** The slot the styled element should render in */
  slot?: symbol;
}

/**
 * Create a react element with a className attached. The generated element accepts
 * all the same props as the element prop.
 *
 * @param element - The html dom element to create a Component for
 * @param options - The class an metadata to attach to the Component
 *
 * @example
 *
 * const Wrapper = styled('div', {
 *   class: styles.fancy,
 *   description: 'A fancy component',
 *   name: 'FancyWrapper'
 * });
 *
 * const Example = ({ children, ...html }) => {
 *   <Wrapper {...html}>
 *     {children}
 *   </Wrapper>
 * }
 */
export function styled<T extends keyof JSX.IntrinsicElements>(
  element: T | [T, ...((props: any) => React.ReactNode)[]],
  options: string | WrappedComponent
) {
  const defaultDescription = `This component accepts all HTML attributes for a "${element}" element.`;
  const { class: className, description, name, slot } =
    typeof options === 'string'
      ? ({ class: options } as WrappedComponent)
      : options;

  type Props = Element<T> & {
    /** A component to render as instead of a 'div' */
    as?: React.ElementType;
  };

  type WithRef = React.ForwardRefExoticComponent<
    React.PropsWithoutRef<Props> & React.RefAttributes<HTMLElement>
  >;

  const elements = arrayify(element) as [
    T,
    ...((props: unknown) => JSX.Element)[]
  ];

  const ElementsReduced = [
    ...elements
  ].reduce((Accumulator: any, CurrentValue: any) => (asProps: unknown) => (
    <CurrentValue {...asProps} as={Accumulator} />
  )) as any;

  /** The result "styled" component. */
  const Wrapped = React.forwardRef<HTMLElement, Props>((props, ref) => {
    const { as, ...rest } = props;

    /* If more then one component comes reduce into one component */
    const Component = as || ElementsReduced;

    return (
      <Component
        ref={ref}
        {...rest}
        className={makeClass(className, (props as any).className)}
      />
    );
  }) as DocGen & Slotted & WithRef;

  // eslint-disable-next-line no-underscore-dangle
  Wrapped._SLOT_ = slot || Symbol(elements[0]);
  Wrapped.displayName = name;
  // eslint-disable-next-line no-underscore-dangle
  Wrapped.__docgenInfo = {
    description: description
      ? `${description} ${defaultDescription}`
      : defaultDescription
  };

  return Wrapped;
}
