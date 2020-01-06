import fs from 'fs';
import path from 'path';

import getMonorepoRoot from './get-monorepo-root';

const DEFAULT_NAME = 'monorepo';

/** Determine if the monorepo name contains a scope. */
function getScope(pkgName: string): string {
  const match = pkgName.match(/@([\S]+)\//);
  if (!match) {
    return pkgName;
  }

  return match[1];
}

/** Determine the monorepo's name. */
const monorepoName = () => {
  try {
    const monorepoRoot = getMonorepoRoot();

    if (!monorepoRoot) {
      return DEFAULT_NAME;
    }

    const pkgName = JSON.parse(
      fs.readFileSync(path.join(monorepoRoot, 'package.json'), 'utf-8')
    ).name as string;

    let parsed = pkgName;

    if (pkgName && pkgName.startsWith('@')) {
      parsed = getScope(pkgName);
    }

    return parsed || DEFAULT_NAME;
  } catch (error) {
    return DEFAULT_NAME;
  }
};

export default monorepoName;
