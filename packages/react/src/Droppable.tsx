import React, { useRef, useCallback, useContext, useEffect } from 'react';
import invariant from 'invariant';
import cloneWithRef from './cloneWithRef';
import context from './context';

// https://github.com/react-dnd/react-dnd/blob/main/packages/react-dnd/src/common/wrapConnectorHooks.ts#L21
export default (props: any) => {
  const contextValues = useContext(context);
  // should be destructor or `nextContextValues.current.container` will cause error
  const nextContextValues = useRef({ ...contextValues });
  const elementRef = useRef();
  const teardownRef = useRef<Function>();
  const { provider, container } = contextValues;
  const isContainerCreatedRef = useRef(false);
  const {
    orientation = 'vertical',
    shouldAcceptDragger = () => true,
    transitionMode = 'fluid',
    ...restProps
  } = props;

  invariant(provider, `'Droppable' component should be wrapped in 'Provider'`);

  useEffect(
    () => () => {
      if (teardownRef.current) teardownRef.current();
    },
    []
  );

  // `setRef` in Droppable will be triggered first.
  const setRef = useCallback(
    el => {
      if (!el) return;
      // make sure container could be only create once
      if (isContainerCreatedRef.current) return;
      isContainerCreatedRef.current = true;
      elementRef.current = el;
      const { container: nextContainer, teardown } = provider.addContainer({
        el,
        config: {
          orientation,
          shouldAcceptDragger,
          transitionMode,
        },
        parentContainer: container,
      });

      nextContextValues.current.container = nextContainer;
      teardownRef.current = teardown;
    },
    [provider, container, orientation, shouldAcceptDragger]
  );

  return (
    <context.Provider value={{ ...nextContextValues.current }}>
      {cloneWithRef({ props: restProps, setRef })}
    </context.Provider>
  );
};
