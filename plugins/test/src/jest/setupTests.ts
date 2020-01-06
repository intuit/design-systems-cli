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
  document.createRange = () => ({
    setStart: () => {},
    setEnd: () => {},
    // @ts-ignore
    commonAncestorContainer: {
      nodeName: 'BODY',
      ownerDocument: document
    }
  });
}
