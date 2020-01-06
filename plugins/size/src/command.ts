import { CliCommand } from '@design-systems/plugin';

const command: CliCommand = {
  name: 'size',
  description:
    'Determine how the bundle size will be affected by your changes.',
  examples: [
    {
      example: 'ds size',
      desc:
        'Determine the size changes for changed component or a single component'
    },
    {
      example: 'ds size --css --diff',
      desc:
        'Show the size differences of both the CSS + JS and open a diff of the changes.'
    },
    {
      example: 'ds size --ignore @foo/bar @foo/baz',
      desc: 'Ignore the sizes of packages @foo/bar and @foo/baz'
    }
  ],
  options: [
    {
      name: 'analyze',
      type: Boolean,
      description: "Open 'webpack-bundle-analyzer' for each bundle"
    },
    {
      name: 'css',
      type: Boolean,
      description: 'Show separate diffs for the JS and CSS',
      config: true
    },
    {
      name: 'detailed',
      type: Boolean,
      description: 'Show the cost of each of a package exports'
    },
    {
      name: 'persist',
      type: Boolean,
      description: 'Move bundles to CWD with stats.json.'
    },
    {
      name: 'diff',
      type: Boolean,
      description:
        'Run a diff of the resulting directories and open it in a browser. Output will be persisted. Only run on single package'
    },
    {
      name: 'ci',
      type: Boolean,
      description: 'Only output the result as markdown.'
    },
    {
      name: 'all',
      type: Boolean,
      description: 'Ignore git changes and calculate sizes for all packages'
    },
    {
      name: 'ignore',
      alias: 'i',
      type: String,
      multiple: true,
      description: 'Package names to ignore',
      config: true
    },
    {
      name: 'comment',
      type: Boolean,
      description:
        'Comment on the Pull request with the results. (Only from CI + must set env var GH_TOKEN. In jenkins OWNER and REPO must also be set. In enterprise you must also set GITHUB_URL)',
      config: true
    }
  ]
};

export default command;
