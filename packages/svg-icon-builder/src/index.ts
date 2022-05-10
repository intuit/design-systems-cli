/* eslint prefer-regex-literals: 0 */
import { app } from 'command-line-application';
import path from 'path';
import fs from 'fs-extra';
import SVGO from 'svgo';
import endent from 'endent';
import changeCase from 'change-case';
import maxstache from 'maxstache';
import logger from './logger';
import cli from './cli';

export interface IconOptions {
  /** The fill of the SVG being processed */
  fill?: string;
  /** The SVG being processed. */
  svg?: string;
  /** The viewBox of the SVG being processed. */
  viewBox?: string;
  /** pascalCase icon name. */
  pascalCase?: string;
  /** TitleCase icon name. */
  titleCase?: string;
  /** param-case icon name. */
  paramCase: string;
  /** FullIcon name. */
  iconName?: string;
  /** Amount of bytes removed during processing. */
  iconSavings?: number;
}

const generatedWarning =
  '/* Warning: this file is generated using svg-icon-builder */';

/**
 * Get the list of SVG files in the provided directory.
 *
 * @param directory - Directory where SVGs are stored.
 */
export const getSVGFiles = (directory: string): string[] => {
  // Get files
  const filenames: string[] = [];
  fs.readdirSync(directory).forEach((file) => {
    if (file.slice(-4) === '.svg') {
      filenames.push(file);
    }
  });
  return filenames;
};

interface GetTransformedSvg {
  /** Remove color from SVG */
  stripColor: boolean;
}

/**
 * Do the bulk of SVG processing through SVGO and regex.
 *
 * @param svgPath - path to SVG directory.
 * @param svgFile - file name of SVG to read and process.
 */
export const getTransformedSvg = async (
  svgPath: string,
  svgFile: string,
  options: GetTransformedSvg
) => {
  const icon: IconOptions = {
    paramCase: svgFile.slice(0, -4),
  };
  icon.svg = await fs.readFile(path.join(svgPath, svgFile), 'utf8');
  const size = Buffer.byteLength(icon.svg, 'utf8');
  const removeAttrs = [
    options.stripColor && 'fill',
    options.stripColor && 'stroke',
    'class',
  ].filter((v) => typeof v === 'string');
  // Run through SVGO
  const svgoOptions: SVGO.Options = {
    plugins: [
      { removeViewBox: false },
      {
        removeAttrs: {
          attrs: removeAttrs,
        },
      },
      { removeStyleElement: true },
      {
        prefixIds: {
          prefix: () => svgFile.split('.')[0],
        },
      },
    ],
  };

  const svgo = new SVGO(svgoOptions);

  // Run multiple times to maximize plugin checks
  for (let i = 0; i < 5; i++) {
    const result = svgo.optimize(icon.svg || '');
    // eslint-disable-next-line
    let optimized = await result;
    if (icon.svg === optimized.data) {
      break;
    }

    icon.svg = optimized.data;
  }

  // Replace any invalid JSX attributes
  const invalidAttributes = [
    "stroke-miterlimit",
    "stroke-dasharray",
    "clip-path",
    "fill-opacity",
    "fill-rule",
    "clip-rule",
    "stop-color",
    "stroke-width",
    "stroke-linecap",
    "stroke-linejoin"
  ];

  invalidAttributes.forEach((attribute) => {
    icon.svg = icon.svg?.replace(
      new RegExp(attribute, "g"),
      changeCase.camelCase(attribute)
    );
  });

  // xlink:href has been deprecated for href
  icon.svg = icon.svg.replace(/xlink:href/g, 'href');

  // Get the attributes for the SVG element
  const svgAttributesKeys = ["viewBox", "fill"] as const;

  svgAttributesKeys.forEach((attribute) => {
    const regex = new RegExp('fill="(.*?)"');
    const match = icon.svg?.match(regex);

    if (match && match.length > 1) {
      // eslint-disable-next-line
      icon[attribute] = match[1];
    }
  })

  // Unwrap SVG
  const regex = new RegExp('<svg[\\s\\S]*?>');
  const tag = icon.svg.match(regex);
  if (tag) {
    icon.svg = icon.svg.replace(tag[0], '');
    icon.svg = icon.svg.replace('</svg>', '');
  }

  icon.iconSavings = size - Buffer.byteLength(icon.svg, 'utf8');

  return icon;
};

/**
 * Create a mapping file from string to icon component.
 *
 * @param icons - List of icons that were processed.
 * @param outPath - Path to where processed SVGs were stored. (For relative imports)
 */
