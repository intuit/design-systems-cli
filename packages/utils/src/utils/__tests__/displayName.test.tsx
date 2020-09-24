import * as React from 'react';
import { displayName } from '../displayName';

test('it should attach the name', () => {
  const Text: React.FC<{}> = ({ children }) => <div>{children}</div>;
  expect(displayName(Text, 'MyName').displayName).toBe('MyName');
});
