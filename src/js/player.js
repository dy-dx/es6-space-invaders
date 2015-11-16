import Sprite from './sprite';
import Input from './input';

export default class Player extends Sprite {
  constructor(parent, x, y) {
    let attrs = {
      x: x,
      y: y,
      width: 20,
      height: 20,
      zIndex: 100,
      bgColor: 'blue',
      speed: 200
    };

    super(parent, attrs);

    this.input = new Input();
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
    console.error('not implemented!');
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

    super.update(dt);
  }
}
