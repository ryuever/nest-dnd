import React, { useRef, useCallback, useContext, useEffect } from 'react';
import invariant from 'invariant';
import cloneWithRef from './cloneWithRef';
import context from './context';
import { ContainerManagerImpl, DraggerManagerImpl } from '@nest-dnd/core';

// https://github.com/react-dnd/react-dnd/blob/main/packages/react-dnd/src/common/wrapConnectorHooks.ts#L21
export default (props: any) => {
  const contextValues = useContext(context);
  // should be destructor or `nextContextValues.current.container` will cause error
  // const nextContextValues = useRef({ ...contextValues });
  const containerTeardownRef = useRef<Function>();
  const draggerTeardownRef = useRef<Function>();
  const { provider, container } = contextValues;
  const {
    orientation = 'vertical',
    shouldAcceptDragger = () => true,
    transitionMode = 'fluid',
    droppableId,
    draggable,
    groupId,
    ...restProps
  } = props;

  const containerRef = useRef<ContainerManagerImpl>();
  const draggerRef = useRef<DraggerManagerImpl>();
  const isMountedRef = useRef(false);

  if (!isMountedRef.current) {
    const { container: nextContainer, teardown } = provider!.addContainer({
      droppableId,
      config: {
        orientation,
        shouldAcceptDragger,
        transitionMode,
      },
      parentContainer: container,
    });
    containerRef.current = nextContainer;
    containerTeardownRef.current = teardown;

    if (draggable) {
      const { dragger, teardown: draggerTeardown } = provider!.addDragger({
        draggableId: droppableId,
        container: container!,
      });
      draggerTeardownRef.current = draggerTeardown;
      draggerRef.current = dragger;
    }
    isMountedRef.current = true;
  }

  invariant(provider, `'Droppable' component should be wrapped in 'Provider'`);

  useEffect(
    () => () => {
      if (containerTeardownRef.current) containerTeardownRef.current();
      if (draggerTeardownRef.current) draggerTeardownRef.current();
    },
    []
  );

  // `setRef` in Droppable will be triggered first.
  const setRef = useCallback(el => {
    if (!el) return;
    if (containerRef.current) containerRef.current.setRef(el);
    if (draggerRef.current) draggerRef.current.setRef(el);
  }, []);

  return (
    <context.Provider
      value={{
        ...contextValues,
        container: containerRef.current,
      }}
    >
      {cloneWithRef({ props: restProps, setRef })}
    </context.Provider>
  );
};
