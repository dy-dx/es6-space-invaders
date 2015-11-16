import Game from './game';

const game = new Game(document.getElementById('main'), 640, 480);
let last = Date.now();
const loop = () => {
  let now = Date.now();
  game.update((now - last)/1000);
  last = now;
  window.requestAnimationFrame(loop);
};

loop();
