import { Command } from 'command-line-application';

const cli: Command = {
  name: 'cli',
  description: 'Convert a directory of SVG files to wrapped React Components.',
  examples: ['icon --svg ./svg --out ./icons'],
  require: ['svg', 'out'],
  options: [
    {
      name: 'svg',
      type: String,
      description: 'The path to the directory of .svg files to convert.',
    },
    {
      name: 'template',
      type: String,
      description: 'The path to the template where the SVG will be added.',
    },
    {
      name: 'out',
      type: String,
      description: 'The directory to put the results in.',
    },
    {
      name: 'overwrite',
      type: Boolean,
      description: 'Overwrite output files that already exist.',
    },
    {
      name: 'no-mapping',
      type: Boolean,
      description: 'Whether to output a mapping file.',
      defaultValue: false,
    },
    {
      name: 'no-strip-color',
      type: Boolean,
      description: 'Whether to disable removing color from the SVGs',
      defaultValue: false,
    },
    {
      name: 'name-suffix',
      type: String,
      description: 'The suffix to put after the name of a generated icon',
      defaultValue: 'Icon',
    },
  ],
};

export default cli;
