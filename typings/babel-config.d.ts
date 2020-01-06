declare module '@design-systems/build/babel.config';
declare module '@royriojas/get-exports-from-file' {
  interface Result {
    exported: ({ name: string; default?: boolean })[];
  }

  const fn: {
    cjs: (path: string) => Promise<Result>;
    es6: (path: string) => Promise<Result>;
  };

  export = fn;
}
