import React, { useRef, useCallback, useContext, useEffect } from 'react';
import invariant from 'invariant';
import cloneWithRef from './cloneWithRef';
import context from './context';
import { Orientation } from '../';

// https://github.com/react-dnd/react-dnd/blob/main/packages/react-dnd/src/common/wrapConnectorHooks.ts#L21
export default (props: any) => {
  const contextValues = useContext(context);
  const nextContextValues = useRef(contextValues);
  const elementRef = useRef();
  const teardownRef = useRef<Function>();
  const { provider, container } = contextValues;

  invariant(provider, `'Droppable' component should be wrapped in 'Provider'`);

  useEffect(
    () => () => {
      if (teardownRef.current) teardownRef.current();
    },
    []
  );

  // `setRef` in Droppable will be triggered first.
  const setRef = useCallback(
    (el) => {
      if (!el) return;
      elementRef.current = el;
      const { container: nextContainer, teardown } = provider.addContainer({
        el,
        config: {
          orientation: Orientation.Vertical,
          shouldAcceptDragger: () => true,
        },
        parentContainer: container,
      });

      nextContextValues.current.container = nextContainer;
      teardownRef.current = teardown;
    },
    [provider, container]
  );

  return (
    <context.Provider value={{ ...nextContextValues.current }}>
      {cloneWithRef({ props, setRef })}
    </context.Provider>
  );
};
