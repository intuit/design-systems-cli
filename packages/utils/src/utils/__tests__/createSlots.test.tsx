import * as React from 'react';
import { render } from '@testing-library/react';
import { createSlots, isSlotOf, getSlotToken } from '../createSlots';

const Header = ({ children }: { children: any }) => <div>{children}</div>;
Header._SLOT_ = Symbol('Header');

const Body = ({ children }: { children: any }) => <div>{children}</div>;
Body._SLOT_ = Symbol('Body');

const Footer = ({ children }: { children: any }) => <div>{children}</div>;
Footer._SLOT_ = Symbol('Footer');

const OtherFooter = ({ children }: { children: any }) => (
  <span>{children}</span>
);

OtherFooter._SLOT_ = Footer._SLOT_;

class ClassComp extends React.Component {
  static _SLOT_ = Symbol('ClassComp');

  render() {
    return <div>foo</div>;
  }
}

interface CardProps {
  header?: React.ReactNode;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  children?: any;
}

const Card: React.FC<CardProps> = props => {
  const { header, body, footer } = createSlots(props, {
    header: Header,
    body: Body,
    footer: Footer
  });

  return (
    <div>
      {header}
      {body}
      {footer}
    </div>
  );
};

const SymbolCard = (props: CardProps) => {
  const { header, body, footer } = createSlots(props, {
    header: Header._SLOT_,
    body: Body._SLOT_,
    footer: Footer._SLOT_
  });

  return (
    <div>
      {header}
      {body}
      {footer}
    </div>
  );
};

test('it should order the elements correctly', () => {
  const { container } = render(
    <Card>
      <Footer>bottom</Footer>
      <Body>middle</Body>
      <Header>top</Header>
    </Card>
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('it should gather all instances into one bucket', () => {
  const { container } = render(
    <Card>
      <Footer>bottom</Footer>
      <Body>I</Body>
      <Body>have</Body>
      <Body>lots</Body>
      <Body>of</Body>
      <Body>bodies.</Body>
      <Header>top</Header>
    </Card>
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('it should pass through non slot related props', () => {
  const { className } = createSlots(
    { className: 'foo' },
    {
      header: Header,
      body: Body,
      footer: Footer
    }
  );

  expect(className).toBe('foo');
});

test('it should omit props', () => {
  const { className } = createSlots(
    { className: 'foo' },
    {
      header: Header,
      body: Body,
      footer: Footer
    },
    ['className']
  );

  expect(className).toBeUndefined();
});

test('it should slot props', () => {
  const { header } = createSlots(
    { header: 'foo' },
    {
      header: Header,
      body: Body,
      footer: Footer
    }
  );

  expect(header).toMatchSnapshot();
});

test('it should pass through extra children', () => {
  const { children } = createSlots(
    { children: 'foo' },
    {
      header: Header,
      body: Body,
      footer: Footer
    }
  );

  expect(children).toStrictEqual(['foo']);
});

test('it should allow an array of components', () => {
  interface WithHeader {
    header?: React.ReactNode;
    children?: React.ReactNode;
  }

  const { header } = createSlots<WithHeader>(
    { children: <Footer>Foot</Footer> },
    {
      header: [Header, Footer]
    }
  );

  expect(header).not.toBeUndefined();
});

describe('slots using tokens', () => {
  test('it should find all the slots', () => {
    const { container } = render(
      <SymbolCard>
        <Footer>bottom</Footer>
        <Body>middle</Body>
        <Header>top</Header>
      </SymbolCard>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('it should throw an error if creating an instance of a Symbol slot', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const renderComp = () =>
      render(
        <SymbolCard footer="footer">
          <Body>middle</Body>
          <Header>top</Header>
        </SymbolCard>
      );

    expect(renderComp).toThrow();
  });
});

describe('isSlotOf', () => {
  test('works with react comps', () => {
    expect(isSlotOf(<Footer>test</Footer>, Footer)).toBe(true);
  });

  test('works with Symbols', () => {
    expect(isSlotOf(<Footer>test</Footer>, Footer._SLOT_)).toBe(true);
  });

  test('works with classes', () => {
    expect(isSlotOf(<ClassComp>test</ClassComp>, ClassComp)).toBe(true);
    expect(isSlotOf(<ClassComp>test</ClassComp>, ClassComp._SLOT_)).toBe(true);
  });

  test('finds another component with the same token', () => {
    expect(isSlotOf(<OtherFooter>bar</OtherFooter>, Footer)).toBe(true);
    expect(isSlotOf(<OtherFooter>bar</OtherFooter>, Footer._SLOT_)).toBe(true);
  });
});

describe('getSlotToken', () => {
  it('works on instances', () => {
    expect(getSlotToken(<Footer>foo</Footer>)).toBe(Footer._SLOT_);
    expect(getSlotToken(<OtherFooter>bar</OtherFooter>)).toBe(Footer._SLOT_);
    expect(getSlotToken(<ClassComp />)).toBe(ClassComp._SLOT_);
  });

  it('works on components', () => {
    expect(getSlotToken(Footer)).toBe(Footer._SLOT_);
    expect(getSlotToken(OtherFooter)).toBe(Footer._SLOT_);
    expect(getSlotToken(ClassComp)).toBe(ClassComp._SLOT_);
  });
});
