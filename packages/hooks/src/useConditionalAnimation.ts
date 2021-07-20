import React from "react";

/**
 * Only run a specific animation once a condition has changed.
 * This fixes a bug where the exit/entrance animation will run on first
 * render.
 *
 * @example
 * const Example = () => {
 *  const exitAnimation = useConditionalAnimation(
 *    styles.hide,
 *    "animation-exit",
 *    isOpen
 *  );
 *  return (
 *    <div ref={ref}>Click outside of me</div>
 *  );
 * };
 */
export const useConditionalAnimation = (
  defaultClass: string,
  animation: string,
  condition: boolean
) => {
  const entranceAnimation = React.useRef(defaultClass);

  React.useEffect(() => {
    // When the LargeTitle renders the first time we want no
    // entrance animation. Once the content starts overflowing
    // is when the entrance animation is active.
    if (condition) {
      entranceAnimation.current = animation;
    }
  }, [condition, animation]);

  return entranceAnimation.current;
};