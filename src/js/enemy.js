import Sprite from './sprite';

export default class Enemy extends Sprite {
  constructor(parent, x, y) {
    super(parent);

    this.positionComp.x = x;
    this.positionComp.y = y;

    this.appearanceComp.width = 20;
    this.appearanceComp.height = 20;
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
