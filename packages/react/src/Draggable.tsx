import { useRef, useCallback, useContext, useEffect } from 'react';
import invariant from 'invariant';
import cloneWithRef from './cloneWithRef';
import context from './context';

// https://github.com/react-dnd/react-dnd/blob/main/packages/react-dnd/src/common/wrapConnectorHooks.ts#L21
export default (props: any) => {
  const elementRef = useRef();
  const contextValues = useContext(context);
  const teardownRef = useRef<Function>();
  const { container, provider } = contextValues;
  const { draggableId, ...rest } = props;

  invariant(
    container,
    `'Dragger' should be wrapped in a 'Droppable' component`
  );

  const setRef = useCallback(
    el => {
      if (!el) return;
      elementRef.current = el;
      teardownRef.current = provider?.addDragger({
        draggableId,
        container,
        el,
      });
    },
    [provider, container, draggableId]
  );

  useEffect(
    () => () => {
      if (teardownRef.current) teardownRef.current();
    },
    []
  );

  return cloneWithRef({ props: rest, setRef });
};
