import * as React from 'react';
import { render } from '@testing-library/react';
import { FocusLock } from '../focus-lock';

jest.useFakeTimers();

test('it should clean up timeouts when unmounting', () => {
  /* Considers the timer added by react-dom */
  const expectedTimerCount = 1;
  const { unmount } = render(<FocusLock active />);

  unmount();

  expect(jest.getTimerCount()).toBe(expectedTimerCount);
});
