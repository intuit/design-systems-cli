import { useMatchMedia } from "./useMatchMedia";

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
    return useMatchMedia("(prefers-reduced-motion: reduce)");
}; 