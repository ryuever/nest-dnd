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

class ContainerManagerImpl {
  private _subscriptions: SortedItems<DraggerManagerImpl>;
  private _id: string;

  private dnd: NestDND;
  private dndConfig: NestDNDConfig;
  private el: HTMLElement;
  private config: ContainerConfig;

  constructor(props: ContainerManagerImplProps) {
    const { dnd, dndConfig, el, config } = props;

    this.dnd = dnd;
    this.dndConfig = dndConfig;
    this.el = el;
    this.config = config;

    this._id = containerKeyExtractor();
    this._subscriptions = new SortedItems<DraggerManagerImpl>({
      sorter: this.sorter.bind(this),
    });
  }

  sorter(a: DraggerManagerImpl, b: DraggerManagerImpl): number {
    const { orientation } = this.config;
    const axis = orientationToAxis[orientation];
    const [minProperty] = axisMeasure[axis];
    const aValue = (a.dimension as any)![minProperty] || 0;
    const bValue = (b.dimension as any)![minProperty] || 0;
    return aValue - bValue;
  }

  getId() {
    return this._id;
  }

  addSubscription(subscriber: DraggerManagerImpl) {
    this._subscriptions.add(subscriber);
    subscriber._teardown = () => {
      const index = this._subscriptions.findIndex(subscriber);
      if (index !== -1) this._subscriptions.splice(index, 1);
    };
  }

  // getSubscriptions() {
  //   return this._subscriptions;
  // }

  // addSubscription(subscriber: DraggerManagerImpl) {
  //   const subscriberId = subscriber.getId();
  //   this._subscriptions[subscriberId] = subscriber;

  //   return () => {
  //     delete this._subscriptions[subscriberId];
  //   };
  // }
}

export default ContainerManagerImpl;
