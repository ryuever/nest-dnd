import ContainerManagerImpl from '../ContainerManagerImpl';
import DraggerManagerImpl from '../DraggerManagerImpl';
import DndEffects from '../middleware/onMove/effects/DndEffects';
import EffectsManager from '../middleware/onMove/effects/EffectsManager';
import {
  Orientation,
  ImpactDraggerEffectHandler,
  DraggerEffectHandler,
  Point,
  Impact,
  RawInfo,
  Position,
} from './commons';

// export enum Orientation {
//   Vertical = 'vertical',
//   Horizontal = 'horizontal',
// }

export interface Containers {
  [key: string]: ContainerManagerImpl;
}

export type NestDNDConfig = {
  onDropEnd: Function;
  [key: string]: any;
};

export type TransitionMode = 'fluid' | 'drop-line';

export interface ImpactContainerEffectHandler {
  ({
    container,
    isHighlight,
  }: {
    container: HTMLElement;
    isHighlight: boolean;
  }): Function | undefined;
}

export type ContainerConfig = {
  // [key: string]: any;
  orientation: Orientation;
  shouldAcceptDragger?: { (e: HTMLElement): boolean };
  impactDraggerEffect?: ImpactDraggerEffectHandler;
  draggerEffect?: DraggerEffectHandler;
  transitionMode: TransitionMode;
  containerEffect?: { ({ el }: { el: HTMLElement }): void | Function };
  /**
   * It's called when enter a container, handler should return with a function
   * to make effect cleanup...
   */
  impactContainerEffect?: ImpactContainerEffectHandler;
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
  containerEffect?: { ({ el }: { el: HTMLElement }): void | Function };
  draggerEffect?: DraggerEffectHandler;
  impactDraggerEffect?: ImpactDraggerEffectHandler;
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

export enum OnMoveOperation {
  OnStart = 'onStart',
  OnEnter = 'onEnter',
  OnLeave = 'onLeave',
  ReOrder = 'reOrder',
}

export interface OnMoveAction {
  operation: OnMoveOperation;
  isHomeContainerFocused: boolean;
  effectsManager: null | EffectsManager;
}

export interface VContainer {
  [key: string]: ContainerManagerImpl;
}

export interface VDragger {
  [key: string]: DraggerManagerImpl;
}

export interface Extra {
  clone?: HTMLElement;
}

export type GetDraggers = () => VDragger;
export type GetContainers = () => VContainer;

export interface OnStartHandlerContext {
  getContainers: GetContainers;
  getDraggers: GetDraggers;
  extra: Extra;
  dndConfig: NestDNDConfig;
  targetContainer: ContainerManagerImpl;
  impact: {
    impactContainer: ContainerManagerImpl;
  };
  impactRawInfo: RawInfo;
}

export interface OnMoveHandleContext {
  getContainers: GetContainers;
  getDraggers: GetDraggers;
  dndConfig: NestDNDConfig;
  action: OnMoveAction;
  impactRawInfo: RawInfo;
  dndEffects: DndEffects;
  impact: Impact;
  output: {
    dragger: HTMLElement;
    candidateDragger: HTMLElement;
    container: HTMLElement;
    placedPosition: Position;
  };
}

export interface OnMoveArgs {
  impactPoint: Point;
  clone: HTMLElement;
  liftUpVDragger: DraggerManagerImpl;
  isHomeContainer: (container: ContainerManagerImpl) => boolean;
  prevImpact: Impact;
  liftUpVDraggerIndex: number;
  lifeUpDragger: DraggerManagerImpl;
}
