import { Plugin } from '@design-systems/plugin';
import create, {
  CreateComponentArgs,
  CreateSystemArgs
} from '@design-systems/create';

/** A plugin to the CLI that run the create script */
export default class CreatePlugin
  implements Plugin<CreateComponentArgs | CreateSystemArgs> {
  async run(args: CreateComponentArgs | CreateSystemArgs) {
    create(args);
  }
}
