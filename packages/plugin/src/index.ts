import {
  MultiCommand as AppMultiCommand,
  Command as AppCommand,
  Option as AppOption
} from 'command-line-application';
import { Overwrite } from 'utility-types';

/** An Option for the @design-systems/cli */
export type Option = AppOption & {
  /** Whether the Option should be configurable via ds.config.json */
  config?: boolean;
  /** Whether or not the option is available in the global or local scope */
  scope?: string;
};

interface Configurable {
  /** Options for the @design-systems/cli */
  options?: Option[];
}

/** An Command for the @design-systems/cli */
export type Command = Overwrite<AppCommand, Configurable>;

/** An multi command for the @design-systems/cli */
export type MultiCommand = Overwrite<
  Overwrite<AppMultiCommand, Configurable>,
  {
    /** Commands for the @design-systems/cli multi command */
    commands: CliCommand[];
  }
>;

/** Register a command with the cli */
export type CliCommand = Command | MultiCommand;

/** A plugin to the @design-systems/cli */
export interface Plugin<T = unknown> {
  /** Ran when the user inputs the registered command */
  run(args: T): Promise<void>;
}
