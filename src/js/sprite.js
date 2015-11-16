import $ from 'jquery';

export default class Sprite {
  constructor(parent, attrs) {
    this.parent = parent;
    this.children = [];
    this.$element = $('<div>').addClass('sprite');

    this.x = attrs.x || 0;
    this.y = attrs.y || 0;
    this.width = attrs.width || 10;
    this.height = attrs.height || 10;
    this.bgColor = attrs.bgColor || 'magenta';
    this.zIndex = attrs.zIndex || 1;

    this.speed = attrs.speed || 0;

    parent.$element.append(this.$element);
    this.draw();
  }

  draw() {
    this.$element.css({
      width: `${this.width}px`,
      height: `${this.height}px`,
      'background-color': this.bgColor,
      'z-index': this.zIndex,
    });
  }

  setPosition(x, y) {
    this.$element.css({
      left: x,
      bottom: y
    });
  }

  update(dt) {
    this.setPosition(this.x, this.y);
    this.children.forEach(sprite => {
      sprite.update(dt);
    });
  }

  destroy() {
    this.$element.remove();
    this.parent = null;
    this.children.forEach(sprite => {
      sprite.destroy();
    });
  }
}
