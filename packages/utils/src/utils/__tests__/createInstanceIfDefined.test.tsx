import * as React from 'react';
import { createInstanceIfDefined } from '../createInstanceIfDefined';

test('it should create the instance', () => {
  const Text: React.FC = ({ children }) => <div>{children}</div>;

  expect(createInstanceIfDefined('A string', Text)).toMatchSnapshot();
});

test('it not create the instance', () => {
  const Text: React.FC = ({ children }) => <div>{children}</div>;

  expect(createInstanceIfDefined(null, Text)).toBeUndefined();
});
