import { useRef, useCallback, useContext, useEffect } from 'react';
import invariant from 'invariant';
import cloneWithRef from './cloneWithRef';
import context from './context';
// import SourceManagerImpl from './SourceManagerImpl'
// import { DraggerManagerImpl } from '../';

// https://github.com/react-dnd/react-dnd/blob/main/packages/react-dnd/src/common/wrapConnectorHooks.ts#L21
export default (props: any) => {
  const elementRef = useRef();
  const contextValues = useContext(context);
  const teardownRef = useRef<Function>();
  const { container, provider } = contextValues;

  invariant(
    container,
    `'Dragger' should be wrapped in a 'Droppable' component`
  );

  const setRef = useCallback(
    (el) => {
      elementRef.current = el;
      el.setAttribute('data-is-dragger', true);
      teardownRef.current = provider?.addDragger({
        container,
        el,
      });
      // teardownRef.current = container.addSubscription(new DraggerManagerImpl({
      //   container,
      //   el,
      // }))
    },
    [provider, container]
  );

  useEffect(() => () => {
    if (teardownRef.current) teardownRef.current();
  });

  return cloneWithRef({ props, setRef });
};
