import { useMatchMedia } from './useMatchMedia';

/**
 * Determine if the user has "prefers-contrast: less" enabled in their browser.
 *
 * @example
 * const Example = () => {
 * const isPrefersLessContrast = usePrefersLessContrast();
 *
 * return (
 *   <div className={makeClass(!isPrefersLessContrast && styles.highContrast)}>Content</div>
 * );
 * };
 */
export const usePrefersLessContrast = () => {
  return useMatchMedia('(prefers-contrast: less)');
};
