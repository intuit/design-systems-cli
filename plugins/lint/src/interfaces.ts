import stylelint from 'stylelint';

interface LintArgs {
    /** Attempt to fix the lint errors. */
    fix?: boolean;
    /** Do not use any cached results from previous runs. */
    noCache?: boolean;
    /** Post lint results as annotations to PR. Only in CI. */
    annotate?: boolean;
    /** An optional list of files to lint */
    files?: string[];
}

type StylelintResult = stylelint.LinterResult & {
    /** Lines with needless disables */
    needlessDisables?: {
        /** The files the needless disables are found in */
        source: string;
        /** Ranges with needless disables */
        ranges: {
            /** Rule name */
            unusedRule: string;
            /** Line number */
            start: number;
        }[];
    }[];
};

export {
    LintArgs,
    StylelintResult
}