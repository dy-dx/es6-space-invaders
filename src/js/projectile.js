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

  update(dt) {
    this.parent.children.forEach(sprite => {
      if (!this.alive || this.parent.player === sprite) {
        return;
      }

      if (this.overlaps(sprite)) {
        sprite.takeDamage(1);
        this.destroy();
      }
    });
    super.update(dt);
  }
}
