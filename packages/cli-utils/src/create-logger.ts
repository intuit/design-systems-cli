import { Signale, DefaultMethods, SignaleOptions } from 'signale';

const logLevels = ['silent', 'info', 'debug', 'trace'] as const;
type LogLevel = typeof logLevels[number];

const LOG_LENGTH = 10;
let logLevel: LogLevel = 'info';

const options: SignaleOptions<
  DefaultMethods | 'skip' | 'trace' | 'debug' | 'done' | 'disable'
> = {
  types: {
    debug: {
      badge: '🦄',
      color: 'magenta',
      label: 'debug'
    },
    skip: {
      badge: '🤷',
      color: 'yellow',
      label: 'Skipping...'
    },
    trace: {
      badge: '🔊',
      color: 'gray',
      label: 'trace'
    },
    info: {
      badge: '💾',
      color: 'cyan',
      label: 'info'
    },
    note: {
      badge: '📝',
      color: 'blueBright',
      label: 'note'
    },
    complete: {
      badge: '🌟',
      color: 'green',
      label: 'complete'
    },
    await: {
      badge: '⏳',
      color: 'cyan',
      label: 'awaiting'
    },
    done: {
      badge: '🎉',
      color: 'greenBright',
      label: 'done'
    },
    error: {
      badge: '🚒',
      color: 'red',
      label: 'error'
    },
    pending: {
      badge: '🤞',
      color: 'magenta',
      label: 'pending'
    }
  }
};
const logger = new Signale(options);

/** Change the log level for the CLI. */
export function setLogLevel(v: LogLevel) {
  logLevel = v;
}

/** Get the current log level for the CLI. */
export function getLogLevel() {
  return logLevel;
}

/** Pad the scope string to our default length. */
export function padScope(s: string, size = LOG_LENGTH) {
  if (s.length === size) {
    return s;
  }

  if (s.length > size) {
    return `${s.substr(0, size - 3)}...`;
  }

  if (s.length < size) {
    return `${s}${'.'.repeat(size - s.length)}`;
  }

  return s;
}

/** Only call a function if the verbosity is high enough. */
function callIfVerbose(
  level: LogLevel,
  fn: (...args: string[]) => void,
  ...args: string[]
) {
  if (logLevels.indexOf(logLevel) >= logLevels.indexOf(level)) {
    return fn(...args);
  }
}

/** Create a logger scoped to a specific command. */
export function createLogger({
  scope,
  interactive
}: {
  /** A unique scope to identify your logs */
  scope: string;
  /** Create an interactive logger */
  interactive?: boolean;
}) {
  const scoped =
    interactive && logLevel !== 'trace' && logLevel !== 'debug'
      ? new Signale({ interactive: true, scope, ...options })
      : logger.scope(padScope(scope));
  const { trace, skip, debug } = scoped;

  if (logLevel === 'silent') {
    scoped.disable();
  }

  scoped.trace = (...args) => callIfVerbose('trace', trace, ...args);
  scoped.skip = (...args) => callIfVerbose('trace', skip, ...args);
  scoped.debug = (...args) => callIfVerbose('debug', debug, ...args);

  return scoped;
}
