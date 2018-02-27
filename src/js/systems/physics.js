import System from './system';

export default class PhysicsSystem extends System {
  static update(entities, dt) {
    const physicsEntities = entities.filter(e => e.physicsComp);

    physicsEntities.map(e => {
      const p = e.positionComp;
      const c = e.physicsComp.collision;
      const v = e.physicsComp.velocity;

      if (!c || c.type !== 'moveable') {
        p.y += v.y * dt;
        p.x += v.x * dt;
        return;
      }

      // naive collision handling, resolve x first
      if (v.x !== 0) {
        p.x += v.x * dt;
        physicsEntities.filter(o => o.physicsComp.collision).forEach(o => {
          if (e.overlaps(o)) {
            if (Math.sign(v.x) > 0) {
              p.x = o.positionComp.x - o.appearanceComp.width/2 - e.appearanceComp.width/2;
            } else {
              p.x = o.positionComp.x + o.appearanceComp.width/2 + e.appearanceComp.width/2;
            }
          }
        });
      }

      if (v.y !== 0) {
        p.y += v.y * dt;
        physicsEntities.filter(o => o.physicsComp.collision).forEach(o => {
          if (e.overlaps(o)) {
            if (Math.sign(v.y) > 0) {
              p.y = o.positionComp.y - o.appearanceComp.height/2 - e.appearanceComp.height/2;
            } else {
              p.y = o.positionComp.y + o.appearanceComp.height/2 + e.appearanceComp.height/2;
            }
          }
        });
      }
    });
  }

}
