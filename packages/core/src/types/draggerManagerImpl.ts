import ContainerManagerImpl from '../ContainerManagerImpl';
import NestDND from '../NestDND';

export type DraggerManagerImplProps = {
  el?: HTMLElement;
  draggableId: string;
  container: ContainerManagerImpl;
  dnd: NestDND;
};
