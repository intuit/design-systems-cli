import { useMatchMedia } from './useMatchMedia';

/**
 * Determine if the user has "prefers-contrast: more" enabled in their browser.
 *
 * @example
 * const Example = () => {
 * const isPrefersHighContrast = usePrefersHighContrast();
 *
 * return (
 *   <div className={makeClass(!isPrefersHighContrast && styles.highContrast)}>Content</div>
 * );
 * };
 */
export const usePrefersHighContrast = () => {
  return useMatchMedia('(prefers-contrast: more)');
};
