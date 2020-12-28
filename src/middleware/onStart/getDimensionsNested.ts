// Append `collisionRect` to dimension property.
// `getDimension` method should be considered.

import { orientationToAxis, axisMeasure } from '../../commons/utils';
import { OnStartHandlerContext } from '../../types';
import { Action } from 'sabar';

export default (ctx: object, actions: Action) => {
  const context = ctx as OnStartHandlerContext;
  const { vDraggers, dndConfig } = context;
  const { mode, collisionPadding = 0 } = dndConfig;

  if (mode !== 'nested') {
    actions.next();
    return;
  }

  // Only if under `nested` mode, `dimension` should be appended with
  // `collisionRect` property.
  for (const key in vDraggers) {
    const dragger = vDraggers[key];
    const { container, dimension } = dragger;
    const { rect } = dimension;
    const { top, right, bottom, left } = rect;
    const { containerConfig } = container;
    const { orientation } = containerConfig;
    const axis = orientationToAxis[orientation];
    const [first, second] = axisMeasure[axis];

    const firstCollisionRect = {
      top,
      right,
      bottom,
      left,
      [first]: Math.max((rect as any)[first] - collisionPadding, 0),
      [second]: (rect as any)[first],
    };

    const secondCollisionRect = {
      top,
      right,
      bottom,
      left,
      [first]: (rect as any)[second],
      [second]: (rect as any)[second] + collisionPadding,
    };

    dragger.dimension = {
      ...dimension,
      firstCollisionRect,
      secondCollisionRect,
    };
  }

  actions.next();
};
