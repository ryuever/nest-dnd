import DraggerManagerImpl from '../DraggerManagerImpl';
import { AddContainerProps, NestDNDConfig } from './nestDND';
import NestDND from '../NestDND';
import { RectObject, Point } from './commons';

export type Subscriptions = {
  [key: string]: DraggerManagerImpl;
};

export type ContainerManagerImplProps = AddContainerProps & {
  dnd: NestDND;
  dndConfig: NestDNDConfig;
  droppableId: string;
};

export interface ContainerDimension {
  rect: RectObject;
  subject: {
    isVisible: boolean;
  };
  within: (point: Point) => boolean;
}
