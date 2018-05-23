import Sprite from './sprite';

export default class Projectile extends Sprite {
  constructor(parent, x, y, vx, vy, lifetime=2) {
    super(parent);

    this.positionComp.x = x;
    this.positionComp.y = y;

    this.physicsComp = Object.assign(this.physicsComp, {
      width: 6,
      height: 10,
      velocity: {
        x: vx,
        y: vy,
      },
    });

    this.appearanceComp.width = this.physicsComp.width;
    this.appearanceComp.height = this.physicsComp.height;
    this.appearanceComp.zIndex = 200;
    this.appearanceComp.bgColor = 'yellow';

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
