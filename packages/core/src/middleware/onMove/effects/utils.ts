import ContainerManagerImpl from '../../../ContainerManagerImpl';
import DraggerManagerImpl from '../../../DraggerManagerImpl';
import { Position } from '../../../types';

export const generateDraggerEffectKey = (
  vContainer: ContainerManagerImpl,
  impactVDragger: DraggerManagerImpl,
  placedPosition: Position
) => {
  return `${vContainer.id}_${impactVDragger.id}_${placedPosition}`;
};

export const generateContainerEffectKey = (
  vContainer: ContainerManagerImpl,
  status: string
) => {
  return `${vContainer.id}_${status}`;
};
