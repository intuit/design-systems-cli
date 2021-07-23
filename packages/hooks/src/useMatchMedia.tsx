import * as React from 'react';

/**
 * Determine if the user has media preferences enabled in their browser.
 *
 * @example
 * const Example = () => {
 * const isReducedMotion = useMatchMedia('(prefers-reduced-motion: reduce)');
 *
 * return (
 *   <div className={makeClass(!isReducedMotion && styles.animation)}>Content</div>
 * );
 * };
 */
export const useMatchMedia = (selector: string) => {
  const [mediaState, setMediaState] = React.useState(
    window ? window.matchMedia(selector).matches : false
  );

  React.useEffect(() => {
    if (!window) {
      return;
    }

    const mediaQuery = window.matchMedia(selector);

    /** Ran when the user changes this setting. */
    const changeMatchMedia = () => setMediaState(!mediaState);

    /** Use newer method if is available, else fall back to deprecated method */
    if (typeof mediaQuery.addEventListener === 'function') {
      /** This method listens when the user toggles the reduced motion option */
      /** https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList/addListener */
      mediaQuery.addEventListener('change', changeMatchMedia);
    } else {
      mediaQuery.addListener(changeMatchMedia);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', changeMatchMedia);
      } else {
        mediaQuery.removeListener(changeMatchMedia);
      }
    };
  }, [mediaState, selector]);

  return mediaState;
};
