import Sabar from 'sabar';
import ContainerManagerImpl from './ContainerManagerImpl';
import DraggerManagerImpl from './DraggerManagerImpl';
import {
  AddContainerProps,
  NestDNDProps,
  NestDNDConfig,
  AddDraggerProps,
} from './types';

import { setContainerAttributes, setDraggerAttributes } from './setAttributes';

import getDimensions from './middleware/onStart/getDimensions';
import getDimensionsNested from './middleware/onStart/getDimensionsNested';
import validateContainers from './middleware/onStart/validateContainers';
import attemptToCreateClone from './middleware/onStart/attemptToCreateClone';

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

    setTimeout(() => {
      this.onStartHandler = new Sabar({
        ctx: {
          vDraggers: this.draggers,
          vContainers: this.containers,
          extra: this.extra,
          dndConfig: this.dndConfig,
          prevImpact: {},
          dndEffects: new DndEffects(),
        },
      });

      this.onMoveHandler = new Sabar({
        ctx: {
          vDraggers: this.draggers,
          vContainers: this.containers,
          dndConfig: this.dndConfig,
          dndEffects: this.dndEffects,
          prevImpact: {},
        },
      });

      this.onStartHandler.use(
        getDimensions,
        getDimensionsNested,
        validateContainers,
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
    }, 3000);
  }

  // @ts-ignore
  get containers() {
    const result = {} as {
      [key: string]: any;
    };

    this.keyToContainerMap.forEach((value, key) => {
      result[key] = value;
    });

    return result;
  }

  // @ts-ignore
  get draggers() {
    const result = {} as {
      [key: string]: any;
    };

    this.keyToContainerMap.forEach((container) => {
      container.children.items.forEach((dragger) => {
        result[dragger.getId()] = dragger;
      });
    });
    return result;
  }

  addContainer(props: AddContainerProps) {
    const container = new ContainerManagerImpl({
      ...props,
      dndConfig: this.dndConfig,
      dnd: this,
    });
    const containerId = container.getId();
    this.keyToContainerMap.set(containerId, container);

    setContainerAttributes(container, props.config);
    return {
      container,
      teardown: () => {
        this.keyToContainerMap.delete(containerId);
      },
    };
  }

  addDragger(props: AddDraggerProps) {
    const { container } = props;
    const subscriber = new DraggerManagerImpl({
      ...props,
      dnd: this,
    });
    container.addSubscription(subscriber);
    setDraggerAttributes(container, subscriber);

    return subscriber.teardown;
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
    return this.draggers[draggerId!];
  }
}

export default NestDND;
