import { orientationToMeasure } from '../../../commons/utils';
import { Action } from 'sabar';
import { OnMoveHandleContext, OnMoveArgs, Impact } from '../../../types';
import ContainerManagerImpl from '../../../ContainerManagerImpl';

const handleEnterOtherContainer = (args: any, ctx: object, actions: Action) => {
  const { liftUpVDragger } = args as OnMoveArgs;
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
    candidateVDragger,
  } = impactRawInfo;

  const dropResult = {
    source: {
      path: liftUpVDragger.getPath(),
    },
    target: {
      path: candidateVDragger?.getPath(),
      isForwarding: false,
    },
  };

  const {
    containerConfig: { containerEffect, draggerEffect, orientation },
    children,
  } = impactVContainer as ContainerManagerImpl;

  const measure = orientationToMeasure(orientation);

  if (typeof containerEffect === 'function') {
    // const teardown = containerEffect({
    //   el: impactVContainer!.getElement(),
    // });
    // effectsManager!.impactContainerEffects.push({
    //   teardown,
    //   vContainer: impactVContainer as ContainerManagerImpl,
    // });
  }

  if (typeof draggerEffect !== 'function') {
    actions.next();
    return;
  }

  let initialValue = candidateVDraggerIndex || 0;

  const impact = {
    index: initialValue,
    impactVContainer: impactVContainer as ContainerManagerImpl,
    impactPosition,
    dropResult,
  };

  const len = children.getSize();

  for (let i = initialValue; i < len; i++) {
    const vDragger = children.getItem(i);
    const isHighlight = i === initialValue;
    const falsy = !isHighlight || impactPosition === measure[0];

    if (falsy) {
      const teardown = draggerEffect({
        orientation: impactVContainer!.getOrientation(),
        placedPosition: (isHighlight ? impactPosition : measure[0]) as any,
        shouldMove: falsy,
        downstream: falsy,
        el: vDragger.getElement()!,
        dimension: vDragger.dimension.rect,
        isHighlight,
      });
      effectsManager!.downstreamDraggersEffects.push({ teardown, vDragger });
    } else {
      dropResult.target.isForwarding = true;
    }
  }

  context.impact = impact as Impact;

  actions.next();
};

export default handleEnterOtherContainer;
