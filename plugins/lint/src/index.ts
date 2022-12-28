import {
  createLogger,
} from '@design-systems/cli-utils';
import { Plugin } from '@design-systems/plugin';
import { lintJS, lintCSS } from './utils/lintUtils';
import {LintArgs} from './interfaces';

const logger = createLogger({ scope: 'lint' });

/** A plugin to lint the project's files for errors. */
export default class LintPlugin implements Plugin<LintArgs> {
  async run(args: LintArgs) {
    if (process.env.CLI_APP_ID && process.env.CLI_PRIVATE_KEY) {
      process.env.ESLINT_APP_ID =
        process.env.ESLINT_APP_ID || process.env.CLI_APP_ID;
      process.env.ESLINT_PRIVATE_KEY =
        process.env.ESLINT_PRIVATE_KEY || process.env.CLI_PRIVATE_KEY;

      process.env.STYLELINT_APP_ID =
        process.env.STYLELINT_APP_ID || process.env.CLI_APP_ID;
      process.env.STYLELINT_PRIVATE_KEY =
        process.env.STYLELINT_PRIVATE_KEY || process.env.CLI_PRIVATE_KEY;
    }

    try {
      const jsReturnCode = await lintJS(args);
      const cssReturnCode = await lintCSS(args);
      logger.debug({ jsReturnCode, cssReturnCode });

      if (jsReturnCode + cssReturnCode > 0) {
        process.exit(1);
      }
    } catch (e) {
      logger.error(e);
      process.exit(1);
    }
  }
}
