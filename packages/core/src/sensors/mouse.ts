import { bindEvents } from '../commons/bindEvents';
import { findClosestDraggerElementFromEvent } from '../find';
import {
  MoveAPI,
  GetClone,
  Impact,
  MoveHandlerOutput,
  NestDNDConfig,
  MoveHandlerResult,
  DropResult,
} from '../types';
import DraggerManagerImpl from '../DraggerManagerImpl';
import ContainerManagerImpl from '../ContainerManagerImpl';
import Sabar from 'sabar';
import DndEffects from '../middleware/onMove/effects/DndEffects';

class Mouse {
  private moveAPI: MoveAPI;
  private getClone: GetClone;
  private onStartHandler: Sabar;
  private onMoveHandler: Sabar;
  private getDragger: (el: HTMLElement) => DraggerManagerImpl;
  private dndEffects: DndEffects;
  private updateImpact: (impact: Impact) => void;
  private dndConfig: NestDNDConfig;

  constructor({
    moveAPI,
    getClone,
    onStartHandler,
    onMoveHandler,
    getDragger,
    dndEffects,
    updateImpact,
    dndConfig,
  }: {
    moveAPI: MoveAPI;
    getClone: GetClone;
    onStartHandler: Sabar;
    onMoveHandler: Sabar;
    getDragger: (el: HTMLElement) => DraggerManagerImpl;
    dndEffects: DndEffects;
    updateImpact: (impact: Impact) => void;
    dndConfig: NestDNDConfig;
  }) {
    this.moveAPI = moveAPI;
    this.getClone = getClone;
    this.getDragger = getDragger;
    this.onStartHandler = onStartHandler;
    this.onMoveHandler = onMoveHandler;
    this.dndEffects = dndEffects;
    this.updateImpact = updateImpact;
    this.dndConfig = dndConfig;
  }

  start() {
    bindEvents(window, {
      eventName: 'mousedown',
      fn: event => {
        const el = findClosestDraggerElementFromEvent(event);
        if (el === -1) return;
        // https://stackoverflow.com/a/19164149/2006805 In order to prevent text
        // selection when moving cursor
        event.preventDefault();
        // const draggerId = el.getAttribute('data-dragger-id');
        // const dragger = this.getDragger(draggerId as string);
        const dragger = this.getDragger(el);
        if (!dragger) return;
        const vContainer = dragger.container;
        // will cause sort!!!!
        this.onStartHandler.start({ dragger, event });
        // should be placed after sorter
        const liftUpVDraggerIndex = vContainer.children.findIndex(dragger);

        const clone = this.getClone();
        let output: MoveHandlerOutput;
        let dropResult: DropResult;

        // If dragger exists, then start to bind relative listener
        const unbind = bindEvents(window, [
          {
            // target should be moved by mousemove event.
            eventName: 'mousemove',
            fn: (event: MouseEvent) => {
              try {
                // ts-hint: https://stackoverflow.com/questions/41110144/property-clientx-does-not-exist-on-type-event-angular2-directive
                const impactPoint = [event.clientX, event.clientY];
                event.preventDefault();
                event.stopPropagation();
                const isHomeContainer = (vContainer: ContainerManagerImpl) => {
                  return vContainer
                    ? vContainer.id === dragger.container.id
                    : false;
                };

                const result = this.onMoveHandler.start({
                  impactPoint,
                  impactVDragger: dragger,
                  liftUpVDragger: dragger,
                  liftUpVDraggerIndex,
                  dragger,
                  clone,
                  isHomeContainer,
                  ...this.moveAPI(),
                }) as MoveHandlerResult;

                const { impact } = result;
                const {
                  dropResult: {
                    source: { path: sourcePath },
                  },
                } = impact;
                const target = impact.dropResult.target!;
                const { path: targetPath, isForwarding } = target;
                console.log(
                  'impact result ',
                  `place ${sourcePath} ${
                    isForwarding ? 'after' : 'before'
                  } ${targetPath}`
                );
                dropResult = impact.dropResult;
                output = result.output;
                if (impact) this.updateImpact(impact);
              } catch (err) {
                console.log('err', err);
              }
            },
          },
          {
            eventName: 'mouseup',
            fn: () => {
              unbind();
              const { dragger } = output || {};
              if (this.dndConfig.onDropEnd) {
                const { source, target } = dropResult;
                if (
                  target &&
                  JSON.stringify(source.path) === JSON.stringify(target.path)
                ) {
                  dropResult.dropReason = 'CANCEL';
                }

                this.dndConfig.onDropEnd(dropResult);
              }

              if (this.dndConfig.onDrop && dragger) {
                this.dndConfig.onDrop(output);
              }

              // this.updateImpact({} as any);
              this.dndEffects.teardown();
              if (clone) document.body.removeChild(clone);
            },
          },
        ]);
      },
    });
  }
}

export default Mouse;
