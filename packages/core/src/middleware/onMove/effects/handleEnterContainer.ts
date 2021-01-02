import EffectsManager from './EffectsManager';
import report from '../../../reporter';
import ContainerManagerImpl from '../../../ContainerManagerImpl';
import {
  Impact,
  OnMoveHandleContext,
  OnMoveArgs,
  OnMoveOperation,
} from '../../../types';
import { Action } from 'sabar';

const handleEnterContainer = (args: any, ctx: object, actions: Action) => {
  const { liftUpVDragger, isHomeContainer, prevImpact } = args as OnMoveArgs;
  const context = ctx as OnMoveHandleContext;
  const { impactRawInfo, dndEffects } = context;

  const prevImpactVContainer = prevImpact.impactVContainer;
  const currentImpactVContainer = impactRawInfo.impactVContainer;

  if (
    (!prevImpactVContainer && currentImpactVContainer) ||
    (prevImpactVContainer &&
      currentImpactVContainer &&
      prevImpactVContainer.id !== currentImpactVContainer.id)
  ) {
    let effectsManager = dndEffects.find(currentImpactVContainer.id);
    const { impactVContainer } = impactRawInfo;

    if (!effectsManager) {
      effectsManager = new EffectsManager({
        dragger: liftUpVDragger,
        impactContainer: impactVContainer as ContainerManagerImpl,
      });

      dndEffects.add(effectsManager);
    }

    report.logEnterContainer(currentImpactVContainer);

    context.action = {
      operation: OnMoveOperation.OnEnter,
      isHomeContainerFocused: isHomeContainer(currentImpactVContainer),
      effectsManager,
    };
    context.impact = {
      impactVContainer: currentImpactVContainer,
      index: null,
      impactPosition: impactRawInfo.impactPosition,
      dropResult: {
        target: null,
        source: {
          path: liftUpVDragger.getPath(),
        },
      },
    } as Impact;
  }

  actions.next();
};

export default handleEnterContainer;
