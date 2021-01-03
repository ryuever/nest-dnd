import { Action } from 'sabar';
import { OnStartHandlerContext } from '../../types';
import DraggerManagerImpl from '../../DraggerManagerImpl';

/**
 * 1. Container should be enclosed by other container entirely.
 * 2. Container should be on the outer of other container.
 * 3. The intersection of containers is not allowed.
 */

export default (args: any, ctx: object, actions: Action) => {
  const { dragger }: { dragger: DraggerManagerImpl } = args;
  const context = ctx as OnStartHandlerContext;
  const { updateCandidateContainerMap } = context;

  updateCandidateContainerMap(dragger.getGroupId());

  actions.next();
};
