import { useMatchMedia } from "./useMatchMedia";

/**
 * Determine if the user has a "prefers-color-scheme" mode enabled in their browser.
 * This is helpful for detecting if a user prefers dark mode.
 *
 * @example
 * const Example = () => {
 * const isDarkMode = useDarkMode();
 *
 * return (
 *   <div className={makeClass(darkMode === "dark" && styles.dark)}>Content</div>
 * );
 * };
 */
export const useDarkMode = () => {
    return useMatchMedia("(prefers-color-scheme: dark)");
}; 