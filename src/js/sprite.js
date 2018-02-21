import $ from 'cash-dom';

export default class Sprite {
  constructor(parent) {
    this.alive = true;
    this.parent = parent;
    this.children = [];

    this.positionComp = {
      x: 0,
      y: 0
    };

    this.appearanceComp = {
      $element: $('<div>').addClass('sprite'),
      width: 10,
      height: 10,
      bgColor: 'magenta',
      zIndex: 1,
    };

    this.health = 0;
    this.lifetime = Infinity;

    parent.appearanceComp.$element.append(this.appearanceComp.$element);
  }

  takeDamage(damage) {
    this.health -= damage;
  }

  overlaps(sprite) {
    if (this === sprite) { return false; }

    let bounds = {
      left: this.positionComp.x - this.appearanceComp.width / 2,
      top: this.positionComp.y + this.appearanceComp.height / 2,
    };
    bounds.right = bounds.left + this.appearanceComp.width;
    bounds.bottom = bounds.top - this.appearanceComp.height;

    let compare = {
      left: sprite.positionComp.x - sprite.appearanceComp.width / 2,
      top: sprite.positionComp.y + sprite.appearanceComp.height / 2,
    };
    compare.right = compare.left + sprite.appearanceComp.width;
    compare.bottom = compare.top - sprite.appearanceComp.height;

    return !(
      compare.right < bounds.left ||
      compare.left > bounds.right ||
      compare.bottom > bounds.top ||
      compare.top < bounds.bottom
    );
  }

  update(dt) {
    if (this.lifetime <= 0) {
      return this.destroy();
    }
    this.lifetime -= dt;
  }

  destroy() {
    this.appearanceComp.$element.remove();
    this.alive = false;
    this.parent = null;
    this.children.forEach(sprite => {
      sprite.destroy();
    });
  }
}
