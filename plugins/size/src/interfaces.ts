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

  interface ConfigOptions {
    /** The directory to make a webpack config for */
    dir: string;
  }

  interface CommonOptions {
    /** The name of the package to get size for */
    name: string;
    /** The name of to import the pacakge with */
    importName: string;
    /** Where the code is located. */
    scope: Scope;
    /** Whether to persist the generated bundle to the filesystem */
    persist?: boolean;
    /** Create chunks based on the exports from the component */
    chunkByExport?: boolean;
    /** Whether the size output will be diffed */
    diff?: boolean;
    /** The registry to install packages from */
    registry?: string;
  }
  
  interface GetSizesOptions {
    /** Whether to start the analyzer */
    analyze?: boolean;
    /** What port to start the analyzer on */
    analyzerPort?: number;
  }

  type Scope = 'pr' | 'master';

  interface DiffSizeForPackageOptions
  extends Omit<CommonOptions, 'importName' | 'scope'> {
  /** Path to the local built pacakge */
  main: string;
}

interface RelativeCommentsPluginOptions {
  /** The name of the package */
  importName: string;
}

  export {
    SizeArgs,
    Export,
    Size,
    SizeResult,
    ConfigOptions,
    CommonOptions,
    GetSizesOptions,
    DiffSizeForPackageOptions,
    RelativeCommentsPluginOptions
  }