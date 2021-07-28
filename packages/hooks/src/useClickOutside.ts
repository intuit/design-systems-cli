import * as React from "react";

/**
 * This hook allows you to determine when a user clicks outside of an HTML Element.
 *
 * @param callback - Run when the document is clicked
 *
 * @example
 * const Example = () => {
 *   const ref = useClickOutside(() => console.log('clicked outside!'));
 *
 *   return (
 *     <div ref={ref}>{'Click outside of me'}</div>
 *   );
 * };
 */
export const useClickOutside = <T extends HTMLElement>(
  callback: (clickedOutside: boolean) => void
) => {
  const trigger: React.MutableRefObject<T | null> = React.useRef<T>(null);

  React.useEffect(() => {
    const doc = (trigger.current && trigger.current.ownerDocument) || document;
    /** The event handler determining if the user clicked outside. */
    const onDocumentClick = (e: Event) => {
      if (trigger.current && trigger.current.contains(e.target as Node)) {
        callback(false);
        e.stopPropagation();
      } else {
        callback(true);
      }
    };

    doc.addEventListener("mouseup", onDocumentClick);
    doc.addEventListener("touchend", onDocumentClick);

    return () => {
      doc.removeEventListener("mouseup", onDocumentClick);
      doc.removeEventListener("touchend", onDocumentClick);
    };
  }, [callback]);

  return trigger;
};