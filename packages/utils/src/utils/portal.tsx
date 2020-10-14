import * as React from 'react';
import * as ReactDOM from 'react-dom';

const PortalContext = React.createContext<HTMLElement | undefined>(undefined);

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

/**
 * Create a div to use as a portal.
 *
 * @param containerRef - A dom node to attach the portal to, defaults to body
 */
const usePortal = (containerRef?: React.MutableRefObject<HTMLElement>) => {
  // Container to render portal into
  // Uses state because the Portal component needs to re-render once the portal element is created
  const [rootElemRef, rootElemRefSet] = React.useState<HTMLElement | null>(
    null
  );
  const context = React.useContext(PortalContext);

  // SSR guard
  useIsomorphicLayoutEffect(() => {
    if (typeof document !== 'undefined') {
      rootElemRefSet(document.createElement('div'));
    }
  }, []);

  React.useEffect(() => {
    if (!rootElemRef) {
      return;
    }

    const parent =
      context || (containerRef && containerRef.current) || document.body;

    parent.appendChild(rootElemRef);

    return () => {
      if (rootElemRef && rootElemRef.parentNode) {
        rootElemRef.parentNode.removeChild(rootElemRef);
      }
    };
  }, [rootElemRef, containerRef, context]);

  return rootElemRef;
};

interface PortalProps {
  /** A ref to the portal's container */
  containerRef?: React.MutableRefObject<HTMLElement>;
  /** The content to render in a portal */
  children: React.ReactNode;
}

/**
 * Render an element inside of a portal.
 *
 * @example
 * const Example = () => (
 *   <Portal>
 *     {'I am rendered at the end of the dom'}
 *   </Portal>
 * )
 */
export const Portal = React.forwardRef(
  (props: PortalProps, ref: React.Ref<HTMLElement>) => {
    const { containerRef, children } = props;
    const portalElement = usePortal(containerRef);

    // SSR Guard
    if (!portalElement) {
      return null;
    }

    if (typeof ref === 'function') {
      ref(portalElement);
    } else if (ref) {
      // eslint-disable-next-line no-param-reassign
      (ref as React.MutableRefObject<HTMLElement>).current = portalElement;
    }

    const portal = ReactDOM.createPortal(
      <PortalContext.Provider value={portalElement}>
        {children}
      </PortalContext.Provider>,
      portalElement
    );

    return portal;
  }
);
