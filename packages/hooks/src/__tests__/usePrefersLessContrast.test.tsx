import { renderHook } from '@testing-library/react-hooks';
import { usePrefersLessContrast } from '../usePrefersLessContrast';

test('it detect if prefers contrast more is set', () => {
  // @ts-ignore
  jest.spyOn(window, 'matchMedia').mockImplementation(() => ({
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));

  const { result } = renderHook(() => usePrefersLessContrast());
  expect(result.current).toBe(false);
});

test('it detect if prefers contrast less  is set', () => {
  const addListener = jest.fn();
  const removeListener = jest.fn();
  // @ts-ignore
  jest.spyOn(window, 'matchMedia').mockImplementation(() => ({
    matches: true,
    addListener,
    removeListener,
  }));

  const { result, unmount } = renderHook(() => usePrefersLessContrast());

  expect(result.current).toBe(true);
  unmount();
  expect(removeListener).toHaveBeenCalled();
});
