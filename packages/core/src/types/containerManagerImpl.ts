import DraggerManagerImpl from '../DraggerManagerImpl';
import { AddContainerProps, NestDNDConfig } from './nestDND';
import NestDND from '../NestDND';

export type Subscriptions = {
  [key: string]: DraggerManagerImpl;
};

export type ContainerManagerImplProps = AddContainerProps & {
  dnd: NestDND;
  dndConfig: NestDNDConfig;
  droppableId: string;
};
