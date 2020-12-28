import React, { useContext, useRef } from 'react';
import context from './context';
import ProviderManagerImpl from './ProviderManagerImpl';

export default (props: any) => {
  const { children, ...rest } = props;
  const isMountedRef = useRef(false);
  const contextValues = useContext(context);

  const nextContextValues = useRef(contextValues);

  if (!isMountedRef.current) {
    nextContextValues.current.provider = new ProviderManagerImpl();
    isMountedRef.current = true;
  }

  return (
    <context.Provider value={nextContextValues.current}>
      {React.cloneElement(children, rest)}
    </context.Provider>
  );
};
