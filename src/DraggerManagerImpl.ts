import { DraggerManagerImplProps, DraggerDimension } from './types';
import ContainerManagerImpl from './ContainerManagerImpl';
import { draggerKeyExtractor } from './key';
import NestDND from './NestDND';

class DraggerManagerImpl {
  private _id: string;
  private _container: ContainerManagerImpl;
  private _dnd: NestDND;
  private _el: HTMLElement;
  public dimension: DraggerDimension;
  public _teardown: null | Function;

  constructor(props: DraggerManagerImplProps) {
    const { container, dnd, el } = props;
    this._container = container;
    this._dnd = dnd;
    this._el = el;
    this._id = draggerKeyExtractor();
    this.dimension = {} as DraggerDimension;
    this._teardown = null;
  }

  getId() {
    return this._id;
  }

  getElement() {
    return this._el;
  }

  getDND() {
    return this._dnd;
  }

  teardown() {
    if (typeof this._teardown === 'function') this._teardown();
  }
}

export default DraggerManagerImpl;
