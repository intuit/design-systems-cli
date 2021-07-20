import * as React from "react";
import { debounce } from "@design-systems/utils";

type Side = "top" | "left" | "bottom" | "right";
type OverflowState = Record<Side, boolean>;

/**
 * This hook allows you to determine when one of your elements has overflowing.
 *
 * @param ref - The dom element to detect overflow on
 *
 * @example
 * const Example = () => {
 *   const ref = useRef<HTMLDivElement>(null);
 *   const { bottom } = useOverflowing(ref);
 *
 *   return (
 *     <div ref={ref}>{
 *       bottom
 *         ? 'The bottom is scrolling'
 *         : 'now it isn\'t!'}
 *     </div>
 *   );
 * };
 */
export const useOverflowing = <T extends HTMLElement>(
  ref: React.RefObject<T>
): OverflowState => {
  const [overflowing, setOverflowing] = React.useState<OverflowState>({
    top: false,
    bottom: false,
    left: false,
    right: false,
  });

  React.useEffect(() => {
    const { current } = ref;

    if (!current) {
      return;
    }

    const updateOverflowing = debounce(() => {
      if (!current) {
        return;
      }

      const {
        scrollHeight,
        scrollWidth,
        clientHeight,
        clientWidth,
        scrollTop,
        scrollLeft,
      } = current;
      const scrollX = scrollWidth - clientWidth;
      const scrollY = scrollHeight - clientHeight;

      const state: OverflowState = {
        top: scrollTop !== 0,
        bottom: scrollHeight > clientHeight && scrollY !== scrollTop,
        left: scrollLeft !== 0,
        right: scrollWidth > clientWidth && scrollX !== scrollLeft,
      };

      if (
        state.bottom !== overflowing.bottom ||
        state.top !== overflowing.top ||
        state.left !== overflowing.left ||
        state.right !== overflowing.right
      ) {
        setOverflowing(state);
      }
    });

    if (!window) {
      return;
    }

    updateOverflowing();

    window.addEventListener("resize", updateOverflowing);
    current.addEventListener("scroll", updateOverflowing);

    return () => {
      window.removeEventListener("resize", updateOverflowing);
      current.removeEventListener("scroll", updateOverflowing);
    };
  }, [ref, overflowing]);

  return overflowing;
};