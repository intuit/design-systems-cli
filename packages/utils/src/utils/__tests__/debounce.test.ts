import { debounce } from '../debounce';

test('it should call the function once', () => {
  jest.useFakeTimers();
  const spy = jest.fn();
  const callback = debounce(spy);

  callback();
  callback();
  callback();

  jest.runOnlyPendingTimers();
  expect(spy).toHaveBeenCalledTimes(1);
});

test('it should call the function immediately', () => {
  jest.useFakeTimers();
  const spy = jest.fn();
  const callback = debounce(spy, 100, true);

  callback();
  callback();
  callback();

  jest.runOnlyPendingTimers();
  expect(spy).toHaveBeenCalledTimes(1);
});
