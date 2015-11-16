import Sprite from './sprite';

export default class Enemy extends Sprite {
  constructor(parent, x, y) {
    let attrs = {
      x: x,
      y: y,
      width: 20,
      height: 20,
      zIndex: 100,
      bgColor: 'red'
    };

    super(parent, attrs);
  }

  update(dt) {
    super.update(dt);
  }
}
