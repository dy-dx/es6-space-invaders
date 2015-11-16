import Sprite from './sprite';

export default class Projectile extends Sprite {
  constructor(parent, x, y, vx, vy, lifetime=2) {
    let attrs = {
      x: x,
      y: y,
      width: 6,
      height: 10,
      zIndex: 200,
      bgColor: 'yellow'
    };

    super(parent, attrs);

    this.velocity = {
      x: vx,
      y: vy
    };

    this.lifetime = lifetime;
  }

  _hitTest(sprite) {
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
    this.lifetime -= dt;

    this.parent.children.forEach(sprite => {
      if (!this.alive ||
          this === sprite ||
          this.parent.player === sprite) {
        return;
      }

      if (this._hitTest(sprite)) {
        sprite.takeDamage(1);
        this.destroy();
      }
    });
    super.update(dt);
  }
}
