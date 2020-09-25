/* eslint-disable max-classes-per-file */

import * as React from 'react';
import { isReactInstanceOf } from '../isReactInstanceOf';

test('it determine if the child is an instance - Function Component', () => {
  const Text = () => <div>foo</div>;
  const instance = <Text />;

  expect(isReactInstanceOf(instance, Text)).toBe(true);
});

test('it determine if the child is not an instance - Function Component', () => {
  const Test = () => <div>foo</div>;
  const instance = <div>bar</div>;

  expect(isReactInstanceOf(instance, Test)).toBe(false);
});

test('it determine if the child is an instance - Class Component', () => {
  class Test extends React.Component {
    render() {
      return <div>foo</div>;
    }
  }

  const instance = <Test />;

  expect(isReactInstanceOf(instance, Test)).toBe(true);
});

test('it determine if the child is not an instance - Class Component', () => {
  class Test extends React.Component {
    render() {
      return <div>foo</div>;
    }
  }

  const instance = <div>bar</div>;

  expect(isReactInstanceOf(instance, Test)).toBe(false);
});

test('handles non function', () => {
  const instance = <div>bar</div>;

  // @ts-ignore
  expect(isReactInstanceOf(instance, {})).toBe(false);
});
