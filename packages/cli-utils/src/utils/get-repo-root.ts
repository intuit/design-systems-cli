import path from 'path';
import findUp from 'find-up';

/** Determine the directory of the repo */
const getRepoRoot = (cwd: string = process.cwd()) => {
  try {
    const repoRoot = findUp.sync('package.json', {
      cwd
    });

    if (!repoRoot) {
      return '';
    }

    return path.dirname(repoRoot);
  } catch (error) {
    return '';
  }
};

export default getRepoRoot;
