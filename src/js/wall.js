import Sprite from './sprite';

export default class Wall extends Sprite {
  constructor(parent, x, y, width=50, height=50) {
    let attrs = {
      x: x,
      y: y,
      width: width,
      height: height,
      zIndex: 10,
      bgColor: 'gray',
      health: 1,
    };

    super(parent, attrs);
  }

}
