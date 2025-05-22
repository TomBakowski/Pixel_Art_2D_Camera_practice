import { Camera } from './camera.js';
import { Map } from './map.js';


const GAME_WIDTH = 512;
const GAME_HEIGHT = 512;

class Game {
  constructor() {
    this.map = new Map();
    this.camera = new Camera(this.map, GAME_WIDTH, GAME_HEIGHT);
    this.keys = [];
    this.debug = false;

    window.addEventListener('keydown', e => {
      if (this.keys.indexOf(e.key) === -1) {
        this.keys.unshift(e.key);
      }
    });

    window.addEventListener('keyup', e => {
      if (e.key === 'd') {
        this.debug = !this.debug;
      } else {
        const index = this.keys.indexOf(e.key)

        if (index > -1) {
          this.keys.splice(index, 1);
        }
      }
    });
  }

  update(deltaTime) {
    let speedX = 0;
    let speedY = 0;

    if (this.keys[0] === 'ArrowLeft') speedX = -1;
    else if (this.keys[0] === 'ArrowRight') speedX = 1;
    else if (this.keys[0] === 'ArrowUp') speedY = -1;
    else if (this.keys[0] === 'ArrowDown') speedY = 1;

    this.camera.move(deltaTime, speedX, speedY);
  }

  drawLayer(layer, ctx) {
    const startCol = Math.floor(this.camera.x / this.map.tileSize);
    const endCol = startCol + (this.camera.width / this.map.tileSize)
    const startRow = Math.floor(this.camera.y / this.map.tileSize);
    const endRow = startRow + (this.camera.height / this.map.tileSize);
    const offsetX = -this.camera.x + startCol * this.map.tileSize;
    const offsetY = -this.camera.y + startRow * this.map.tileSize;

    for(let row = startRow; row <= endRow; row++) {
      for (let column = startCol; column <= endCol; column++) {
        const tile = this.map.getTile(layer, column, row);

        const x = (column - startCol) * this.map.tileSize + offsetX;
        const y = (row - startRow) * this.map.tileSize + offsetY;
        
         ctx.drawImage(
          this.map.image, 
          (tile - 1) * this.map.image_tile % this.map.image.width,
          Math.floor((tile - 1) / this.map.image_cols) * this.map.image_tile,
          this.map.image_tile,
          this.map.image_tile,
          Math.round(x),
          Math.round(y),
          this.map.tileSize,
          this.map.tileSize,
        );

        if (this.debug) {
          ctx.strokeRect(
            Math.round(x),
            Math.round(y),
            this.map.tileSize,
            this.map.tileSize,
          );
        }
      }
    }
  }

  render(ctx) {
    this.drawLayer(0, ctx);
    this.drawLayer(1, ctx);
  }
}

window.addEventListener('load', function() {
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = GAME_WIDTH;
  canvas.height = GAME_HEIGHT;
  canvas.imageSmoothingEnabled = false;



  const game = new Game();
  game.render(ctx);

  let lastTime = 0;

  function animate(timestamp) {
    const deltaTime = (timestamp - lastTime) / 1000; // convert to seconds
    lastTime = timestamp;
    game.update(deltaTime);
    game.render(ctx);

    requestAnimationFrame(animate);
  }

  animate(0);

})
