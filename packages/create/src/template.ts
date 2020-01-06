import colorette from 'colorette';
import terminalLink from 'terminal-link';

import installedTemplates from './templates.json';

export const creationChoices = ['component', 'system', 'package'] as const;
export type CreationChoice = typeof creationChoices[number];

export interface Template {
  /** The name of the template */
  name: string;
  /** URL to the github repository that contains the template */
  url: string;
  /** A short description of what the template does */
  description: string;
  /** The commit sha of the version to clone */
  sha: string;
}

export const templates: Record<CreationChoice, Template[]> = installedTemplates;

/** Get the matching template for the creation type and name */
export function getTemplate(
  type: CreationChoice,
  name: string,
  userTemplates: Template[] = []
) {
  const allTemplates = [...userTemplates, ...templates[type]];
  const template = allTemplates.find(t => t.name === name);

  if (template) {
    return `${template.url}#${template.sha}`;
  }

  return name;
}

const colorOrder = [
  'green',
  'cyan',
  'magenta',
  'gray',
  'yellow',
  'greenBright',
  'redBright',
  'yellowBright',
  'blueBright',
  'magentaBright',
  'cyanBright'
] as const;

/** List all the available templates for a creation type */
export function listTemplates(
  type: CreationChoice,
  defaultTemplate = 'ts',
  userTemplates: Template[] = []
) {
  const allTemplates = [...userTemplates, ...templates[type]];
  let output = `Available templates for "${type}":\n\n`;

  [
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    allTemplates.find(t => t.name === defaultTemplate)!,
    ...allTemplates.filter(t => t.name !== defaultTemplate)
  ].forEach((template, index) => {
    const color = colorette[colorOrder[index % colorOrder.length]];

    output += terminalLink.isSupported
      ? `  ${color(terminalLink(template.name, template.url))}`
      : `  ${color(template.name)}`;

    output += ` - ${template.description}`;

    if (template.name === defaultTemplate) {
      output += ' [DEFAULT]';
    }

    if (!terminalLink.isSupported) {
      output += ` (${template.url})`;
    }

    output += '\n';
  });

  return output;
}
