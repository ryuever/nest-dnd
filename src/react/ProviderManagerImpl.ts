import TargetManagerImpl from './TargetManagerImpl';
import { ProviderSubscriptions } from './types';

let count = 0;

class ProviderManagerImpl {
  private _subscriptions: ProviderSubscriptions = {};
  private _id: string;

  constructor() {
    this._id = `__nest_dnd_provider_${count++}__`;
  }

  getId() {
    return this._id;
  }

  getSubscriptions() {
    return this._subscriptions;
  }

  addSubscription(subscriber: TargetManagerImpl) {
    const subscriberId = subscriber.getId();
    this._subscriptions[subscriberId] = subscriber;

    return () => {
      delete this._subscriptions[subscriberId];
    };
  }
}

export default ProviderManagerImpl;
