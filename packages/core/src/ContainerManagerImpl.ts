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
import { setContainerAttributes } from './setAttributes';

class ContainerManagerImpl {
  public children: SortedItems<DraggerManagerImpl>;
  private _id: string;

  private dnd: NestDND;
  private dndConfig: NestDNDConfig;
  private _el: HTMLElement | undefined;

  private _config: ContainerConfig;

  // TODO: remove
  public el: HTMLElement | undefined;
  public containerConfig: ContainerConfig;
  private _parentContainer: undefined | ContainerManagerImpl | null;

  public id: string;

  public dimension: ContainerDimension;

  constructor(props: ContainerManagerImplProps) {
    const { dnd, dndConfig, el, config, droppableId, parentContainer } = props;

    this.dnd = dnd;
    this.dndConfig = dndConfig;
    this._el = el;
    this.el = el;
    this._config = config;

    this._id = droppableId;

    this.children = new SortedItems<DraggerManagerImpl>({
      sorter: this.sorter.bind(this),
    });
    this.containerConfig = config || {
      orientation: 'vertical',
    };

    // TODO:
    this.id = this._id;

    this.decorateDraggerEffect();
    this._parentContainer = parentContainer;

    this.dimension = {} as any;
  }

  setRef(el: HTMLElement) {
    this._el = el;
    this.el = el;
    setContainerAttributes(this, this._config);
  }

  getOrientation() {
    return this._config.orientation;
  }

  getParentContainer() {
    return this._parentContainer;
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

  getId() {
    return this._id;
  }

  getDNDConfig() {
    return this.dndConfig;
  }

  getDND() {
    return this.dnd;
  }

  addSubscription(subscriber: DraggerManagerImpl) {
    this.children.add(subscriber);
    subscriber._teardown = () => {
      const index = this.children.findIndex(subscriber);
      if (index !== -1) this.children.splice(index, 1);
    };
  }

  getElement() {
    return this._el;
  }
}

export default ContainerManagerImpl;
