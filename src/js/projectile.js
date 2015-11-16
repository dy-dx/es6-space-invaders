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
    if (this.lifetime <= 0) {
      return this.destroy();
    }
    this.y += this.velocity.y * dt;
    this.lifetime -= dt;
    super.update(dt);
  }
}
