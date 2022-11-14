export default {};

//Just an Idea of how a small engine based on this could look like

function init() {
  const game = {};

  // this vector is created outside of any pool scoop,
  // so it should be keept for the whole game runtime
  game.player = _v();

  return game;
}

// update is implicitly called within a wrapper like:
// _v(()=>{ update() })
function update(game) {
  // some game calculation

  // These vectors are created (or taken from the pool) inside the update function and
  // therefor will be given back to the pool after update() is run
  const r = _v(2, 3);
  const s = _v(3, 4);
  const t = _v(3, 4);

  r.add(s).mul(2);

  // ...

  // write back to game state
  game.player.x = r.x;
  game.player.y = t.y;
}

function draw(game) {
  drawSprite(1, game.player.x, game.player.y);
}
