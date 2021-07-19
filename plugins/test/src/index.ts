import { createLogger } from '@design-systems/cli-utils';
import { Plugin } from '@design-systems/plugin';
import env from 'env-ci';

// eslint-disable-next-line jest/no-jest-import
import { runCLI } from 'jest';
import createJestAnnotations from 'jest-github-reporter/dist/create-check';

export interface TestArgs {
  /** Update the test snapshots */
  update?: boolean;
  /** Run the tests in watch mode */
  watch?: boolean;
  /** Post lint results as annotations to PR. Only in CI. */
  annotate?: boolean;
  /** Array of files, directories, or globs to find tests */
  files?: string[];
    /** Run all tests serially in the current process, */
  runInBand?: boolean;
}

/** A plugin to run tests. */
export default class TestPlugin implements Plugin<TestArgs> {
  private logger = createLogger({ scope: 'test' });

  async run(args: TestArgs) {
    process.env.NODE_ENV = 'test';

    if (process.env.CLI_APP_ID && process.env.CLI_PRIVATE_KEY) {
      process.env.JEST_APP_ID =
        process.env.JEST_APP_ID || process.env.CLI_APP_ID;
      process.env.JEST_PRIVATE_KEY =
        process.env.JEST_PRIVATE_KEY || process.env.CLI_PRIVATE_KEY;
    }

    const annotate = Boolean(
      args.annotate || (process.env.CLI_APP_ID && process.env.CLI_PRIVATE_KEY)
    );

    try {
      console.log('dev mode runCLI');
      const { results } = await runCLI(
        {
          _: [],
          $0: 'jest',
          updateSnapshot: args.update,
          watch: args.watch,
          testPathPattern: args.files,
          ci: env().isCi,
          runInBand: args.runInBand
        },
        [process.cwd()]
      );

      if (annotate) {
        await createJestAnnotations(results);
      }

      if (results.numFailedTests > 0) {
        process.exit(1);
      }
    } catch (e) {
      this.logger.error(e);
      process.exit(1);
    }
  }
}
