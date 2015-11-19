import $ from 'jquery';
import Wall from './wall';
import Player from './player';
import Enemy from './enemy';

import RenderSystem from './systems/render';
import PhysicsSystem from './systems/physics';

export default class Game {
  constructor(elem, width, height) {
    this.height = height;
    this.width = width;

    this.positionComp = {
      x: 0,
      y: 0
    };
    this.appearanceComp = {
      $element: $(elem),
      width: this.width,
      height: this.height,
      'background-color': 'black',
    };


    this.children = [];
    this.player = null;
    this.systems = [
      PhysicsSystem,
      RenderSystem,
    ];

    this.reset();
  }

  makeWalls() {
    let walls = [];
    let wallWidth = 30;
    walls.push( new Wall(this, wallWidth/2, this.height/2, wallWidth, this.height) );
    walls.push( new Wall(this, this.width - wallWidth/2, this.height/2, wallWidth, this.height) );
    return walls;
  }

  reset() {
    this.children = [];

    this.children.push(...this.makeWalls());

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

    RenderSystem.update([this]);
    this.systems.forEach(s => {
      s.update(this.children, dt);
    });
  }
}
