import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { useClickOutside } from '../useClickOutside';

test('it should return an element with the correct class - string', () => {
  const spy = jest.fn();
  const Test = () => {
    const ref = useClickOutside<HTMLDivElement>(spy);

    return (
      <div ref={ref} data-testid="target">
        Click outside of me
      </div>
    );
  };

  const { getByTestId } = render(
    <div data-testid="root">
      <Test />
    </div>
  );

  fireEvent.mouseUp(getByTestId('target'));
  expect(spy).toHaveBeenCalledWith(false);
  fireEvent.mouseUp(getByTestId('root'));
  expect(spy).toHaveBeenCalledWith(true);
});
