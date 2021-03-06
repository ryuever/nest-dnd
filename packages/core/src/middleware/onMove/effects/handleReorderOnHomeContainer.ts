import { orientationToMeasure } from '../../../commons/utils';
import { Action } from 'sabar';
import {
  OnMoveHandleContext,
  Impact,
  OnMoveArgs,
  OnMoveOperation,
} from '../../../types';
import ContainerManagerImpl from '../../../ContainerManagerImpl';
import DraggerManagerImpl from '../../../DraggerManagerImpl';

const handleReorderOnHomeContainer = (
  args: any,
  ctx: object,
  actions: Action
) => {
  const { liftUpVDraggerIndex, liftUpVDragger } = args as OnMoveArgs;
  const context = ctx as OnMoveHandleContext;
  const {
    action: { operation, isHomeContainerFocused, effectsManager },
  } = context;

  if (operation !== OnMoveOperation.ReOrder || !isHomeContainerFocused) {
    actions.next();
    return;
  }

  const {
    impactRawInfo: {
      candidateVDragger,
      impactVContainer,
      impactPosition,
      candidateVDraggerIndex,
    },
  } = context;
  const {
    containerConfig: { orientation, draggerEffect },
  } = impactVContainer as ContainerManagerImpl;
  // current is the old impact
  const currentIndex = context.impact.index || 0;
  const measure = orientationToMeasure(orientation);

  if (typeof draggerEffect !== 'function') {
    actions.next();
    return;
  }

  const dropResult = {
    source: {
      path: liftUpVDragger.getPath(),
    },
    target: {
      path: candidateVDragger?.getPath(),
      isForwarding: false,
    },
  };

  if (currentIndex === candidateVDraggerIndex) {
    if (impactPosition === measure[1]) {
      dropResult.target.isForwarding = true;
    }
  }

  const impact = {
    impactVContainer,
    index: candidateVDraggerIndex,
    impactPosition,
    dropResult,
  };

  // move down
  if (
    currentIndex < (candidateVDraggerIndex as number) ||
    (currentIndex === candidateVDraggerIndex &&
      impactPosition === measure[1] &&
      impactPosition !== context.impact.impactPosition)
  ) {
    if (impactPosition === measure[0]) {
      actions.next();
      return;
    }

    // placed after candidate
    dropResult.target.isForwarding = true;

    if ((candidateVDraggerIndex as number) <= liftUpVDraggerIndex) {
      const index = effectsManager!.downstreamDraggersEffects.findIndex(
        ({ vDragger }) => {
          return (
            vDragger.getId() ===
            (candidateVDragger as DraggerManagerImpl).getId()
          );
        }
      );
      if (index !== -1) {
        const { teardown } = effectsManager!.downstreamDraggersEffects[index];
        effectsManager!.downstreamDraggersEffects.splice(index, 1);
        if (typeof teardown === 'function') teardown();
      }
    }

    if ((candidateVDraggerIndex as number) > liftUpVDraggerIndex) {
      const teardown = draggerEffect({
        orientation: impactVContainer!.getOrientation(),
        el: (candidateVDragger as DraggerManagerImpl).getElement()!,
        shouldMove: true,
        placedPosition: measure[1],
        downstream: false,
        dimension: (candidateVDragger as DraggerManagerImpl).dimension.rect,
        isHighlight: true,
      });
      effectsManager!.upstreamDraggersEffects.push({
        vDragger: candidateVDragger as DraggerManagerImpl,
        teardown,
      });
    }

    const children = impactVContainer?.children;

    // fallback move from outside. Maybe it could be called RangeUpdate!
    for (let i = liftUpVDraggerIndex + 1; i < candidateVDraggerIndex!; i++) {
      const dragger = children?.getItem(i);
      const index = effectsManager!.downstreamDraggersEffects.findIndex(
        ({ vDragger }) => {
          return vDragger.getId() === (dragger as DraggerManagerImpl).getId();
        }
      );
      if (index === -1) {
        const teardown = draggerEffect({
          orientation: impactVContainer!.getOrientation(),
          el: (dragger as DraggerManagerImpl).getElement()!,
          shouldMove: true,
          placedPosition: measure[1],
          downstream: false,
          dimension: (dragger as DraggerManagerImpl).dimension.rect,
          isHighlight: true,
        });
        effectsManager!.upstreamDraggersEffects.push({
          vDragger: dragger as DraggerManagerImpl,
          teardown,
        });
      }
    }
  }

  // move up
  if (
    currentIndex > (candidateVDraggerIndex as number) ||
    (currentIndex === candidateVDraggerIndex &&
      impactPosition === measure[0] &&
      impactPosition !== context.impact.impactPosition)
  ) {
    if (impactPosition === measure[1]) {
      actions.next();
      return;
    }

    if ((candidateVDraggerIndex as number) < liftUpVDraggerIndex) {
      const teardown = draggerEffect({
        orientation: impactVContainer!.getOrientation(),
        el: (candidateVDragger as DraggerManagerImpl).getElement()!,
        shouldMove: true,
        placedPosition: measure[0],
        downstream: true,
        dimension: (candidateVDragger as DraggerManagerImpl).dimension.rect,
        isHighlight: true,
      });
      effectsManager!.downstreamDraggersEffects.push({
        vDragger: candidateVDragger as DraggerManagerImpl,
        teardown,
      });
    }

    if ((candidateVDraggerIndex as number) >= liftUpVDraggerIndex) {
      const index = effectsManager!.upstreamDraggersEffects.findIndex(
        ({ vDragger }) => {
          return (
            vDragger.getId() ===
            (candidateVDragger as DraggerManagerImpl).getId()
          );
        }
      );

      if (index !== -1) {
        const { teardown } = effectsManager!.upstreamDraggersEffects[index];
        effectsManager!.upstreamDraggersEffects.splice(index, 1);
        if (typeof teardown === 'function') teardown();
      }
    }

    const children = impactVContainer?.children;

    // fallback move from outside. Maybe it could be called RangeUpdate!
    for (let i = candidateVDraggerIndex! + 1; i < liftUpVDraggerIndex; i++) {
      const dragger = children?.getItem(i);
      const index = effectsManager!.downstreamDraggersEffects.findIndex(
        ({ vDragger }) => {
          return vDragger.getId() === (dragger as DraggerManagerImpl).getId();
        }
      );
      if (index === -1) {
        const teardown = draggerEffect({
          orientation: impactVContainer!.getOrientation(),
          el: (dragger as DraggerManagerImpl).getElement()!,
          shouldMove: true,
          placedPosition: measure[0],
          downstream: true,
          dimension: (dragger as DraggerManagerImpl).dimension.rect,
          isHighlight: true,
        });
        effectsManager!.downstreamDraggersEffects.push({
          vDragger: dragger as DraggerManagerImpl,
          teardown,
        });
      }
    }
  }

  context.impact = impact as Impact;
  actions.next();
};

export default handleReorderOnHomeContainer;
