import {
  ContainerManagerImplProps,
  NestDNDConfig,
  ContainerConfig,
} from './types';
import DraggerManagerImpl from './DraggerManagerImpl';
import { containerKeyExtractor } from './key';
import { orientationToAxis, axisMeasure } from './commons/utils';
import NestDND from './NestDND';
import SortedItems from './structure/SortedItems';
import fluid from './transitionsHandler/fluid';

class ContainerManagerImpl {
  public children: SortedItems<DraggerManagerImpl>;
  private _id: string;

  private dnd: NestDND;
  private dndConfig: NestDNDConfig;
  private _el: HTMLElement;

  private _config: ContainerConfig;

  // TODO: remove
  public el: HTMLElement;
  public containerConfig: ContainerConfig;
  public id: string;

  constructor(props: ContainerManagerImplProps) {
    const { dnd, dndConfig, el, config } = props;

    this.dnd = dnd;
    this.dndConfig = dndConfig;
    this._el = el;
    this.el = el;
    this._config = config;

    this._id = containerKeyExtractor();
    this.children = new SortedItems<DraggerManagerImpl>({
      sorter: this.sorter.bind(this),
    });
    this.containerConfig = config || {
      orientation: 'vertical',
    };

    // TODO:
    this.id = this._id;

    this.decorateDraggerEffect();
  }

  getOrientation() {
    return this._config.orientation;
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
    const aValue = (a.dimension as any)![minProperty] || 0;
    const bValue = (b.dimension as any)![minProperty] || 0;
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
