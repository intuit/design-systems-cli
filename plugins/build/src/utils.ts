import path from 'path';
import colorette from 'colorette';

/** Convert a path to its output destination. */
export function getOutPath(
  inDir: string,
  fPath: string,
  outDir: string
): string {
  return path.join(outDir, path.relative(inDir, path.dirname(fPath)));
}

interface FormatErrorOptions {
  /** File the error is in */
  file: string;
  /** Line the error is on */
  line: string;
  /** Column in line the error is on */
  column: string;
  /** Tool used to create error. */
  tool: string;
  /** Message for the error */
  message: string;
  /** Source code where the error is */
  code: string;
}

/** Format an error in a Typescript style so they match across tools */
export function formatError({
  file,
  line,
  column,
  tool,
  message,
  code
}: FormatErrorOptions) {
  return `${colorette.cyanBright(
    path.relative(process.env.INIT_CWD || process.cwd(), file)
  )}:${colorette.yellowBright(line)}:${colorette.yellowBright(
    column
  )} - ${colorette.redBright('error')} ${colorette.dim(
    tool
  )}: ${message.trim()}\n${code.trim()}`;
}
