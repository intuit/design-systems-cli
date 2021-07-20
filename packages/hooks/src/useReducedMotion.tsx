import * as React from "react";

/**
 * Determine if the user has "prefers-reduced-motion" enabled in their browser.
 *
 * @example
 * const Example = () => {
 * const isReducedMotion = useReducedMotion();
 *
 * return (
 *   <div className={makeClass(!isReducedMotion && styles.animation)}>Content</div>
 * );
 * };
 */
export const useReducedMotion = () => {
  const [reduceMotion, setReduceMotion] = React.useState(
    window
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  React.useEffect(() => {
    if (!window) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    /** Ran when the user changes this setting. */
    const changeReduceMotion = () => setReduceMotion(!reduceMotion);

    /** Use newer method if is available, else fall back to deprecated method */
    if (typeof mediaQuery.addEventListener === "function") {
      /** This method listens when the user toggles the reduced motion option */
      /** https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList/addListener */
      mediaQuery.addEventListener("change", changeReduceMotion);
    } else {
      mediaQuery.addListener(changeReduceMotion);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", changeReduceMotion);
      } else {
        mediaQuery.removeListener(changeReduceMotion);
      }
    };
  }, [reduceMotion]);

  return reduceMotion;
};