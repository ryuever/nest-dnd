import React, {
  isValidElement,
  useRef,
  useCallback,
  forwardRef,
  useMemo,
  cloneElement,
} from 'react';

// https://github.com/react-dnd/react-dnd/blob/main/packages/react-dnd/src/common/wrapConnectorHooks.ts#L21
export default (props: any) => {
  const { children } = props;
  const elementRef = useRef();

  const setRef = useCallback((el) => {
    elementRef.current = el;
    el.setAttribute('draggable', true);
  }, []);

  if (isValidElement(children)) {
    // native element should be assigned with a setRef
    if (typeof children.type === 'string') {
      return React.cloneElement(children, {
        // @ts-ignore
        ref: setRef,
      });
    }

    const RefForwardingWrapper = useMemo(
      () =>
        forwardRef<any, any>((props, ref) => {
          return cloneElement(children, {
            ...props,
            forwardRef: ref,
          });
        }),
      []
    );
    return <RefForwardingWrapper {...props} ref={setRef} />;
  }

  console.log('props ', props.children, isValidElement(props.children));
  return null;
};
