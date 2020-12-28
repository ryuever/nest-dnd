import { createContext } from 'react';
import { NestDND, ContainerManagerImpl } from '../';

const defaultContextValue = {
  container: null,
  provider: null,
};

export type NestDNDContext = {
  container: null | ContainerManagerImpl;
  provider: null | NestDND;
};

export default createContext<NestDNDContext>(defaultContextValue);
