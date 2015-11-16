import $ from 'jquery';

const KEYCODES = {
  32: 'space',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
};

export default class Input {
  constructor() {
    this.pressed = {
      space: false,
      left: false,
      up: false,
      right: false,
      down: false
    };

    $(document).on('keydown', this.pressKey.bind(this));
    $(document).on('keyup', this.releaseKey.bind(this));
  }

  pressKey(evt) {
    evt.preventDefault();
    let direction = KEYCODES[evt.which];
    if (!direction) { return; }
    this.pressed[direction] = true;
  }

  releaseKey(evt) {
    evt.preventDefault();
    let direction = KEYCODES[evt.which];
    if (!direction) { return; }
    this.pressed[direction] = false;
  }
}
