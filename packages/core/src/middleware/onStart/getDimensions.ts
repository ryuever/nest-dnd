// only resolve the style of container or dragger enclosed by container.
import { isElementVisibleInViewport, withinElement } from '../../commons/dom';
import { Action } from 'sabar';
import { OnStartHandlerContext } from '../../types';
import ContainerManagerImpl from '../../ContainerManagerImpl';
import DraggerManagerImpl from '../../DraggerManagerImpl';

const getDimension = (v: ContainerManagerImpl | DraggerManagerImpl) => {
  const { el } = v;
  const rect = el!.getBoundingClientRect();
  return rect;
};

// If it is a container, subject property may be required which will indicate
// whether it is visible or not.
const getSubject = (el: HTMLElement) => {
  return {
    isVisible: isElementVisibleInViewport(el),
  };
};

export default (ctx: object, actions: Action) => {
  const context = ctx as OnStartHandlerContext;
  const { getDraggers, getContainers } = context;
  const vDraggers = getDraggers();
  const vContainers = getContainers();
  const draggerKeys = Object.keys(vDraggers);
  const containerKeys = Object.keys(vContainers);

  draggerKeys.forEach(key => {
    const dragger = vDraggers[key];
    const rect = getDimension(dragger);
    (dragger as any).setDimension({ rect });
  });

  containerKeys.forEach(key => {
    const container = vContainers[key];
    const rect = getDimension(container);
    container.dimension = {
      rect,
      subject: getSubject(container.el!),
      within: withinElement(container.el!),
    };
  });

  actions.next();
};
