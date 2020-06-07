/* eslint-disable @typescript-eslint/ban-ts-comment */

window.matchMedia =
  window.matchMedia ||
  function() {
    return {
      matches: false
    };
  };

// @ts-ignore
if (global.document) {
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
