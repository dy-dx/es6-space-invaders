import Sprite from './sprite';
import Input from './input';
import Projectile from './projectile';

export default class Player extends Sprite {
  constructor(parent, x, y) {
    let attrs = {
      x: x,
      y: y,
      width: 20,
      height: 20,
      zIndex: 100,
      bgColor: 'blue',
      speed: 200,
      health: 1,
    };

    super(parent, attrs);

    this.input = new Input();

    this.fireRate = 150; // ms between shots
    this.msSinceFired = Infinity;
  }

  move(dt, direction) {
    if (direction === 'left') {
      this.x -= this.speed * dt;
    } else if (direction === 'right') {
      this.x += this.speed * dt;
    } else if (direction === 'up') {
      this.y += this.speed * dt;
    } else if (direction === 'down') {
      this.y -= this.speed * dt;
    }
  }

  shoot() {
    if (this.msSinceFired >= this.fireRate) {
      this.spawnBullet();
      this.msSinceFired = 0;
    }
  }

  spawnBullet() {
    this.parent.children.push(new Projectile(this.parent, this.x, this.y + this.height, 0, 500, 1));
  }

  update(dt) {
    if (this.input.pressed.left) {
      this.move(dt, 'left');
    } else if (this.input.pressed.right) {
      this.move(dt, 'right');
    }
    if (this.input.pressed.space) {
      this.shoot();
    }

    this.msSinceFired += dt*1000;

    super.update(dt);
  }
}
