import $ from 'jquery';

export default class Sprite {
  constructor(parent, attrs) {
    this.alive = true;
    this.parent = parent;
    this.children = [];
    this.$element = $('<div>').addClass('sprite');

    this.x = attrs.x || 0;
    this.y = attrs.y || 0;
    this.width = attrs.width || 10;
    this.height = attrs.height || 10;
    this.bgColor = attrs.bgColor || 'magenta';
    this.health = attrs.health || 0;
    this.zIndex = attrs.zIndex || 1;

    this.velocity = attrs.velocity || {x: 0, y: 0};
    this.speed = attrs.speed || 0;
    this.lifetime = attrs.lifetime || Infinity;

    parent.$element.append(this.$element);
    this.setPosition(this.x, this.y);
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

  takeDamage(damage) {
    this.health -= damage;
  }

  setPosition(x, y) {
    this.$element.css({
      left: x,
      bottom: y
    });
  }

  overlaps(sprite) {
    if (this === sprite) { return false; }

    let bounds = this.$element.offset();
    bounds.right = bounds.left + this.width;
    bounds.bottom = bounds.top + this.height;

    let compare = sprite.$element.offset();
    compare.right = compare.left + sprite.width;
    compare.bottom = compare.top + sprite.height;

    return !(
      compare.right < bounds.left ||
      compare.left > bounds.right ||
      compare.bottom < bounds.top ||
      compare.top > bounds.bottom
    );
  }

  update(dt) {
    if (this.lifetime <= 0) {
      return this.destroy();
    }
    this.y += this.velocity.y * dt;
    this.x += this.velocity.x * dt;
    this.lifetime -= dt;

    this.setPosition(this.x, this.y);

    // iterate backwards so we can splice
    for (let i = this.children.length - 1; i >= 0; i--) {
      let sprite = this.children[i];
      if (sprite.alive) {
        sprite.update(dt);
      } else {
        this.children.splice(i, 1);
      }
    }
  }

  destroy() {
    this.$element.remove();
    this.alive = false;
    this.parent = null;
    this.children.forEach(sprite => {
      sprite.destroy();
    });
  }
}
