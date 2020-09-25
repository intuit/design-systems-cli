/* eslint-disable jsx-a11y/no-noninteractive-tabindex */

import * as React from 'react';
import moveFocusInside, { focusInside } from 'focus-lock';
import mergeRefs from 'react-merge-refs';

import { Element } from '..';

interface FocusLockProps {
  /** Whether the lock is activated */
  active: boolean;
}

/** A boundary for the focus lock */
const FocusGuard = ({ active }: FocusLockProps) => (
  <div
    data-focus-guard
    tabIndex={active ? 0 : -1}
    style={{
      width: 1,
      height: 0,
      padding: 0,
      overflow: 'hidden',
      position: 'fixed',
      top: 1,
      left: 1
    }}
  />
);

/** Lock focus withing an area of the app */
export const FocusLock = React.forwardRef<
  HTMLDivElement,
  FocusLockProps & Element<'div'>
>(({ active, onBlur = () => undefined, ...html }, ref) => {
  const trap = React.useRef<HTMLDivElement>(null);

  /** Trap the focus within the locks if active */
  const trapFocus = () => {
    if (active && !focusInside(trap.current)) {
      setTimeout(
        () => moveFocusInside(trap.current, document.activeElement),
        50
      );
    }
  };

  React.useEffect(trapFocus);

  return (
    <>
      <FocusGuard active={active} />
      <div
        ref={mergeRefs([trap, ref])}
        {...html}
        onBlur={e => {
          if (
            e.relatedTarget &&
            (e.relatedTarget as HTMLElement).getAttribute('data-focus-guard')
          ) {
            trapFocus();
          }

          onBlur(e);
        }}
      />
      <FocusGuard active={active} />
    </>
  );
});
