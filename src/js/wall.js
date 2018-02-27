import Sprite from './sprite';

export default class Wall extends Sprite {
  constructor(parent, x, y, width=50, height=50) {
    super(parent);

    this.positionComp.x = x;
    this.positionComp.y = y;

    this.physicsComp = Object.assign(this.physicsComp, {
      width,
      height,
      collision: {
        type: 'static'
      },
    });

    this.appearanceComp.width = this.physicsComp.width;
    this.appearanceComp.height = this.physicsComp.height;
    this.appearanceComp.zIndex = 10;
    this.appearanceComp.bgColor = 'gray';

    this.health = 1;
  }

}
