import path from 'path';
import { readFileSync } from 'fs';

import getMonorepoRoot from './get-monorepo-root';

export interface LernaStuff {
  /** The version of the monorepo */
  version: string;
  /** The location of lerna.json */
  configLocation: string;
  /** The config inside lerna.json */
  config: Record<string, string>;
}

/** Get the lerna config and its location. */
export default function lerna(): LernaStuff | undefined {
  const monorepoRoot = getMonorepoRoot();

  if (!monorepoRoot) {
    return;
  }

  const lernaConfigFile = path.join(monorepoRoot, 'lerna.json');
  const lernaConfig: Record<string, string> = JSON.parse(
    readFileSync(lernaConfigFile, 'utf-8')
  );

  return {
    configLocation: lernaConfigFile,
    version: lernaConfig.version,
    config: lernaConfig
  };
}
