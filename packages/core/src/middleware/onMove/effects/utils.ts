import ContainerManagerImpl from '../../../ContainerManagerImpl';
import DraggerManagerImpl from '../../../DraggerManagerImpl';
import { Position } from '../../../types';

export const generateDraggerEffectKey = (
  vContainer: ContainerManagerImpl,
  impactVDragger: DraggerManagerImpl,
  placedPosition: Position
) => {
  return `${vContainer.getId()}_${impactVDragger.getId()}_${placedPosition}`;
};

export const generateContainerEffectKey = (
  vContainer: ContainerManagerImpl,
  status: string
) => {
  return `${vContainer.getId()}_${status}`;
};
