import { renderHook } from '@testing-library/react-hooks';
import { usePrefersHighContrast } from '../usePrefersHighContrast';

test('it detect if prefers contrast more is set', () => {
  // @ts-ignore
  jest.spyOn(window, 'matchMedia').mockImplementation(() => ({
    matches: true,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));

  const { result } = renderHook(() => usePrefersHighContrast());
  expect(result.current).toBe(true);
});

test('it detect if prefers contrast less  is set', () => {
  const addListener = jest.fn();
  const removeListener = jest.fn();
  // @ts-ignore
  jest.spyOn(window, 'matchMedia').mockImplementation(() => ({
    matches: false,
    addListener,
    removeListener,
  }));

  const { result, unmount } = renderHook(() => usePrefersHighContrast());

  expect(result.current).toBe(false);
  unmount();
  expect(removeListener).toHaveBeenCalled();
});
