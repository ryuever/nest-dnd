import React, { isValidElement, forwardRef, cloneElement } from 'react';

export default ({ props, setRef }: { props: any; setRef: Function }) => {
  const { children } = props;

  if (isValidElement(children)) {
    // native element should be assigned with a setRef
    if (typeof children.type === 'string') {
      return React.cloneElement(children, {
        // @ts-ignore
        ref: setRef,
      });
    }

    const RefForwardingWrapper = forwardRef<any, any>((props, ref) => {
      return cloneElement(children, {
        ...props,
        forwardRef: ref,
      });
    });

    return <RefForwardingWrapper {...props} ref={setRef} />;
  }

  return null;
};
