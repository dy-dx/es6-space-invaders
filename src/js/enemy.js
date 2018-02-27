import Sprite from './sprite';

export default class Enemy extends Sprite {
  constructor(parent, x, y) {
    super(parent);

    this.positionComp.x = x;
    this.positionComp.y = y;

    this.physicsComp = Object.assign(this.physicsComp, {
      width: 20,
      height: 20,
    });

    this.appearanceComp.width = this.physicsComp.width;
    this.appearanceComp.height = this.physicsComp.height;
    this.appearanceComp.zIndex = 100;
    this.appearanceComp.bgColor = 'red';

    this.health = 1;
  }

  update(dt) {
    super.update(dt);
    if (this.health <= 0) {
      this.destroy();
    }
  }
}
