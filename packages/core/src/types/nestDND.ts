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
  el: HTMLElement;
  // config for container
  config: ContainerConfig;

  // used for nested mode.
  parentContainer: ContainerManagerImpl | null;
};

export type AddDraggerProps = {
  el: HTMLElement;
  container: ContainerManagerImpl;
};
