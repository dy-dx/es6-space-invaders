import System from './system';

export default class PhysicsSystem extends System {
  static update(entities, dt) {
    entities
    .filter(e => e.physicsComp)
    .map(e => {
      let p = e.positionComp;
      let v = e.physicsComp.velocity;

      p.y += v.y * dt;
      p.x += v.x * dt;
    });
  }

}
