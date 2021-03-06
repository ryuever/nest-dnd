import Dragger from '../../DraggerManagerImpl';
import { Action } from 'sabar';
import ContainerManagerImpl from '../../ContainerManagerImpl';
import { OnStartHandlerContext, ContainerConfig } from '../../types';

const shouldAcceptDragger = (
  containerConfig: ContainerConfig,
  dragger: Dragger
) => {
  const { shouldAcceptDragger } = containerConfig;
  const el = dragger.getElement();
  if (typeof shouldAcceptDragger === 'function') {
    return shouldAcceptDragger(el!);
  }
  // return false;
  return true;

  // return el.matches(draggerSelector!);
};

const pickClosestContainer = (pendingContainers: ContainerManagerImpl[]) => {
  const len = pendingContainers.length;
  if (len <= 1) return pendingContainers[0];
  const isVerified = Object.create(null) as {
    [key: string]: {
      used: boolean;
      container: ContainerManagerImpl;
    };
  };

  for (let i = 0; i < len; i++) {
    const container = pendingContainers[i];
    const containerId = container.getId();
    if (typeof isVerified[containerId] !== 'undefined') {
      break;
    }

    isVerified[containerId] = {
      used: true,
      container,
    };

    let parentContainer = container.getParentContainer();

    while (parentContainer) {
      const parentContainerId = parentContainer.getId();
      if (typeof isVerified[parentContainerId] !== 'undefined') {
        parentContainer = null;
      } else {
        parentContainer = parentContainer.getParentContainer();
      }
      isVerified[parentContainerId].used = false;
    }
  }

  const remaining = [];

  for (const [, value] of Object.entries(isVerified)) {
    if (value.used) remaining.push(value.container);
  }

  return remaining[0];
};

/**
 *
 * @param {*} param0
 * @param {*} ctx
 * @param {*} actions
 *
 * Difference between `targetContainer` and `impactContainer`...
 * `impactContainer` is bound with `impactDragger`. There is a situation
 * point is in the gap between dragger and container...
 */
const getContainer = (
  {
    event,
    dragger,
  }: {
    event: MouseEvent;
    dragger: Dragger;
  },
  ctx: object,
  actions: Action
) => {
  const context = ctx as OnStartHandlerContext;
  const { clientX, clientY } = event;
  const { getContainers, dndConfig } = context;
  const { mode } = dndConfig;
  const vContainers = getContainers();
  const keys = Object.keys(vContainers);
  const len = keys.length;
  const pendingContainers = [];

  for (let i = 0; i < len; i++) {
    const key = keys[i];
    const container = vContainers[key];
    const {
      dimension: { within },
      containerConfig,
    } = container;
    // // ts-hint: https://stackoverflow.com/questions/54838593/type-number-is-missing-the-following-properties-from-type-number-number
    const point = [clientX, clientY];
    if (within(point as any) && shouldAcceptDragger(containerConfig, dragger)) {
      pendingContainers.push(container);
    }
  }

  let nextContainer = pendingContainers;

  // in `nested` mode, `horizontal` container is not considered
  if (mode === 'nested') {
    nextContainer = pendingContainers.filter(container => {
      const { orientation } = container.containerConfig;
      return orientation === 'vertical';
    });
  }

  context.targetContainer = pickClosestContainer(nextContainer);
  context.impact.impactContainer = context.targetContainer;
  actions.next();
};

export default getContainer;
