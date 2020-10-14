import { logger } from '../logger';

const log = jest.spyOn(global.console, 'log');

test('Log is noop when not in development', () => {
  logger.log('Testing!');
  expect(log).not.toHaveBeenCalled();
});
