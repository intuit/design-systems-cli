import * as React from 'react';
import { cleanup, render } from '@testing-library/react';
import moveFocusInside, { focusInside } from 'focus-lock';

import { FocusLock } from '../focus-lock';

jest.mock('focus-lock', () => ({
  __esModule: true,
  default: jest.fn(),
  focusInside: jest.fn()
}));

const moveFocusInsideMock = moveFocusInside as jest.Mock;
const focusInsideMock = focusInside as jest.Mock;

beforeEach(() => {
  jest.useFakeTimers();
  moveFocusInsideMock.mockReset();
  focusInsideMock.mockReset();
  focusInsideMock.mockReturnValue(false);
});

afterEach(() => {
  cleanup();
  jest.clearAllTimers();
  jest.useRealTimers();
});

test('it should move focus inside when activated', () => {
  const { getByTestId } = render(
    <FocusLock active data-testid="lock">
      <button type="button">Focusable</button>
    </FocusLock>
  );

  jest.advanceTimersByTime(50);

  expect(moveFocusInsideMock).toHaveBeenCalledTimes(1);
  expect(moveFocusInsideMock).toHaveBeenCalledWith(
    getByTestId('lock'),
    document.activeElement
  );
});

test('it should not move focus after an unrelated rerender', () => {
  const { rerender } = render(
    <FocusLock active data-testid="lock" data-render="first" />
  );

  jest.advanceTimersByTime(50);
  expect(moveFocusInsideMock).toHaveBeenCalledTimes(1);

  rerender(<FocusLock active data-testid="lock" data-render="second" />);
  jest.runOnlyPendingTimers();

  expect(moveFocusInsideMock).toHaveBeenCalledTimes(1);
});

test('it should cancel a pending focus change when deactivated', () => {
  const { rerender } = render(<FocusLock active data-testid="lock" />);

  rerender(<FocusLock active={false} data-testid="lock" />);
  jest.runOnlyPendingTimers();

  expect(moveFocusInsideMock).not.toHaveBeenCalled();
});

test('it should cancel a pending focus change when unmounted', () => {
  const { unmount } = render(<FocusLock active data-testid="lock" />);

  unmount();
  jest.runOnlyPendingTimers();

  expect(moveFocusInsideMock).not.toHaveBeenCalled();
});
