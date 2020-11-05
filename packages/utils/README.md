# @design-systems/utils

Helper utilities for developing react components.

## Installation

```sh
npm i @design-systems/utils
# with yarn
yarn add @design-systems/utils
```

```js
import Utils from '@design-systems/utils';
```

## Usage

<!-- INSERT GENERATED DOCS START -->

### `arrayify` (function)

Normalize a value to an array.

**Parameters:**

- value (`T | T[]`) - The value to potentially convert to an array

```tsx
arrayify('a'); // = ['a']
arrayify(['a']); // = ['a']
```

### `fromEntries` (function)

Object.fromEntries ponyfill while we wait for better babel support.

**Parameters:**

- entries (`[string, any][]`) - Array of object entries.

```tsx
fromEntries([['key', 'value']]);
```

### `Omit` (type)

Omit keys from a type.

```tsx
Omit<{foo: string, bar: string}, 'foo'>
// = { bar: string }
```

### `omit` (function)

Omit keys from an object.

**Parameters:**

- obj (`Props`) - The object to omit props from
- keys (`Prop[]`) - A list of keys to omit

Here is a simple example

```ts
const result = omit({ foo: 'a', bar: 'b' }, 'foo');
// result = { bar: 'b' }
```

Here is a another example

```ts
const result = omit({ baz: 'a', bar: 'b' }, 'baz');
// result = { bar: 'b' }
```

### `getProp` (function)

Attempt to retrieve a prop from a react node.

**Parameters:**

- el (`ReactNode`) - The react node to get props from
- prop (`string`) - The name of the prop to get

```tsx
getProp(child, 'id');
```

### `DisplayNamed` (interface)

**Members:**

- displayName (`string`) - The name various dev tools should use to display the component

### `displayName` (function)

Set a displayName on a component. This name is used in various dev tools.

**Parameters:**

- comp (`T`) - The component to set the display name on
- name (`string`) - The display name for the component

```tsx
displayName(Component, 'MyCoolComponent');
```

### `isReactInstanceOf` (function)

Determine whether a HTML element is an instance of a React component.

**Parameters:**

- element - Element to check the instance of
- component (`Renderable<Props>`) - The component to check for
- // IDK how to get rid of this any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  element (`any`)

**returns:** boolean

```tsx
isReactInstanceOf(child, MyComponent);
```

### `WINDOW_RESIZE_DELAY` (variable)

### `debounce` (function)

Only call a function once every 'wait" seconds.

**Parameters:**

- func (`Base`) - the callback to debounce
- wait (`number`) - how long to wait until to run the callback
- immediate (`boolean`) - run the callback immediately

**returns:** Base

```tsx
const onClick = debounce(() => console.log('I was clicked'), 1000);
```

### `logger` (variable)

Logger
A logging utility which maps to console in development but
is a no-op in production.

### `Require` (type)

Mark some keys of an interface as required

**Properties:**

- T - interface to augment
- K - keys to convert to required

```tsx
type Example = { foo?: string; bar?: string };
type WithFooRequired = Require<Example, 'foo'>;
```

### `Element` (type)

Get all of the props for an HTML element. Used to easily type
the rest props of a component.

**Properties:**

- T - element to extend

```tsx
interface CardProps extends Element<'div'> {
  isRound?: boolean;
}

const Card: React.FC<CardProps> = ({ isRound, children, ...html }) => (
  <div {...html} style={{ borderRadius: isRound ? '4px' : 0 }}>
    {children}
  </div>
);
```

```tsx
const Card: React.FC<Element<'div'>> = ({ children, ...html }) => (
  <div {...html}>{children}</div>
);
```

### `Never` (type)

Create an interface that has all the properties of the input
interface set to 'never'.

**Properties:**

- T - The input interface

```tsx
type A = { a: string };
type B = { b: string };
type C = A & Never<B>;

const test: C = {
  a: 'foo',
  b: 'bar' // <- This line will create an error
};
```

### `OneOf` (type)

