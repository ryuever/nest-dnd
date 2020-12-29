import { orientationToMeasure } from '../../../commons/utils';
import { Action } from 'sabar';
import { OnMoveHandleContext, Impact, OnMoveOperation } from '../../../types';
import Container from '../../../Container';
import Dragger from '../../../Dragger';

const handleReorderOnHomeContainer = (ctx: object, actions: Action) => {
  const context = ctx as OnMoveHandleContext;
  const {
    action: { operation, isHomeContainerFocused, effectsManager },
  } = context;

  if (operation !== OnMoveOperation.ReOrder || isHomeContainerFocused) {
    actions.next();
    return;
  }

  // actions.next()
  // return

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
  } = impactVContainer as Container;
  const currentIndex = context.impact.index || 0;

  const measure = orientationToMeasure(orientation);

  if (typeof draggerEffect !== 'function') {
    actions.next();
    return;
  }

  const impact = {
    impactVContainer,
    index: candidateVDraggerIndex,
    impactPosition,
  };

  // move down
  if (
    currentIndex < (candidateVDraggerIndex as number) ||
    (currentIndex === candidateVDraggerIndex &&
      impactPosition !== context.impact.impactPosition &&
      impactPosition === 'bottom')
  ) {
    if (impactPosition === measure[0]) {
      actions.next();
      return;
    }

    const index = effectsManager!.downstreamDraggersEffects.findIndex(
      ({ vDragger }) => {
        return vDragger.id === (candidateVDragger as Dragger).id;
      }
    );

    if (index !== -1) {
      const { teardown } = effectsManager!.downstreamDraggersEffects[index];
      effectsManager!.downstreamDraggersEffects.splice(index, 1);
      if (typeof teardown === 'function') teardown();
    }
  }

  // move up
  if (
    currentIndex > (candidateVDraggerIndex as number) ||
    (currentIndex === candidateVDraggerIndex &&
      impactPosition !== context.impact.impactPosition &&
      impactPosition === 'top')
  ) {
    if (impactPosition === measure[1]) {
      actions.next();
      return;
    }

    const teardown = draggerEffect({
      el: (candidateVDragger as Dragger).el,
      shouldMove: true,
      placedPosition: measure[0],
      downstream: true,
      dimension: (candidateVDragger as Dragger).dimension.rect,
      isHighlight: true,
    });

    effectsManager!.downstreamDraggersEffects.push({
      vDragger: candidateVDragger as Dragger,
      teardown,
    });
  }

  context.impact = impact as Impact;

  actions.next();
};

export default handleReorderOnHomeContainer;
