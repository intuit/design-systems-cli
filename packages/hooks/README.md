# @design-systems/hooks

[React Hooks](https://reactjs.org/docs/hooks-intro.html) are a feature that allow developers to
share modular pieces of functionality across React applications. These utilities are available for others to benefit from them.

## Installation

```sh
npm i @design-systems/hooks
# or with yarn
yarn add @design-systems/hooks
```

```js
import { useClickOutside } from "@design-systems/hooks";
```

<!-- INSERT GENERATED DOCS START -->

### `useClickOutside` (function)

This hook allows you to determine when a user clicks outside of an HTML Element.

**Parameters:**

- callback (`(clickedOutside: boolean) => void`) - Run when the document is clicked

```tsx
const Example = () => {
  const ref = useClickOutside(() => console.log("clicked outside!"));

  return <div ref={ref}>{"Click outside of me"}</div>;
};
```

### `useConditionalAnimation` (function)

Only run a specific animation once a condition has changed.
This fixes a bug where the exit/entrance animation will run on first
render.

```tsx
const Example = () => {
  const exitAnimation = useConditionalAnimation(
    styles.hide,
    "animation-exit",
    isOpen
  );
  return <div ref={ref}>Click outside of me</div>;
};
```

### `usePopper` (function)

A lightweight usePopper hook. This hooks has the same API as "react-popper

**Parameters:**

- referenceElement (`HTMLElement`) - The element to place the popper next to
- popperElement (`HTMLElement`) - The element to pop
- options (`any`) - Options to pass to popper.js

```tsx
const Example = () => {
  const [open, setOpen] = useState(false);
  const [
    referenceElement,
    setReferenceElement,
  ] = useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const { styles, attributes } = usePopper(referenceElement, popperElement);

  return (
    <>
      <button
        ref={setReferenceElement}
        type="button"
        onClick={() => setOpen(!open)}
      >
        Click me to show popper
      </button>

      {open && (
        <div ref={setPopperElement} {...styles} {...attributes}>
          The popper element content
        </div>
      )}
    </>
  );
};
```

### `useStickyState` (function)

Determine if a position:sticky element is sticking.

**Parameters:**

- element (`RefObject<T>`) - The element to detect the sticky state of

```tsx
const ref = useRef<HTMLDivElement>(null);
const isSticking = useStickyState(ref);
```

### `useKeyboardNavigation` (function)

This hook allows you to determine when a user
is navigating the page using their keyboard.

```tsx
const Example = () => {
  const isKeyboardNav = useKeyboardNavigation();

  return <div className={makeClass({ [styles.focus]: isKeyboardNav })} />;
};
```

### `useOverflowing` (function)

This hook allows you to determine when one of your elements has overflowing.

**Parameters:**

- ref (`RefObject<T>`) - The dom element to detect overflow on

```tsx
const Example = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { bottom } = useOverflowing(ref);

  return (
    <div ref={ref}>{bottom ? "The bottom is scrolling" : "now it isn't!"}</div>
  );
};
```

### `useMatchMedia` (function)

Determine if the user has a media preference enabled in their browser.

```tsx
const Example = () => {
  const isReducedMotion = useMatchMedia('(prefers-reduced-motion: reduce)');

  return (
    <div className={makeClass(!isReducedMotion && styles.animation)}>
      Content
    </div>
  );
};
```

<!-- INSERT GENERATED DOCS END -->