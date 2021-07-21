import * as React from 'react';
import { render, act } from '@testing-library/react';
import { useStickyState } from '../useStickyState';

test('it should detect when an element is not sticking', () => {
  jest.useFakeTimers();
  const Test = () => {
    const ref = React.useRef<HTMLDivElement>(null);
    const isSticky = useStickyState(ref);

    return (
      <div
        ref={ref}
        data-testid="target"
        style={{ position: 'sticky', top: 0 }}
      >
        {isSticky ? 'sticky' : 'not sticky'}
      </div>
    );
  };

  const { container } = render(
    <div data-testid="root" style={{ height: 1000 }}>
      <Test />
    </div>
  );

  act(() => {
    jest.runOnlyPendingTimers();
  });

  expect(container.firstChild).toMatchSnapshot();
});

test('it should detect when an element is sticking', () => {
  jest.useFakeTimers();
  const Test = () => {
    const ref = React.useRef<HTMLDivElement>(null);
    const isSticky = useStickyState(ref);

    return (
      <div
        ref={ref}
        data-testid="target"
        style={{ position: 'sticky', top: 10 }}
      >
        {isSticky ? 'sticky' : 'not sticky'}
      </div>
    );
  };

  const { container } = render(
    <div data-testid="root" style={{ height: 1000 }}>
      <Test />
    </div>
  );

  act(() => {
    jest.runOnlyPendingTimers();
  });

  expect(container.firstChild).toMatchSnapshot();
});
