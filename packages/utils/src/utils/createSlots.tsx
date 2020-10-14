import * as React from 'react';
import { fromEntries } from './fromEntries';
import { isReactInstanceOf } from './isReactInstanceOf';
import { createInstanceIfDefined } from './createInstanceIfDefined';
import { arrayify } from './arrayify';

export const SLOT_KEY = '_SLOT_';

interface Props {
  // IDK how to get rid of this any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;
  /** Children to display within the component */
  children?: React.ReactNode;
}
type AnyComponent = React.ComponentType<any>;

interface ComponentMapStrict {
  // IDK how to get rid of this any
  [name: string]: AnyComponent[];
}

type SlotIdentifier = AnyComponent | AnyComponent[] | symbol;

interface ComponentMap {
  // IDK how to get rid of this any
  [name: string]: SlotIdentifier;
}

interface Slots {
  [prop: string]: React.ReactNode | React.ReactNode[];
}

/**
 * Gets the token to represent the slot on an element
 *
 * @param child - The React component or element you want to get the slot token from
 */
export function getSlotToken(child: any) {
  if (!child) {
    return;
  }

  return child.type ? child.type[SLOT_KEY] : child[SLOT_KEY];
}

/**
 * Check to see if a child component is an instance of the given slot
 *
 * @param child - The React child component instance to test
 * @param identifier - The React Component or Slot ID (Symbol) to test against
 */
export function isSlotOf(child: any, identifier: AnyComponent | symbol) {
  const token =
    typeof identifier === 'symbol' ? identifier : getSlotToken(identifier);
  return token
    ? getSlotToken(child) === token
    : isReactInstanceOf(child, identifier as AnyComponent);
}

/** 
 * Forward a ref and make the returned component slottable.
 * 
 * @param Component - Same props you give to React.forwardRef
 * 
 * @example
 * export const SlottedComponentWithRef = forwardWithSlots<
 *  HTMLDivElement,
 *  ContentCardProps,
 *  SubComponents
 * >((props, ref) => null);
 */
export const forwardWithSlots = <RefType, PropType, Slots>(
  Component: React.RefForwardingComponent<RefType, PropType>
) => {
  const forwarded = React.forwardRef(Component);
  return forwarded as typeof forwarded & Slots;
};

/**
 * Chunk child elements into buckets based on React components.
 * Will also return the rest of the props.
 *
 * @param props - The props to find the slots in. Either in props or children
 * @param componentMapping - A map of slot names to slot components
 * @param omit - A list of props to omit from the final returned props
 *
 * @example
 * const Example = props => {
 *   const { header, body, footer, ...html } = createSlots(props, {
 *     header: Header,
 *     body: Body,
 *     footer: Footer
 *   });
 *
 *   return (
 *     <div>
 *       {header}
 *       {body}
 *       {footer}
 *     </div>
 *   )
 * };
 *
 * // No matter what order given, it displays how we defined it!
 * const Usage = () => (
 *   <Example>
 *     <Footer>by me!</Footer>
 *     <Body>Some Text</Body>
 *     <Header>Title</Header>
 *   </Example>
 * )
 *
 * // or
 *
 * const Usage = () => (
 *   <Example>
 *     <Footer>by me!</Footer>
 *     <Body>Some Text</Body>
 *     <Header>Title</Header>
 *   </Example>
 * )
 */
export function createSlots<InputProps extends Props>(
  props: InputProps,
  componentMapping: ComponentMap,
  omit: (keyof InputProps | string)[] = []
): InputProps {
  const otherChildren: React.ReactNode[] = [];
  const slotNames = Object.keys(componentMapping);
  const components: ComponentMapStrict = fromEntries(
    slotNames.map(slot => [slot, arrayify(componentMapping[slot])])
  );
  const slots: Slots = fromEntries(
    slotNames.map(prop => {
      const SlotComp = components[prop][0];
      const slotProps = props[prop];

      if (typeof SlotComp === 'symbol' && slotProps) {
        throw new Error(
          `Cannot create instance for ${prop} when using slot tokens. Use children instead.`
        );
      }

      return [prop, createInstanceIfDefined(slotProps, SlotComp)];
    })
  );
  const passThroughProps: InputProps = fromEntries(
    Object.entries(props).filter(
      ([key]) => componentMapping[key] === undefined && !omit.includes(key)
    )
  );

  React.Children.forEach(props.children, child => {
    const slotName = slotNames.find(propName =>
      components[propName].find(comp => isSlotOf(child, comp))
    );

    if (!slotName) {
      return otherChildren.push(child);
    }

    const slot = slots[slotName];
    slots[slotName] = slot ? [...arrayify(slot), ...arrayify(child)] : child;
  });

  return {
    ...passThroughProps,
    ...slots,
    children: otherChildren.length ? otherChildren : undefined
  };
}
