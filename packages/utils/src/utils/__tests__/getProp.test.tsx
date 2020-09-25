import * as React from 'react';
import { getProp } from '../getProp';

test('it should get the prop', () => {
  const Text: React.FC<{ id: string }> = ({ children }) => (
    <div>{children}</div>
  );
  const instance = <Text id="foo" />;

  expect(getProp(instance, 'id')).toBe('foo');
});
