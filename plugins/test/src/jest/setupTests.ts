/* eslint-disable @typescript-eslint/ban-ts-ignore */

window.matchMedia =
  window.matchMedia ||
  function() {
    return {
      matches: false
    };
  };

// @ts-ignore
if (global.document) {
  /** Create a mock for createRange */
  document.createRange = () => ({
    setStart: () => {
      // range polyfill 
    },
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
