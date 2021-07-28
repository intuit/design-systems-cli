import * as React from "react";

const STORAGE_KEY = "data-keyboard-nav";

/** See if we have a stored keyboard navigation initial value */
const getStoredValue = () => {
  if (typeof window === "undefined") {
    return;
  }

  return document.querySelector("body")?.getAttribute(STORAGE_KEY) === "true";
};

/**
 * This hook lets you to determine when a user
 * is navigating the page using their keyboard.
 *
 * @example
 * const Example = () => {
 *   const isKeyboardNav = useKeyboardNavigation();
 *
 * return (
 *   <div
 *     className={makeClass({ [styles.focus]: isKeyboardNav })}
 *   />
 *  );
 * };
 **/
export const useKeyboardNavigation = (initial = false) => {
  const [isKeyboardNav, setIsKeyboardNav] = React.useState(
    getStoredValue() || initial
  );
  React.useEffect(() => {
    /** An Event listener that listens for keyboard navigation */
    function keyboardFocus(e: KeyboardEvent) {
      if (e.key !== "Tab" && !e.key?.includes("Arrow")) {
        return;
      }

      setIsKeyboardNav(true);
      document.querySelector("body")?.setAttribute(STORAGE_KEY, "true");
      document.removeEventListener("keydown", keyboardFocus, false);
    }

    /** An Event listener that listens for mouse navigation */
    function mouseDown(e: MouseEvent) {
      // If all these values are zero the click happened via
      // Enter or Space
      if (
        e.screenX === 0 &&
        e.screenY === 0 &&
        e.clientX === 0 &&
        e.clientY === 0
      ) {
        return;
      }

      setIsKeyboardNav(false);
      document.querySelector("body")?.removeAttribute(STORAGE_KEY);
    }

    /** An Event listener that listens for mouse navigation */
    function onTouch(e: TouchEvent) {
      // If all these values are zero the click happened via
      // Enter or Space

      if (
        e.touches[0].screenX === 0 &&
        e.touches[0].screenY === 0 &&
        e.touches[0].clientX === 0 &&
        e.touches[0].clientY === 0
      ) {
        return;
      }

      setIsKeyboardNav(false);
      document.querySelector("body")?.removeAttribute(STORAGE_KEY);
    }

    document.addEventListener("keydown", keyboardFocus, false);
    document.addEventListener("mousedown", mouseDown, false);
    document.addEventListener("touchstart", onTouch, false);

    return () => {
      document.removeEventListener("keydown", keyboardFocus, false);
      document.removeEventListener("mousedown", mouseDown, false);
      document.removeEventListener("touchstart", onTouch, false);
    };
  });
  return isKeyboardNav;
};
