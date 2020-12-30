import React, { useContext, useRef } from 'react';
import context from './context';
import { NestDND } from '../../core/src';
// import { NestDND } from '@nest-dnd/core';

export default (props: any) => {
  const { children, onDropEnd, second, ...rest } = props;
  const contextValues = useContext(context);
  const providerRef = useRef<NestDND | null>(null);

  if (!providerRef.current) {
    providerRef.current = new NestDND({
      config: {
        onDropEnd,
      },
    });
  } else {
    // should update onDropEnd or data in onDropEnd will not change
    providerRef.current.updateOnDropEnd(onDropEnd);
  }

  return (
    <context.Provider
      value={{ ...contextValues, provider: providerRef.current! }}
    >
      {React.cloneElement(children, rest)}
    </context.Provider>
  );
};
