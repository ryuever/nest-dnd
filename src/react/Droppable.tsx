import { useRef, useCallback } from 'react';
import cloneWithRef from './cloneWithRef';

// https://github.com/react-dnd/react-dnd/blob/main/packages/react-dnd/src/common/wrapConnectorHooks.ts#L21
export default (props: any) => {
  const elementRef = useRef();

  const setRef = useCallback((el) => {
    elementRef.current = el;
    el.setAttribute('data-is-container', true);
  }, []);

  return cloneWithRef({ props, setRef });
};
