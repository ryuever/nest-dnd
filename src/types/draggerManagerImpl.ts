import ContainerManagerImpl from '../ContainerManagerImpl';
import NestDND from '../NestDND';

export type DraggerManagerImplProps = {
  el: HTMLElement;
  container: ContainerManagerImpl;
  dnd: NestDND;
};
