import * as React from 'react';
import { cleanup, render } from '@testing-library/react';
import { Portal } from '../portal';

afterEach(() => {
  cleanup()
})

test('it should render the content in a dom node outside of the parent', () => {
  const { getByTestId } = render(
    <div data-testid="root">
      <Portal>
        <div data-testid="portal">Rendered elsewhere</div>
      </Portal>
    </div>
  );

  expect(getByTestId('portal')).toBeInTheDocument();
  expect(
    getByTestId('root').querySelector('[data-testid="portal"]')
  ).not.toBeInTheDocument();
});

test('it should work with hydrate', () => {
  const options = { hydrate: true };
  const { getByTestId } = render(
    <div data-testid="root">
      <Portal>
        <div data-testid="portal">Rendered elsewhere</div>
      </Portal>
    </div>,
    options
  );
  expect(getByTestId('portal')).toBeInTheDocument();
});

test('it should clean up', () => {
  const { queryByTestId, unmount } = render(
    <div data-testid="root">
      <Portal>
        <div data-testid="portal">Rendered elsewhere</div>
      </Portal>
    </div>
  );
  expect(queryByTestId('portal')).toBeInTheDocument();
  unmount();
  expect(queryByTestId('portal')).toBeNull();
});
