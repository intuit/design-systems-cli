import * as React from "react";
import { createPopperLite } from "@popperjs/core";
import useLayoutEffect from "use-isomorphic-layout-effect";
import { fromEntries } from "@design-systems/utils";

import type {
  Options as PopperOptions,
  Instance,
  State as PopperState,
} from "@popperjs/core";
import isEqual from "react-fast-compare";

const defaultPopperOptions: PopperOptions = {
  placement: "bottom",
  strategy: "absolute",
  modifiers: [],
};

/**
 * A lightweight usePopper hook. This hooks has the same API as "react-popper
 *
 * @param referenceElement - The element to place the popper next to
 * @param popperElement - The element to pop
 * @param options - Options to pass to popper.js
 *
 * @example
 * const Example = () => {
 *   const [open, setOpen] = useState(false);
 *   const [
 *     referenceElement,
 *     setReferenceElement,
 *   ] = useState<HTMLButtonElement | null>(null);
 *   const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
 *     null
 *   );
 *   const { styles, attributes } = usePopper(referenceElement, popperElement);
 *
 *   return (
 *     <>
 *       <button
 *         ref={setReferenceElement}
 *         type="button"
 *         onClick={() => setOpen(!open)}
 *       >
 *         Click me to show popper
 *       </button>
 *
 *       {open && (
 *         <div ref={setPopperElement} {...styles} {...attributes}>
 *           The popper element content
 *         </div>
 *       )}
 *     </>
 *   );
 * };
 */
export const usePopper = (
  referenceElement: HTMLElement | null,
  popperElement: HTMLElement | null,
  options: Partial<PopperOptions> = {}
) => {
  const prevOptions = React.useRef<PopperOptions>();
  const optionsWithDefaults: PopperOptions = {
    ...defaultPopperOptions,
    ...options,
  };
  const [state, setState] = React.useState<
    Pick<PopperState, "styles" | "attributes">
  >({
    styles: {
      popper: {
        position: optionsWithDefaults.strategy,
        left: "0",
        top: "0",
      },
    },
    attributes: {},
  });

  const updateStateModifier = React.useMemo(
    () => ({
      name: "updateState" as const,
      enabled: true,
      phase: "write" as const,
      fn: ({
        state: newState,
      }: {
        /** The current popper state */
        state: PopperState;
      }) => {
        const elements = Object.keys(newState.elements);

        setState({
          styles: fromEntries(
            elements.map((element) => [element, newState.styles[element] || {}])
          ),
          attributes: fromEntries(
            elements.map((element) => [element, newState.attributes[element]])
          ),
        });
      },
      requires: ["computeStyles"],
    }),
    []
  );

  const popperOptions = React.useMemo(() => {
    const newOptions: PopperOptions = {
      ...optionsWithDefaults,
      modifiers: [
        ...optionsWithDefaults.modifiers,
        updateStateModifier,
        { name: "applyStyles", enabled: false },
      ],
    };

    if (isEqual(prevOptions.current, newOptions)) {
      return prevOptions.current || newOptions;
    }

    prevOptions.current = newOptions;
    return newOptions;
  }, [optionsWithDefaults, updateStateModifier]);

  const popperInstanceRef = React.useRef<Instance>();

  /** If the options change on the hook change them on the popper instance too */
  useLayoutEffect(() => {
    popperInstanceRef.current?.setOptions(popperOptions);
  }, [popperOptions]);

  /** Create the popper instance. Recreate it when the reference/popper elements change */
  useLayoutEffect(() => {
    if (!referenceElement || !popperElement) {
      return;
    }

    const popperInstance = createPopperLite(
      referenceElement,
      popperElement,
      popperOptions
    );

    popperInstanceRef.current = popperInstance;

    return () => {
      popperInstance.destroy();
      popperInstanceRef.current = undefined;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [referenceElement, popperElement, createPopperLite]);

  return {
    styles: state.styles as { [key: string]: React.CSSProperties },
    attributes: state.attributes,
    popperInstanceRef,
  };
};