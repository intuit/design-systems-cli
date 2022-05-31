/* eslint-disable @typescript-eslint/ban-ts-comment */

if (typeof window !== 'undefined') {
  window.matchMedia =
    window.matchMedia ||
    function() {
      return {
        matches: false
      };
    };
}


// @ts-ignore
if (global.document) {
  /** Create a mock for createRange */
  document.createRange = () => ({
    /** Start stub */
    setStart: () => {
      // range polyfill 
    },
    /** End stub */
    setEnd: () => {
      // range polyfill 
    },
    // @ts-ignore
    commonAncestorContainer: {
      nodeName: 'BODY',
      ownerDocument: document
    }
  });
}
