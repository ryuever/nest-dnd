import React, { useRef, useCallback, useContext, useEffect } from 'react';
import invariant from 'invariant';
import cloneWithRef from './cloneWithRef';
import context from './context';
import TargetManagerImpl from './TargetManagerImpl';

// https://github.com/react-dnd/react-dnd/blob/main/packages/react-dnd/src/common/wrapConnectorHooks.ts#L21
export default (props: any) => {
  const contextValues = useContext(context);
  const nextContextValues = useRef(contextValues);
  const elementRef = useRef();
  const teardownRef = useRef<Function>();
  const { provider } = contextValues;

  invariant(provider, `'Droppable' component should be wrapped in 'Provider'`);

  useEffect(() => () => {
    if (teardownRef.current) teardownRef.current();
  });

  const setRef = useCallback(
    (el) => {
      elementRef.current = el;
      el.setAttribute('data-is-container', true);
      nextContextValues.current.targetContext = new TargetManagerImpl();
      teardownRef.current = provider.addSubscription(
        nextContextValues.current.targetContext
      );
    },
    [provider]
  );

  return (
    <context.Provider value={nextContextValues.current}>
      {cloneWithRef({ props, setRef })}
    </context.Provider>
  );
};
