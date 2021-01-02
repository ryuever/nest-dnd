import { orientationToMeasure } from '../../../commons/utils';
import {
  OnMoveHandleContext,
  Position,
  DraggerEffect,
  OnMoveArgs,
} from '../../../types';
import { Action } from 'sabar';
import ContainerManagerImpl from '../../../ContainerManagerImpl';
import DraggerManagerImpl from '../../../DraggerManagerImpl';

const handleEnterHomeContainer = (args: any, ctx: object, actions: Action) => {
  const { liftUpVDraggerIndex, liftUpVDragger } = args as OnMoveArgs;
  const context = ctx as OnMoveHandleContext;
  const {
    impactRawInfo,
    action: { operation, isHomeContainerFocused, effectsManager },
  } = context;

  if (operation !== 'onEnter' || !isHomeContainerFocused) {
    actions.next();
    return;
  }

  const {
    candidateVDragger,
    impactVContainer,
    impactPosition,
    candidateVDraggerIndex,
  } = impactRawInfo;

  const {
    containerConfig: { containerEffect, draggerEffect, orientation },
    children,
  } = impactVContainer as ContainerManagerImpl;

  const measure = orientationToMeasure(orientation);
  const positionIndex = measure.indexOf(impactPosition as Position);

  if (typeof containerEffect === 'function') {
    // const teardown = containerEffect({
    //   el: (impactVContainer as ContainerManagerImpl).el,
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

  const dropResult = {
    source: {
      path: liftUpVDragger.getPath(),
    },
    target: {
      path: candidateVDragger!.getPath(),
      isForwarding: false,
    },
  };

  const impact = {
    impactVContainer: impactVContainer as ContainerManagerImpl,
    index: positionIndex
      ? (candidateVDraggerIndex as number) + 1
      : (candidateVDraggerIndex as number),
    impactPosition,
    dropResult,
  };

  if (candidateVDraggerIndex === liftUpVDraggerIndex) {
    if (!positionIndex) effectsManager!.clearUpstreamEffects();
    else {
      const remainingEffects = [] as DraggerEffect[];
      effectsManager!.upstreamDraggersEffects.forEach(
        ({
          vDragger,
          teardown,
        }: {
          vDragger: DraggerManagerImpl;
          teardown: any;
        }) => {
          if (vDragger.id !== (candidateVDragger as DraggerManagerImpl).id)
            teardown();
          else remainingEffects.push({ vDragger, teardown });
        }
      );

      effectsManager!.upstreamDraggersEffects = remainingEffects;
    }
  }

  if ((candidateVDraggerIndex as number) < liftUpVDraggerIndex) {
    effectsManager!.clearUpstreamEffects();
    const initialValue = candidateVDraggerIndex as number;
    for (let i = initialValue; i < liftUpVDraggerIndex; i++) {
      const vDragger = children.getItem(i);
      const isHighlight = initialValue === i;

      const teardown = draggerEffect({
        orientation: impactVContainer!.getOrientation(),
        el: vDragger.el!,
        shouldMove: !isHighlight || !positionIndex,
        downstream: !isHighlight || !positionIndex,
        placedPosition: (isHighlight ? impactPosition : measure[0]) as Position,
        dimension: vDragger.dimension.rect,
        isHighlight,
      });
      effectsManager!.downstreamDraggersEffects.push({ teardown, vDragger });
    }
  }

  if (candidateVDraggerIndex && candidateVDraggerIndex > liftUpVDraggerIndex) {
    const initialValue = liftUpVDraggerIndex + 1;
    let endValue = candidateVDraggerIndex;
    if (positionIndex) endValue += 1;
    const reserved = [] as DraggerManagerImpl[];
    const reservedEffects = [] as DraggerEffect[];
    for (let i = initialValue; i < endValue; i++) {
      const vDragger = children.getItem(i);
      reserved.push(vDragger);
    }

    effectsManager!.upstreamDraggersEffects.forEach(
      ({ teardown, vDragger }) => {
        const { id } = vDragger;
        const index = reserved.findIndex(vDragger => vDragger.id === id);
        if (index !== -1) {
          reservedEffects.push({ teardown, vDragger });
        } else if (teardown) teardown();
      }
    );

    effectsManager!.upstreamDraggersEffects = reservedEffects;
  }

  context.impact = impact;

  actions.next();
};

export default handleEnterHomeContainer;