Create an interface that only accepts one of the two provided interface

```tsx
type A = { a: string };
type B = { b: string };
type C = OneOf<A, B>;

const test: C = {
  a: 'foo',
  b: 'bar' // <- This line will create an error
};
```

### `OneOf3` (type)

Create an interface that only accepts one of the three provided interface

```tsx
type A = { a: string };
type B = { b: string };
type C = { c: string };
type D = OneOf<A, B, C>;

const test: D = {
  a: 'foo',
  c: 'bar' // <- This line will create an error
};
```

### `createInstanceIfDefined` (function)

Create an instance of the component only if the element is defined.

**Parameters:**

- node (`ReactNode`) - The node to check if it's defined
- Component (`ComponentType<{}>`) - The component to wrap the node in

```tsx
const child = 'Foo';
createInstanceIfDefined(child, Wrapper);
// <Wrapper>'Foo'</Wrapper>
const other = null;
createInstanceIfDefined(other, Wrapper);
// undefined
```

### `SLOT_KEY` (variable)

### `getSlotToken` (function)

Gets the token to represent the slot on an element

**Parameters:**

- child (`any`) - The React component or element you want to get the slot token from

**returns:** any

### `isSlotOf` (function)

Check to see if a child component is an instance of the given slot

**Parameters:**

- child (`any`) - The React child component instance to test
- identifier (`symbol | ComponentClass<any, any> | FunctionComponent<any>`) - The React Component or Slot ID (Symbol) to test against

**returns:** boolean

### `forwardWithSlots` (function)

Forward a ref and make the returned component slottable.

**Parameters:**

- Component (`RefForwardingComponent<RefType, PropType>`) - Same props you give to React.forwardRef

```tsx
export const SlottedComponentWithRef = forwardWithSlots<
  HTMLDivElement,
  ContentCardProps,
  SubComponents
>((props, ref) => null);
```

### `createSlots` (function)

Chunk child elements into buckets based on React components.
Will also return the rest of the props.

**Parameters:**

- props (`InputProps`) - The props to find the slots in. Either in props or children
- componentMapping (`ComponentMap`) - A map of slot names to slot components
- omit (`(string | keyof InputProps)[]`) - A list of props to omit from the final returned props

**returns:** InputProps

```tsx
const Example = props => {
  const { header, body, footer, ...html } = createSlots(props, {
    header: Header,
    body: Body,
    footer: Footer
  });

  return (
    <div>
      {header}
      {body}
      {footer}
    </div>
  );
};

// No matter what order given, it displays how we defined it!
const Usage = () => (
  <Example>
    <Footer>by me!</Footer>
    <Body>Some Text</Body>
    <Header>Title</Header>
  </Example>
);

// or

const Usage = () => (
  <Example>
    <Footer>by me!</Footer>
    <Body>Some Text</Body>
    <Header>Title</Header>
  </Example>
);
```

### `FocusLock` (variable)

Lock focus withing an area of the app

### `Portal` (variable)

Render an element inside of a portal.

```tsx
const Example = () => <Portal>{'I am rendered at the end of the dom'}</Portal>;
```

### `DocGen` (interface)

**Members:**

- \_\_docgenInfo (`{ description: string; }`) - The generated docs for the react component

### `Slotted` (interface)

**Members:**

- _SLOT_ (`symbol`) - The slot the styled element should render in

### `styled` (function)

Create a react element with a className attached. The generated element accepts
all the same props as the element prop.

**Parameters:**

- element (`T | [T, ...((props: any) => ReactNode)[]]`) - The html dom element to create a Component for
- options (`string | WrappedComponent`) - The class an metadata to attach to the Component

**returns:** DocGen & Slotted & WithRef

```tsx
const Wrapper = styled('div', {
  class: styles.fancy,
  description: 'A fancy component',
  name: 'FancyWrapper'
});

const Example = ({ children, ...html }) => {
  <Wrapper {...html}>{children}</Wrapper>;
};
```

<!-- INSERT GENERATED DOCS END -->
