// https://davidwalsh.name/javascript-debounce-function

type Args = any[];
type Base = (...args: Args) => void;

export const WINDOW_RESIZE_DELAY = 150;

/**
 * Only call a function once every 'wait" seconds.
 *
 * @param func - the callback to debounce
 * @param wait - how long to wait until to run the callback
 * @param immediate - run the callback immediately
 *
 * @example
 * const onClick = debounce(
 *   () => console.log('I was clicked'),
 *   1000
 * );
 */
export function debounce(
  func: Base,
  wait = WINDOW_RESIZE_DELAY,
  immediate = false
): Base {
  let timeout: NodeJS.Timeout | null;

  return function x(...args: Args) {
    /** The function that actually runs the user's function. */
    const later = () => {
      timeout = null;

      if (!immediate) func(...args);
    };

    const callNow = immediate && !timeout;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);

    if (callNow) func(...args);
  };
}