export const generateMapping = (icons: IconOptions[], outPath: string) => {
  // Create imports and mappings
  const imports = [];
  const mappings = [];
  const names: string[] = [];

  for (const svg of icons) {
    imports.push(`import ${svg.iconName} from './${svg.iconName}';`);
    mappings.push(`'${svg.paramCase}': ${svg.iconName},`);
    names.push(svg.paramCase);
  }

  const result = endent`
    ${generatedWarning}

    ${imports.join('\n')}

    export const mappings = {
      ${mappings.join('\n')}
    } as const;

    export const names = ${JSON.stringify(names)} as const;

    export type IconName = typeof names[number];
    
  `;

  const resultPath = `${outPath}/mappings.ts`;
  logger.info(`Writing mapping file ${resultPath}`);
  fs.writeFile(resultPath, result);
};

/**
 * Generate file which exports all generated icons.
 *
 * @param icons - List of icons that were processed.
 * @param outPath - Path to where processed SVGs were stored. (For relative imports)
 */
export const generateExports = (icons: IconOptions[], outPath: string) => {
  // Create imports and mappings
  const imports = [];
  for (const svg of icons) {
    imports.push(
      `export { default as ${svg.iconName} } from './${svg.iconName}';`
    );
  }

  const result = endent`
    ${generatedWarning}

    ${imports.join('\n')}
  `;
  const resultPath = `${outPath}/exports.ts`;
  logger.info(`Writing exports file ${resultPath}`);
  fs.writeFile(resultPath, result);
};

/**
 * Run the process of generating icons, mappings, and exports based on CLI arguments.
 *
 * @param args - arguments from CLI
 */
export const buildComponents = async (args: Args) => {
  let savings = 0;
  // Check path
  const p = path.join(process.cwd(), args.svg);

  if (!fs.existsSync(p)) {
    logger.fatal(new Error(`${args.svg} does not exist.`));
    process.exit(1);
  }

  // Get SVG names
  const svgs = getSVGFiles(p);
  const promises = svgs.map((svg) => {
    return getTransformedSvg(p, svg, {
      stripColor: !args.noStripColor,
    });
  });
  const icons = await Promise.all(promises);

  for (const svg of icons) {
    savings += svg.iconSavings || 0;
    // Do case conversions
    const isUpperCase = changeCase.isUpperCase(svg.paramCase);
    svg.pascalCase = isUpperCase
      ? svg.paramCase
      : changeCase.pascalCase(svg.paramCase).replace(/_/g, '');
    svg.titleCase = isUpperCase
      ? svg.paramCase
      : changeCase.titleCase(svg.paramCase);
    svg.iconName = `${svg.pascalCase}${args.nameSuffix}`;
    // lowercase for string map
    svg.paramCase = changeCase.lowerCase(svg.paramCase);
    // Read template and write to file
    const templatePath =
      args.template || path.join(__dirname, './icon.template');
    const template = fs.readFileSync(templatePath, 'utf8');
    const result = endent`
      ${generatedWarning}
      ${maxstache(template, svg)}
    `;

    const outPath = path.join(process.cwd(), args.out);

    if (!fs.existsSync(outPath)) {
      fs.mkdirSync(outPath);
    }

    const filePath = path.join(outPath, `${svg.iconName}.tsx`);

    if (!fs.existsSync(filePath) || args.overwrite) {
      logger.info(`Writing ${filePath}.`);
      fs.writeFile(filePath, result);
    } else {
      logger.skip('Skipped', filePath, 'use --overwrite to overwrite.');
    }
  }

  savings = Math.round(savings / 1024);
  logger.success(`Saved ${savings} KB!`);
  if (!args.noMapping) {
    generateMapping(icons, args.out);
  }

  generateExports(icons, args.out);
  logger.done('Build finished.');
};

interface Args {
  /** Path to the SVG directory */
  svg: string;
  /** Path to the template */
  template: string;
  /** Path to write output */
  out: string;
  /** Whether to overwrite existing files */
  overwrite: boolean;
  /** Whether to write mapping file */
  noMapping: boolean;
  /** Whether strip color from the SVGs */
  noStripColor: boolean;
  /** The suffix to put after the name of a generated icon */
  nameSuffix: boolean;
}

// Start the app
const args = app(cli) as Args;

if (args) {
  buildComponents(args);
} else {
  logger.fatal(new Error('Unable to parse arguments.'));
}
