import {
  NestDNDConfig,
  ContainerConfig,
  ContainerDimension,
  ContainerManagerImplProps,
} from './types';
import DraggerManagerImpl from './DraggerManagerImpl';
import { orientationToAxis, axisMeasure } from './commons/utils';
import NestDND from './NestDND';
import SortedItems from './structure/SortedItems';
import fluid from './transitionsHandler/fluid';
import { setContainerAttributes } from './commons/setAttributes';
import { DEFAULT_GROUP_ID } from './commons/constants';

class ContainerManagerImpl {
  public children: SortedItems<DraggerManagerImpl>;
  private _id: string;
  private dnd: NestDND;
  private dndConfig: NestDNDConfig;
  private _el: HTMLElement | undefined;
  private _config: ContainerConfig;
  private _groupId: string = DEFAULT_GROUP_ID;

  public containerConfig: ContainerConfig;
  private _parentContainer: undefined | ContainerManagerImpl | null;

  public dimension: ContainerDimension;

  constructor(props: ContainerManagerImplProps) {
    const {
      dnd,
      dndConfig,
      el,
      config,
      droppableId,
      parentContainer,
      groupId,
    } = props;

    this.dnd = dnd;
    this.dndConfig = dndConfig;
    this._el = el;
    this._config = config;

    this._id = droppableId;

    this.children = new SortedItems<DraggerManagerImpl>({
      sorter: this.sorter.bind(this),
    });
    this.containerConfig = config || {
      orientation: 'vertical',
    };

    this.decorateDraggerEffect();
    this._parentContainer = parentContainer;

    this.dimension = {} as any;
    this._groupId = groupId || DEFAULT_GROUP_ID;
  }

  getId() {
    return this._id;
  }

  getElement() {
    return this._el;
  }

  getGroupId() {
    return this._groupId;
  }

  getDNDConfig() {
    return this.dndConfig;
  }

  getDND() {
    return this.dnd;
  }

  getOrientation() {
    return this._config.orientation;
  }

  getParentContainer() {
    return this._parentContainer;
  }

  setRef(el: HTMLElement) {
    this._el = el;
    setContainerAttributes(this, this._config);
  }

  decorateDraggerEffect() {
    const { transitionMode } = this._config;
    if (transitionMode === 'fluid') {
      this._config.draggerEffect = fluid;
    }
  }

  sorter(a: DraggerManagerImpl, b: DraggerManagerImpl): number {
    const { orientation } = this._config;
    const axis = orientationToAxis[orientation];
    const [minProperty] = axisMeasure[axis];
    const aValue =
      a.dimension && a.dimension.rect
        ? (a.dimension as any)!['rect']![minProperty]
        : 0;
    const bValue =
      b.dimension && b.dimension.rect
        ? (b.dimension as any)!['rect']![minProperty]
        : 0;
    return aValue - bValue;
  }

  addSubscription(subscriber: DraggerManagerImpl) {
    this.children.add(subscriber);
    subscriber._teardown = () => {
      const index = this.children.findIndex(subscriber);
      if (index !== -1) this.children.splice(index, 1);
    };
  }
}

export default ContainerManagerImpl;
