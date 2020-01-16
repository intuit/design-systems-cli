import { createLogger } from '@design-systems/cli-utils';
import { Plugin } from '@design-systems/plugin';
import { CLIArguments, main } from '@proof-ui/cli';
import { getConfig } from '@proof-ui/config';

/**
 * The design-systems plugin for cross-browser integration testing through proof
 */
export default class ProofPlugin implements Plugin<CLIArguments> {
  private logger = createLogger({ scope: 'proof' });

  async run(args: CLIArguments) {
    try {
      const config = await getConfig();
      const results = await main({ config, args });

      if (results && results.failures) {
        process.exit(1);
      }
    } catch (e) {
      this.logger.error(e);
      process.exit(1);
    }
  }
}
