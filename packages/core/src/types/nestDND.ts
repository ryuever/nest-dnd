import ContainerManagerImpl from '../ContainerManagerImpl';
import {
  Orientation,
  ImpactDraggerEffectHandler,
  DraggerEffectHandler,
} from './commons';

// export enum Orientation {
//   Vertical = 'vertical',
//   Horizontal = 'horizontal',
// }

export type NestDNDConfig = {
  onDropEnd: Function;
  [key: string]: any;
};

export type TransitionMode = 'fluid' | 'drop-line';

export type ContainerConfig = {
  // [key: string]: any;
  orientation: Orientation;
  shouldAcceptDragger?: () => boolean;
  impactDraggerEffect?: ImpactDraggerEffectHandler;
  draggerEffect?: DraggerEffectHandler;
  transitionMode: TransitionMode;
};

export type NestDNDProps = {
  // config for global setting
  config: NestDNDConfig;
};

export type AddContainerProps = {
  droppableId: string;
  el?: HTMLElement;
  // config for container
  config: ContainerConfig;

  // used for nested mode.
  parentContainer: ContainerManagerImpl | undefined;
};

export type AddDraggerProps = {
  el?: HTMLElement;
  draggableId: string;
  container: ContainerManagerImpl;
};

export type DropReason = 'DROP' | 'CANCEL';
export type DraggableIdPath = Array<string>;

export type DropResult = {
  dropReason?: DropReason;
  source: {
    path: DraggableIdPath;
  };
  target: {
    path: DraggableIdPath;
    isForwarding: boolean;
  } | null;
};
