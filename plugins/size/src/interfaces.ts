interface SizeArgs {
    /** Start a webpack bundle analyzer for each bundle */
    analyze?: boolean;
    /** Split the CSS and JS sizes */
    css?: boolean;
    /** Show the cost of each export from the package */
    detailed?: boolean;
    /** Persist the bundles to the filesystem */
    persist?: boolean;
    /** Open a diff of the two bundles */
    diff?: boolean;
    /** Run in CI mode. Much more quiet output. */
    ci?: boolean;
    /** Comment on the Pull request with the results. (Only from CI + must set env var GH_TOKEN) */
    comment?: boolean;
    /** Ignore git and run size for all packages */
    all?: boolean;
    /** Package names to ignore */
    ignore?: string[];
    /** The registry to install packages from */
    registry?: string;
  }
  
  interface Export {
    /** The name of the chunk the file belongs to */
    chunkNames: string[];
    /** Name of the emitted file */
    name: string;
    /** Size of the emitted file */
    size: number;
  }
  
  interface Size {
    /** The size of the CSS */
    css: number;
    /** The size of the JS */
    js: number;
    /** Top level exports of package */
    exported?: Export[];
  }
  
  interface SizeResult {
    /** The size of current master */
    master: Size;
    /** The size of the local changes */
    pr: Size;
    /** The difference between sizes */
    percent: number;
  }

  export {
    SizeArgs,
    Export,
    Size,
    SizeResult
  }