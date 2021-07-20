import * as React from "react";

/** Get the locale using navigator */
const getLocale = (initial?: string) => {
  let modern: string | undefined;
  if (navigator.languages && navigator.languages.length) {
    [modern] = navigator.languages;
  }

  const old = navigator.language;
  return modern || old || initial || "en-US";
};

/**
 * This hook allows you to get the users Internationalization locale string.
 * If one is not found, it defaults to US English, or a provided default.
 *
 * @param initial - A default locale string, if you want something different than en-US.
 *
 * @example
 * const Example = () => {
 *   const locale = useLocale();
 *   const localeModifiedDefault = useLocale("en-GB");
 *
 *   return (
 *     <div>The users locale is {locale}</div>
 *   );
 * };
 */
export const useLocale = (initial?: string) => {
  const [locale, setLocale] = React.useState(getLocale(initial));

  /** Watch for locale changes */
  React.useEffect(() => {
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/languagechange_event
    /** Set locale state */
    const languageListener = () => {
      setLocale(getLocale());
    };

    window.addEventListener("languagechange", languageListener);

    return () => {
      window.removeEventListener("languagechange", languageListener);
    };
  });

  return locale;
};
