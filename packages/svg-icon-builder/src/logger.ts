import { Signale, DefaultMethods, SignaleOptions } from 'signale';

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
    info: {
      badge: '💾',
      color: 'cyan',
      label: 'info'
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
    }
  }
};
const Logger = new Signale(options);
export default Logger;
