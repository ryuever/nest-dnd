import { DraggerEffectHandler, Orientation } from '../types';

const transform = (orientation: Orientation, value: number) => {
  return orientation === Orientation.Horizontal
    ? `translateX(${value}px)`
    : `translateY(${value}px)`;
};

const fluid: DraggerEffectHandler = options => {
  const { el, placedPosition, shouldMove, orientation } = options;
  const height =
    orientation === Orientation.Horizontal ? el.clientWidth : el.clientHeight;

  // or z-index will not work
  el.style.position = 'relative';

  const left =
    orientation === Orientation.Horizontal && placedPosition === 'left';
  const top = orientation === Orientation.Vertical && placedPosition === 'top';

  if ((left || top) && shouldMove) {
    el.style.transform = transform(orientation, height);
  } else {
    el.style.transform = transform(orientation, -height);
  }
  el.style.transition = 'transform 0.25s ease-in';
  el.style.zIndex = '1000';
  return () => {
    el.style.transform = transform(orientation, 0);
    el.style.zIndex = '0';
  };
};

export default fluid;
