import Sabar from 'sabar';
import ContainerManagerImpl from './ContainerManagerImpl';
import DraggerManagerImpl from './DraggerManagerImpl';
import {
  AddContainerProps,
  NestDNDProps,
  NestDNDConfig,
  AddDraggerProps,
} from './types';

import getDimensions from './middleware/onStart/getDimensions';
import getDimensionsNested from './middleware/onStart/getDimensionsNested';
// import validateContainers from './middleware/onStart/validateContainers';
import attemptToCreateClone from './middleware/onStart/attemptToCreateClone';
import prepareContainerKey from './middleware/onStart/prepareContainerKey';

import syncCopyPosition from './middleware/onMove/syncCopyPosition';
import addIntermediateCtxValue from './middleware/onMove/addIntermediateCtxValue';
import removeIntermediateCtxValue from './middleware/onMove/removeIntermediateCtxValue';
import handleLeaveContainer from './middleware/onMove/effects/handleLeaveContainer';
import handleLeaveHomeContainer from './middleware/onMove/effects/handleLeaveHomeContainer';
import handleLeaveOtherContainer from './middleware/onMove/effects/handleLeaveOtherContainer';
import handleEnterContainer from './middleware/onMove/effects/handleEnterContainer';
import handleEnterHomeContainer from './middleware/onMove/effects/handleEnterHomeContainer';
import handleEnterOtherContainer from './middleware/onMove/effects/handleEnterOtherContainer';
import handleReorder from './middleware/onMove/effects/handleReorder';
import handleReorderOnHomeContainer from './middleware/onMove/effects/handleReorderOnHomeContainer';
import handleReorderOnOtherContainer from './middleware/onMove/effects/handleReorderOnOtherContainer';
import handleImpactDraggerEffect from './middleware/onMove/effects/handleImpactDraggerEffect';
import handleImpactContainerEffect from './middleware/onMove/effects/handleImpactContainerEffect';

import getImpactRawInfo from './middleware/shared/getImpactRawInfo';

import MouseSensor from './sensors/mouse';
import DndEffects from './middleware/onMove/effects/DndEffects';
import { Impact, Extra } from './types';
class NestDND {
  private _candidateContainerMap: Map<string, ContainerManagerImpl> = new Map();
  public keyToContainerMap: Map<string, ContainerManagerImpl> = new Map();
  public containerToDraggersMap: WeakMap<
    ContainerManagerImpl,
    DraggerManagerImpl
  > = new WeakMap();
  public dndConfig: NestDNDConfig;

  public onStartHandler: Sabar | null;
  public onMoveHandler: Sabar | null;
  public dndEffects: DndEffects;
  public extra: Extra;
  public impact: Impact;
  public sensor: MouseSensor | null;

  constructor(props: NestDNDProps) {
    this.dndConfig = props.config;

    this.extra = {};

    this.dndEffects = new DndEffects();

    this.impact = {} as any;
    this.sensor = null;

    this.onStartHandler = null;
    this.onMoveHandler = null;
    this.getDraggers = this.getDraggers.bind(this);
    this.getContainers = this.getContainers.bind(this);
    this.updateCandidateContainerMap = this.updateCandidateContainerMap.bind(
      this
    );

    this.onStartHandler = new Sabar({
      ctx: {
        getDraggers: this.getDraggers,
        getContainers: this.getContainers,
        extra: this.extra,
        dndConfig: this.dndConfig,
        prevImpact: {},
        dndEffects: new DndEffects(),
        updateCandidateContainerMap: this.updateCandidateContainerMap,
      },
    });

    this.onMoveHandler = new Sabar({
      ctx: {
        getDraggers: this.getDraggers,
        getContainers: this.getContainers,
        dndConfig: this.dndConfig,
        dndEffects: this.dndEffects,
        prevImpact: {},
      },
    });

    this.onStartHandler.use(
      prepareContainerKey,
      getDimensions,
      getDimensionsNested,
      // validateContainers,
      attemptToCreateClone
    );
    this.onMoveHandler.use(
      syncCopyPosition,
      getImpactRawInfo,
      addIntermediateCtxValue,
      handleLeaveContainer,
      handleLeaveHomeContainer,
      handleLeaveOtherContainer,
      handleEnterContainer,
      handleEnterHomeContainer,
      handleEnterOtherContainer,
      handleReorder,
      handleReorderOnHomeContainer,
      handleReorderOnOtherContainer,
      handleImpactDraggerEffect,
      handleImpactContainerEffect,
      removeIntermediateCtxValue,
      () => {}
    );

    this.initializeSensor();
  }

  getContainers() {
    const result = {} as {
      [key: string]: any;
    };

    this._candidateContainerMap.forEach((value, key) => {
      result[key] = value;
    });

    return result;
  }

  getDraggers() {
    const result = {} as {
      [key: string]: any;
    };

    this._candidateContainerMap.forEach(container => {
      container.children.items.forEach(dragger => {
        result[dragger.getId()] = dragger;
      });
    });
    return result;
  }

  getFullDraggers() {
    const result = {} as {
      [key: string]: any;
    };

    this.keyToContainerMap.forEach(container => {
      container.children.items.forEach(dragger => {
        result[dragger.getId()] = dragger;
      });
    });
    return result;
  }

  updateCandidateContainerMap(draggerGroupId: string) {
    const candidateContainerMap = new Map();
    this.keyToContainerMap.forEach(container => {
      if (container.getGroupId() === draggerGroupId) {
        candidateContainerMap.set(container.getId(), container);
      }
    });

    this._candidateContainerMap = candidateContainerMap;
  }

  addContainer(props: AddContainerProps) {
    const container = new ContainerManagerImpl({
      ...props,
      dndConfig: this.dndConfig,
      dnd: this,
    });
    const containerId = container.getId();
    this.keyToContainerMap.set(containerId, container);

    return {
      container,
      teardown: () => {
        this.keyToContainerMap.delete(containerId);
      },
    };
  }

  updateOnDropEnd(onDropEnd: Function) {
    this.dndConfig.onDropEnd = onDropEnd;
  }

  addDragger(props: AddDraggerProps) {
    const { container } = props;
    const subscriber = new DraggerManagerImpl({
      ...props,
      dnd: this,
    });
    container.addSubscription(subscriber);

    return {
      dragger: subscriber,
      teardown: subscriber.teardown,
    };
  }

  moveAPI = () => {
    return {
      prevImpact: this.impact,
    };
  };

  getClone = (): HTMLElement | undefined => {
    return this.extra.clone;
  };

  updateImpact = (impact: Impact) => {
    this.impact = impact;
  };

  initializeSensor() {
    this.sensor = new MouseSensor({
      moveAPI: this.moveAPI,
      getClone: this.getClone,
      onStartHandler: this.onStartHandler!,
      onMoveHandler: this.onMoveHandler!,
      getDragger: this.getDragger.bind(this),
      dndEffects: this.dndEffects,
      updateImpact: this.updateImpact,
      dndConfig: this.dndConfig as any,
    });
    this.sensor.start();
  }

  getDragger(el: HTMLElement) {
    const draggerId = el.getAttribute('data-dragger-id');
    const draggers = this.getFullDraggers();
    return draggers[draggerId!];
  }
}

export default NestDND;
