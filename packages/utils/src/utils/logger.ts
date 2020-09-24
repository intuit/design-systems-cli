/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type logFunction = (message?: any, ...optionalParams: any[]) => void;

/** Noop version of a logging function */
// eslint-disable-next-line
const noop = (message?: any, ...optionalParams: any[]) => {};

/** Subset of console.log calls that are removed outside of development */
interface LoggerInterface {
  /**
   * The `console.debug()` function is an alias for {@link console.log()}.
   */
  debug: logFunction;
  /**
   * Prints to `stderr` with newline.
   */
  error: logFunction;
  /**
   * The {@link console.info()} function is an alias for {@link console.log()}.
   */
  info: logFunction;
  /**
   * Prints to `stdout` with newline.
   */
  log: logFunction;
  /**
   * The {@link console.warn()} function is an alias for {@link console.error()}.
   */
  warn: logFunction;
}

/** Logger which no-ops in production */
const noopLogger: LoggerInterface = {
  debug: noop,
  error: noop,
  info: noop,
  log: noop,
  warn: noop
};

/** Logger which returns console in development mode */
const consoleLogger: LoggerInterface = {
  debug: console.debug,
  error: console.error,
  info: console.info,
  log: console.log,
  warn: console.warn
};

/**
 * Logger
 * A logging utility which maps to console in development but
 * is a no-op in production.
 */
export const logger =
  process.env.NODE_ENV === 'development' ? consoleLogger : noopLogger;
