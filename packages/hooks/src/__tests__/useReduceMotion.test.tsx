import { renderHook } from '@testing-library/react-hooks';
import { useReducedMotion } from '../useReducedMotion';

test("it detect if reduced motion isn't set", () => {
  // @ts-ignore
  jest.spyOn(window, 'matchMedia').mockImplementation(() => ({
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn()
  }));

  const { result } = renderHook(() => useReducedMotion());
  expect(result.current).toBe(false);
});

test('it detect if reduced motion is set', () => {
  const addListener = jest.fn();
  const removeListener = jest.fn();
  // @ts-ignore
  jest.spyOn(window, 'matchMedia').mockImplementation(() => ({
    matches: true,
    addListener,
    removeListener
  }));

  const { result, unmount } = renderHook(() => useReducedMotion());

  expect(result.current).toBe(true);
  unmount();
  expect(removeListener).toHaveBeenCalled();
});
