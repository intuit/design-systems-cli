import path from 'path';
import findUp from 'find-up';

/** Determine the directory of the monorepo */
const getMonorepoRoot = (cwd: string = process.cwd()) => {
  try {
    const monorepoRoot = findUp.sync('lerna.json', {
      cwd
    });

    if (!monorepoRoot) {
      return '';
    }

    return path.dirname(monorepoRoot);
  } catch (error) {
    return '';
  }
};

export default getMonorepoRoot;
