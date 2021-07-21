import * as React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { fireEvent, render } from '@testing-library/react';
import { useKeyboardNavigation } from '../useKeyboardNavigation';

test('defaults to false', () => {
  // @ts-ignore
  jest.spyOn(window, 'matchMedia').mockImplementation(() => ({
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn()
  }));

  const { result } = renderHook(() => useKeyboardNavigation());
  expect(result.current).toBe(false);
});

test('returns true when a user tabs', () => {
  const Test = () => {
    const isKeyboardNavigation = useKeyboardNavigation();
    // eslint-disable-next-line jest/no-if
    return isKeyboardNavigation ? <div data-testid="keyboardNav" /> : null;
  };

  const { getByTestId, queryByTestId } = render(
    <div data-testid="root">
      <Test />
    </div>
  );

  fireEvent.keyDown(getByTestId('root'), { key: 'Tab' });
  expect(queryByTestId('keyboardNav')).toBeDefined();
});
