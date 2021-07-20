import * as React from "react";

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
  const [darkMode, setDarkMode] = React.useState(
    window ? window.matchMedia("(prefers-color-scheme: dark)").matches : false
  );

  React.useEffect(() => {
    if (!window) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    /** Run when the user changes this setting. */
    const changeDarkMode = () => setDarkMode(!darkMode);

    mediaQuery.addListener(changeDarkMode);

    return () => {
      mediaQuery.removeListener(changeDarkMode);
    };
  }, [darkMode]);

  return darkMode;
};