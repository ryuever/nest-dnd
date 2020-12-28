import { Subscriptions } from './types';

import SourceManagerImpl from './SourceManagerImpl';

let count = 0;

class TargetManagerImpl {
  private _subscriptions: Subscriptions = {};
  private _id: string;

  constructor() {
    this._id = `__nest_dnd_target_${count++}__`;
  }

  getSubscriptions() {
    return this._subscriptions;
  }

  getId() {
    return this._id;
  }

  addSubscription(subscriber: SourceManagerImpl) {
    const subscriberId = subscriber.getId();
    this._subscriptions[subscriberId] = subscriber;

    return () => {
      delete this._subscriptions[subscriberId];
    };
  }
}

export default TargetManagerImpl;
