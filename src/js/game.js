import $ from 'jquery';
import Player from './player';
import Enemy from './enemy';

export default class Game {
  constructor(elem, width, height) {
    this.$element = $(elem);
    this.height = height;
    this.width = width;

    this.$element.height(height);
    this.$element.width(width);

    this.children = [];
    this.player = null;

    this.reset();
  }

  reset() {
    this.children = [];

    for (let i = 0; i < 10; i++) {
      this.children.push(new Enemy(this, i*50 + 100, 400));
    }

    this.player = new Player(this, this.width/2, 50);
    this.children.push(this.player);
  }

  update(dt) {
    // iterate backwards so we can splice
    for (let i = this.children.length - 1; i >= 0; i--) {
      let sprite = this.children[i];
      if (sprite.alive) {
        sprite.update(dt);
      } else {
        this.children.splice(i, 1);
      }
    }
  }
}
