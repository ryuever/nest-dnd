import { orientationToMeasure } from '../../../commons/utils';
import { Action } from 'sabar';
import { OnMoveHandleContext } from '../../../types';
import Container from '../../../Container';

const handleEnterOtherContainer = (ctx: object, actions: Action) => {
  const context = ctx as OnMoveHandleContext;
  const {
    impactRawInfo,
    action: { operation, isHomeContainerFocused, effectsManager },
  } = context;

  if (operation !== 'onEnter' || isHomeContainerFocused) {
    actions.next();
    return;
  }

  const {
    impactVContainer,
    impactPosition,
    candidateVDraggerIndex,
  } = impactRawInfo;

  const {
    containerConfig: { containerEffect, draggerEffect, orientation },
    children,
  } = impactVContainer as Container;

  const measure = orientationToMeasure(orientation);

  if (typeof containerEffect === 'function') {
    // const teardown = containerEffect({
    //   el: impactVContainer!.el,
    // });
    // effectsManager!.impactContainerEffects.push({
    //   teardown,
    //   vContainer: impactVContainer as Container,
    // });
  }

  if (typeof draggerEffect !== 'function') {
    actions.next();
    return;
  }

  let initialValue = candidateVDraggerIndex || 0;

  const impact = {
    index: initialValue,
    impactVContainer: impactVContainer as Container,
    impactPosition,
  };

  const len = children.getSize();

  for (let i = initialValue; i < len; i++) {
    const vDragger = children.getItem(i);
    const isHighlight = i === initialValue;
    const falsy = !isHighlight || impactPosition === 'top';

    if (falsy) {
      const teardown = draggerEffect({
        placedPosition: (isHighlight ? impactPosition : measure[0]) as any,
        shouldMove: falsy,
        downstream: falsy,
        el: vDragger.el,
        dimension: vDragger.dimension.rect,
        isHighlight,
      });
      effectsManager!.downstreamDraggersEffects.push({ teardown, vDragger });
    }
  }

  context.impact = impact;

  actions.next();
};

export default handleEnterOtherContainer;
