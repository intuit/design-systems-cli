export interface LintArgs {
    /** Attempt to fix the lint errors. */
    fix?: boolean;
    /** Do not use any cached results from previous runs. */
    noCache?: boolean;
    /** Post lint results as annotations to PR. Only in CI. */
    annotate?: boolean;
    /** An optional list of files to lint */
    files?: string[];
  }