import { DraggerManagerImplProps, DraggerDimension, RectObject } from './types';
import ContainerManagerImpl from './ContainerManagerImpl';
// import { draggerKeyExtractor } from './key';
import NestDND from './NestDND';

class DraggerManagerImpl {
  private _id: string;
  public container: ContainerManagerImpl;
  private _dnd: NestDND;
  public el: HTMLElement;
  private _el: HTMLElement;
  public dimension: DraggerDimension;
  public _teardown: null | Function;

  public id: string;

  constructor(props: DraggerManagerImplProps) {
    const { container, dnd, el, draggableId } = props;
    this.container = container;
    this._dnd = dnd;
    this._el = el;
    this.el = el;
    this._id = draggableId;
    // this._id = draggerKeyExtractor();
    this.dimension = {} as DraggerDimension;
    this._teardown = null;

    // TODO
    this.id = this._id;
    this.teardown = this.teardown.bind(this);
  }

  getId() {
    return this._id;
  }

  getPath() {
    return [this.container.id, this.id];
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

  setDimension({ rect }: { rect: RectObject }) {
    const container = this.container;
    this.dimension = { rect };
    container.children.sort();
  }
}

export default DraggerManagerImpl;
