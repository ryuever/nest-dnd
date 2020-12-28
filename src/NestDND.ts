import ContainerManagerImpl from './ContainerManagerImpl';
import DraggerManagerImpl from './DraggerManagerImpl';
import {
  AddContainerProps,
  NestDNDProps,
  NestDNDConfig,
  AddDraggerProps,
} from './types';

class NestDND {
  public keyToContainerMap: Map<String, ContainerManagerImpl> = new Map();
  public containerToDraggersMap: WeakMap<
    ContainerManagerImpl,
    DraggerManagerImpl
  > = new WeakMap();
  public dndConfig: NestDNDConfig;

  constructor(props: NestDNDProps) {
    this.dndConfig = props.config;
  }

  addContainer(props: AddContainerProps) {
    const container = new ContainerManagerImpl({
      ...props,
      dndConfig: this.dndConfig,
      dnd: this,
    });
    const containerId = container.getId();
    this.keyToContainerMap.set(containerId, container);
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
    return subscriber.teardown;
  }
}

export default NestDND;
