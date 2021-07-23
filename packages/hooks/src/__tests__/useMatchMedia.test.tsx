import { renderHook } from '@testing-library/react-hooks';
import { useMatchMedia } from '../useMatchMedia';

test("it detect if media preference isn't set", () => {
  // @ts-ignore
  jest.spyOn(window, 'matchMedia').mockImplementation(() => ({
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));

  const { result } = renderHook(() =>
    useMatchMedia('(prefers-reduced-motion: reduce)')
  );
  expect(result.current).toBe(false);
});

test('it detect if media preference is set', () => {
  const addListener = jest.fn();
  const removeListener = jest.fn();
  // @ts-ignore
  jest.spyOn(window, 'matchMedia').mockImplementation(() => ({
    matches: true,
    addListener,
    removeListener,
  }));

  const { result, unmount } = renderHook(() =>
    useMatchMedia('(prefers-reduced-motion: reduce)')
  );

  expect(result.current).toBe(true);
  unmount();
  expect(removeListener).toHaveBeenCalled();
});
