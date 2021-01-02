import { orientationToMeasure } from '../../../commons/utils';
import { generateDraggerEffectKey } from './utils';
import DraggerManagerImpl from '../../../DraggerManagerImpl';
import { Action } from 'sabar';
import { OnMoveHandleContext, OnMoveArgs } from '../../../types';

const handleImpactDraggerEffect = (args: any, ctx: object, actions: Action) => {
  const { liftUpVDragger } = args as OnMoveArgs;
  const context = ctx as OnMoveHandleContext;
  const {
    impactRawInfo,
    dndEffects,
    dndConfig: { withPlaceholder },
  } = context;

  const { impactVContainer, impactPosition, candidateVDragger } = impactRawInfo;

  if (withPlaceholder || !impactVContainer) {
    actions.next();
    return;
  }

  const {
    containerConfig: { orientation, impactDraggerEffect },
  } = impactVContainer;

  const effectsManager = dndEffects.find(impactVContainer.getId());

  const measure = orientationToMeasure(orientation);
  const positionIndex = measure.indexOf(impactPosition as string);

  if (typeof impactDraggerEffect === 'function') {
    const effectKey = generateDraggerEffectKey(
      impactVContainer,
      candidateVDragger as DraggerManagerImpl,
      impactPosition as any
    );
    const index = effectsManager.impactDraggerEffects.findIndex(
      ({ key }) => key === effectKey
    );

    if (index === -1) {
      effectsManager.clearImpactDraggerEffects();

      const teardown = impactDraggerEffect({
        orientation: impactVContainer!.getOrientation(),
        dragger: liftUpVDragger.el!,
        container: impactVContainer.el!,
        candidateDragger: (candidateVDragger as DraggerManagerImpl).el!,
        shouldMove: !positionIndex,
        downstream: !positionIndex,
        placedPosition: impactPosition as any,
        dimension: (candidateVDragger as DraggerManagerImpl).dimension.rect,
        isHighlight: true,
      });

      effectsManager.impactDraggerEffects.push({
        teardown,
        vDragger: candidateVDragger as DraggerManagerImpl,
        key: effectKey,
      });
    }

    context.output = {
      dragger: liftUpVDragger.el!,
      candidateDragger: (candidateVDragger as DraggerManagerImpl).el!,
      container: impactVContainer.el!,
      placedPosition: impactPosition as any,
    };
  }

  actions.next();
};

export default handleImpactDraggerEffect;
