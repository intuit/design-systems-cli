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

  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

  // cancel any pending focus change
  const cancelPendingFocus = React.useCallback(() => {
    if (timeoutRef.current !== undefined) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, []);

  /** Trap the focus within the locks if active */
  const trapFocus = React.useCallback(() => {
    cancelPendingFocus();

    if (!active || !trap.current || focusInside(trap.current)) {
      return;
    }

    timeoutRef.current = setTimeout(() => {
      const currentTrap = trap.current;
      timeoutRef.current = undefined;

      if (active && currentTrap && !focusInside(currentTrap)) {
        moveFocusInside(
          currentTrap,
          document.activeElement as HTMLInputElement
        );
      }
    }, 50);
  }, [active, cancelPendingFocus]);

  React.useEffect(() => {
    trapFocus();

    return cancelPendingFocus;
  }, [cancelPendingFocus, trapFocus]);

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
