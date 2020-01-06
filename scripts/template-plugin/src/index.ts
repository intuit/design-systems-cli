/* eslint-disable no-console */
import { createLogger } from '@design-systems/cli-utils';
import { Plugin } from '@design-systems/plugin';

export interface {{pascal}}Args {
  fix?: boolean;
}

export default class {{pascal}}Plugin implements Plugin<{{pascal}}Args> {
  private logger = createLogger({ scope: '{{kebab}}' })

  async run(args: {{pascal}}Args) {
  }
}
