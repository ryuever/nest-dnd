import { createContext } from 'react';
import TargetManagerImpl from './TargetManagerImpl';
import ProviderManagerImpl from './ProviderManagerImpl';

const defaultContextValue = {
  targetContext: null,
  provider: null,
};

export type NestDNDContext = {
  targetContext: null | TargetManagerImpl;
  provider: null | ProviderManagerImpl;
};

export default createContext<NestDNDContext>(defaultContextValue);
