/* eslint-disable no-cond-assign, no-continue */

import { RefObject, useEffect, useState } from "react";

import { debounce } from "@design-systems/utils";

/** Get the nearest scroll container */
function getScrollParent(element: HTMLElement) {
  let style = getComputedStyle(element);

  const excludeStaticParent = style.position === "absolute";
  const overflowRegex = /(auto|scroll|hidden)/;

  if (style.position === "fixed") {
    return document.body;
  }

  let parent: HTMLElement | null = element;

  while ((parent = parent.parentElement)) {
    style = getComputedStyle(parent);

    if (excludeStaticParent && style.position === "static") {
      continue;
    }

    if (
      overflowRegex.test(style.overflow + style.overflowY + style.overflowX)
    ) {
      return parent;
    }
  }

  return document.body;
}

/**
 * Determine if a position:sticky element is sticking.
 *
 * @param element - The element to detect the sticky state of
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * const isSticking = useStickyState(ref);
 */
export const useStickyState = <T extends HTMLElement>(
  element: RefObject<T | null>
) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const { current: stickyTarget } = element;

    if (!stickyTarget || !window) {
      return;
    }

    const parentElement = getScrollParent(stickyTarget);

    if (!parentElement) {
      return;
    }

    const calculateIsSticky = debounce(() => {
      const pTop = parentElement.scrollTop;
      const tTop = stickyTarget.getBoundingClientRect().top;
      const difference = Math.round(Math.abs(pTop - tTop));
      const triggerDistance = window
        .getComputedStyle(stickyTarget)
        .getPropertyValue("top");

      setIsSticky(difference !== Math.abs(parseInt(triggerDistance, 10)));
    }, 25);

    calculateIsSticky();

    parentElement.addEventListener("scroll", calculateIsSticky);

    return () => parentElement.removeEventListener("scroll", calculateIsSticky);
  }, [element]);

  return isSticky;
};