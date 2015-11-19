import System from './system';

export default class RenderSystem extends System {
  static update(entities, dt) {
    entities
    .filter(e => e.appearanceComp)
    .map(e => {
      e.appearanceComp.$element.css({
        left: e.positionComp.x || 0,
        bottom: e.positionComp.y || 0,
        // todo: cache these?
        width: `${e.appearanceComp.width}px`,
        height: `${e.appearanceComp.height}px`,
        'background-color': e.appearanceComp.bgColor,
        'z-index': e.appearanceComp.zIndex,
      });
    });
  }

}
