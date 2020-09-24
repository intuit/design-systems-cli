import * as React from 'react';
import { render } from '@testing-library/react';
import { styled } from '../styled';

test('it should return an element with the correct class - string', () => {
  const TestComponent = styled('section', 'css-class');
  const { container } = render(<TestComponent />);

  expect(container.firstChild).toHaveClass('css-class');
});

test('it should correctly apply another class', () => {
  const TestComponent = styled('section', 'css-class');
  const { container } = render(<TestComponent className="test" />);

  expect(container.firstChild).toHaveClass('css-class');
  expect(container.firstChild).toHaveClass('test');
});

test('it should return an element with the correct class', () => {
  const TestComponent = styled('section', {
    class: 'css-class',
    description: 'A simple test.',
    name: 'TestComponent'
  });
  const { container } = render(<TestComponent />);

  expect(container.firstChild).toHaveClass('css-class');
});

test('it should return an element with the correct display name', () => {
  const TestComponent = styled('section', {
    class: 'css-class',
    description: 'A simple test.',
    name: 'TestComponent'
  });

  expect(TestComponent.displayName).toBe('TestComponent');
});

test('it should return an element with the correct description', () => {
  const TestComponent = styled('section', {
    class: 'css-class',
    description: 'A simple test.',
    name: 'TestComponent'
  });

  expect(TestComponent.__docgenInfo!.description).toBe(
    'A simple test. This component accepts all HTML attributes for a "section" element.'
  );
});

test('it should return an element with h2', () => {
  const TestComponent = styled('div', {
    class: 'css-class',
    description: 'A simple test.',
    name: 'TestComponent'
  });

  const { container } = render(<TestComponent as="h2" />);
  expect(container.children[0].tagName).toBe('H2');
});

test('it should attach the slot', () => {
  const slot = Symbol('test');
  const TestComponent = styled('div', {
    class: 'css-class',
    description: 'A simple test.',
    name: 'TestComponent',
    slot
  });

  expect(TestComponent._SLOT_).toStrictEqual(slot);
});

test('should render as jsx element', () => {
  const TestComponent = styled('section', 'css-class');
  const { container } = render(<TestComponent as="span" />);

  expect(container.firstChild).toMatchSnapshot();
});

test('should render as custom element', () => {
  const MyLink = (props: any) => (
    <a href="foo" {...props}>
      link
    </a>
  );
  const TestComponent = styled('section', 'css-class');
  const { container } = render(<TestComponent as={MyLink} />);

  expect(container.firstChild).toMatchSnapshot();
});
