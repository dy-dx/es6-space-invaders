import Sprite from './sprite';
import Input from './input';
import Projectile from './projectile';

export default class Player extends Sprite {
  constructor(parent, x, y) {
    super(parent);

    this.positionComp.x = x;
    this.positionComp.y = y;

    this.physicsComp = Object.assign(this.physicsComp, {
      width: 20,
      height: 20,
      collision: {
        type: 'moveable'
      },
    });

    this.appearanceComp.width = this.physicsComp.width;
    this.appearanceComp.height = this.physicsComp.height;
    this.appearanceComp.zIndex = 100;
    this.appearanceComp.bgColor = 'blue';

    this.input = new Input();

    this.speed = 300;
    this.health = 1;
    this.fireRate = 150; // ms between shots
    this.msSinceFired = Infinity;
  }

  move(dt, direction) {
    if (direction === 'left') {
      this.physicsComp.velocity.x = -this.speed;
    } else if (direction === 'right') {
      this.physicsComp.velocity.x = this.speed;
    } else if (direction === 'up') {
      this.physicsComp.velocity.y = this.speed;
    } else if (direction === 'down') {
      this.physicsComp.velocity.y = -this.speed;
    }
  }

  stop() {
    this.physicsComp.velocity.x = 0;
    this.physicsComp.velocity.y = 0;
  }

  shoot() {
    if (this.msSinceFired >= this.fireRate) {
      this.spawnBullet();
      this.msSinceFired = 0;
    }
  }

  spawnBullet() {
    this.parent.children.push(
      new Projectile(this.parent, this.positionComp.x, this.positionComp.y + this.physicsComp.height, 0, 500, 1)
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
