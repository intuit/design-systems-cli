import getPackages from 'get-monorepo-packages';
import fs from 'fs';
import stylelint from 'stylelint';
import path from 'path';
import {
  getMonorepoRoot
} from '@design-systems/cli-utils';
import { LintArgs, StylelintResult } from '../interfaces';

/** Get the folders that contain packages in the monorepo. */
function getPackageFolders() {
  return [
    ...getPackages('.').reduce((all, p) => {
      all.add(p.location.split('/')[0]);
      return all;
    }, new Set<string>())
  ];
}

/** Determine when a file was last edited */
function getLastEdited(filename: string) {
  try {
    return fs.statSync(filename).mtimeMs;
  } catch (error) {
    return 0;
  }
}

/** Return a list of files to lint */
function files(args: LintArgs, types: string) {
  const isRoot = getMonorepoRoot() === process.cwd();

  if (args.files) {
    const fileExt = new Set(types.split('|'));
    return args.files.filter(f => fileExt.has(path.extname(f).substr(1)));
  }

  if (isRoot) {
    return [`components/**/src/**/*.(${types})`];
  }

  return [`src/**/*.(${types})`];
}

/** Run stylelint with the given options. */
async function attemptStylelint(
  options: Partial<stylelint.LinterOptions>
): Promise<StylelintResult> {
  try {
    return (await stylelint.lint(options)) as StylelintResult;
  } catch (error) {
    if (error.message.includes('No files matching the pattern')) {
      return {
        results: [],
        output: 'no match',
        errored: false
      };
    }

    throw error;
  }
}

export { getPackageFolders, getLastEdited, files, attemptStylelint, getMonorepoRoot };
