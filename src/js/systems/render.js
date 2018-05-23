import System from './system';

export default class RenderSystem extends System {
  static update(entities, _dt) {
    entities
      .filter(e => e.appearanceComp)
      .forEach(e => {
        e.appearanceComp.$element.css({
          left: `${e.positionComp.x}px`,
          bottom: `${e.positionComp.y}px`,
          // todo: cache these?
          width: `${e.appearanceComp.width}px`,
          height: `${e.appearanceComp.height}px`,
          'background-color': e.appearanceComp.bgColor,
          'z-index': e.appearanceComp.zIndex,
        });
      });
  }
}
