import Sprite from './sprite';
import Input from './input';
import Projectile from './projectile';

export default class Player extends Sprite {
  constructor(parent, x, y) {
    super(parent);

    this.positionComp.x = x;
    this.positionComp.y = y;

    this.appearanceComp.width = 20;
    this.appearanceComp.height = 20;
    this.appearanceComp.zIndex = 100;
    this.appearanceComp.bgColor = 'blue';

    this.input = new Input();

    this.speed = 200;
    this.health = 1;
    this.fireRate = 150; // ms between shots
    this.msSinceFired = Infinity;
  }

  move(dt, direction) {
    if (direction === 'left') {
      this.velocity.x = -this.speed;
    } else if (direction === 'right') {
      this.velocity.x = this.speed;
    } else if (direction === 'up') {
      this.velocity.y = this.speed;
    } else if (direction === 'down') {
      this.velocity.y = -this.speed;
    }
  }

  stop() {
    this.velocity.x = 0;
    this.velocity.y = 0;
  }

  shoot() {
    if (this.msSinceFired >= this.fireRate) {
      this.spawnBullet();
      this.msSinceFired = 0;
    }
  }

  spawnBullet() {
    this.parent.children.push(
      new Projectile(this.parent, this.positionComp.x, this.positionComp.y + this.appearanceComp.height, 0, 500, 1)
    );
  }

  update(dt) {
    if (this.input.pressed.left) {
      this.move(dt, 'left');
    } else if (this.input.pressed.right) {
      this.move(dt, 'right');
    } else {
      this.stop();
    }

    if (this.input.pressed.space || this.input.pressed.up) {
      this.shoot();
    }

    this.msSinceFired += dt*1000;

    super.update(dt);
  }
}
