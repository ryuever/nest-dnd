import { createContext } from 'react';
// import { NestDND, ContainerManagerImpl } from '../../core/src';
import { NestDND, ContainerManagerImpl } from '@nest-dnd/core';

const defaultContextValue = {
  container: undefined,
  provider: undefined,
};

export type NestDNDContext = {
  container: undefined | ContainerManagerImpl;
  provider: undefined | NestDND;
};

export default createContext<NestDNDContext>(defaultContextValue);
