import { execSync } from 'child_process';
import os from 'os';
import path from 'path';
import { getMonorepoRoot, createLogger } from '@design-systems/cli-utils';

const logger = createLogger({ scope: 'size' });

/** Builds the specified commit */
export function buildPackages(args: {
  /** Merge base to run build */
  mergeBase: string
  /** Build command for merge base */
  buildCommand: string
}) {
  const id = Math.random().toString(36).substring(7);
  const dir = path.join(os.tmpdir(), `commit-build-${id}`);
  const root = getMonorepoRoot();

  const commit = execSync(`git merge-base HEAD ${args.mergeBase}`, { cwd: root }).toString().trim();
  execSync(`git clone . ${dir}`, { cwd: root, stdio: 'ignore' });
  execSync(`git checkout ${commit}`, { cwd: dir, stdio: 'ignore' });

  logger.info(`Installing dependencies for commit: ${commit} ...`);
  execSync('yarn', { cwd: dir });

  logger.info(`Running command "${args.buildCommand}" for commit: ${commit} ...`);
  execSync(args.buildCommand, {
    cwd: dir,
    stdio: 'inherit'
  });

  return dir;
}

/** Get path to local built master package */
export function getLocalPackage(
  /** Package name */
  name: string,
  /** Path to local built master */
  local: string
) {
  const packages = execSync(`lerna list --ndjson`)
    .toString()
    .trim()
    .split('\n');

  const pkg = packages
    .map((p: string) => JSON.parse(p))
    .find((p) => p.name === name);

  if (!pkg) {
    throw new Error(`Package not found: ${name}`);
  }

  return path.join(local, path.relative(getMonorepoRoot(), pkg.location));
}
