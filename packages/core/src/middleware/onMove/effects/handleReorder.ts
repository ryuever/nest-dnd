import {
  OnMoveHandleContext,
  OnMoveArgs,
  OnMoveOperation,
} from '../../../types';
import { Action } from 'sabar';

const handleReorder = (args: any, ctx: object, actions: Action) => {
  const { prevImpact, isHomeContainer } = args as OnMoveArgs;
  const context = ctx as OnMoveHandleContext;
  const {
    impactRawInfo: { impactVContainer: currentImpactVContainer },
    dndEffects,
  } = context;
  const { impactVContainer: prevImpactVContainer } = prevImpact;

  if (
    prevImpactVContainer &&
    currentImpactVContainer &&
    prevImpactVContainer.getId() === currentImpactVContainer.getId()
  ) {
    const effectsManager = dndEffects.find(currentImpactVContainer.getId());

    context.action = {
      operation: OnMoveOperation.ReOrder,
      isHomeContainerFocused: isHomeContainer(currentImpactVContainer),
      effectsManager,
    };

    actions.next();
    return;
  }

  actions.next();
};

export default handleReorder;
