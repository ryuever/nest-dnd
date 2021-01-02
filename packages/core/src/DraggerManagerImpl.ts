import { DraggerManagerImplProps, DraggerDimension, RectObject } from './types';
import ContainerManagerImpl from './ContainerManagerImpl';
import NestDND from './NestDND';
import { setDraggerAttributes } from './setAttributes';

class DraggerManagerImpl {
  private _id: string;
  public container: ContainerManagerImpl;
  private _dnd: NestDND;
  public el: HTMLElement | undefined;
  private _el: HTMLElement | undefined;
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

  setRef(el: HTMLElement) {
    this.el = el;
    this._el = el;
    setDraggerAttributes(this.container, this);
  }

  getId() {
    return this._id;
  }

  getPath() {
    let parent = this.container;
    const path = [this.id];

    while (parent) {
      path.unshift(parent.id);
      parent = parent.getParentContainer() as any;
    }

    return path;
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
