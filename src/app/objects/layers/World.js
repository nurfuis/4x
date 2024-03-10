import { COLUMNS, ROWS, WORLD_HEIGHT, WORLD_WIDTH } from "../../constants.js";
import { Vector2 } from "../../utils/Vector2.js";
import { randomInt } from "../../utils/randomInt.js";
import { GameObject } from "../GameObject.js";
import { Tile } from "../Tile.js";
import { Burrow } from "../features/Burrow.js";
import { Flower } from "../features/Flower.js";
import { Granary } from "../features/Granary.js";
import { Perch } from "../features/Perch.js";
import { Shrub } from "../features/Shrub.js";
import { Tree } from "../features/Tree.js";

const TERRAIN_TYPES = [
  { grass: { color: "rgba(5, 155, 55, 1)" } }, // Light green
  { water: { color: "rgba(0, 0, 255, 1)" } }, // Blue
  { hills: { color: "rgba(160, 82, 45, 1)" } }, // Brown
  { mountains: { color: "rgba(139, 69, 19, 1)" } }, // Dark brown
  { forest: { color: "rgba(0, 100, 0, 1)" } }, // Dark green
  { swamp: { color: "rgba(139, 69, 19, 1)" } }, // Transparent brown (swampy)
];

export class World extends GameObject {
  constructor() {
    super({
      position: new Vector2(0, 0),
    });
    this.id = "world";
    this.width = WORLD_WIDTH;
    this.height = WORLD_HEIGHT;

    this.columns = COLUMNS;
    this.rows = ROWS;

    this.gridWidth = Math.floor(WORLD_WIDTH / COLUMNS);
    this.gridHeight = Math.floor(WORLD_HEIGHT / ROWS);

    this.tiles = [];
    this.baseTile = Tile;
    this.terrain = TERRAIN_TYPES;
    this.terrainCount = {};
    for (let i = 0; i < this.terrain.length; i++) {
      const terrain = this.terrain[i];
      const terrainType = Object.keys(terrain)[0];
      this.terrainCount[terrainType] = 0;
      console.log("terrain", terrainType);
    }

    this.color = "rgba(255, 255, 255, 0.1)";
    this.border = 0;
  }

  createGrid() {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        const x1 = x * this.gridWidth;
        const y1 = y * this.gridHeight;

        const x2 = x1 + this.gridWidth;
        const y2 = y1 + this.gridHeight;

        this.addChild(new this.baseTile(x1, y1, x2, y2));
      }
    }
  }
  randomizePerch() {
    for (const tile of this.children) {
      if (
        tile.type == "forest" ||
        tile.type == "mountains" ||
        tile.type == "hills" ||
        tile.type == "grass" || 
        tile.type == "swamp"
      ) {
        const random = randomInt(0, 7);
        if (random === 0) {
          const perch = new Perch();
          console.log(tile.position.x, tile.position.y);
          console.log("perch", perch.position.x, perch.position.y);
          perch.position.x = tile.position.x + tile.width / 8;
          perch.position.y = tile.position.y + tile.height / 2 + tile.height / 4;
          tile.addChild(perch);
          tile.subTerrain = perch;
          console.log("perch location", tile);
        }
      }
    }
  }
  randomizeBurrows() {
    for (const tile of this.children) {
      if (
        tile.type == "forest" ||
        tile.type == "mountains" ||
        tile.type == "hills" ||
        tile.type == "grass"
      ) {
        const random = randomInt(0, 2);
        if (random === 0 || random === 1) {
          const burrow = new Burrow();
          console.log(tile.position.x, tile.position.y);
          console.log("burrow", burrow.position.x, burrow.position.y);
          burrow.position.x = tile.position.x + tile.width / 2 + tile.width / 4;
          burrow.position.y = tile.position.y + tile.height / 2 + tile.height / 4 ;
          tile.addChild(burrow);
          tile.subTerrain = burrow;
          console.log("burrow location", tile);
        }
      }
    }
  }   
  randomizeFlowers() {
    for (const tile of this.children) {
      if (
        tile.type == "forest" ||
        tile.type == "mountains" ||
        tile.type == "hills" ||
        tile.type == "grass"
      ) {
        const random = randomInt(0, 2);
        if (random === 0 || random === 1) {
          const random = randomInt(1, 3);
          const flower = new Flower();
          flower.position.x = tile.position.x + tile.width / 2 + tile.width / 4;
          flower.position.y = tile.position.y + tile.height / 4 + flower.height / 2;
          flower.density = random;
          tile.addChild(flower);
          tile.flora = flower;
        }
      }
    }
  }  
  randomizeShrubs() {
    for (const tile of this.children) {
      if (
        tile.type == "forest" ||
        tile.type == "mountains" ||
        tile.type == "hills" ||
        tile.type == "grass"
      ) {
        const random = randomInt(0, 2);
        if (random === 0 || random === 1) {
          const random = randomInt(1, 3);
          const shrub = new Shrub();
          shrub.position.x = tile.position.x + tile.width / 2 + tile.width / 4;
          shrub.position.y = tile.position.y + shrub.height;
          shrub.density = random;
          tile.addChild(shrub);
          tile.understory = shrub;

        }
      }
    }
  }
  randomizeTrees() {
    for (const tile of this.children) {
      if (
        tile.type == "forest" ||
        tile.type == "mountains" ||
        tile.type == "hills"
      ) {
        const random = randomInt(0, 3);
        if (random === 0) {
          const tree = new Tree();
          console.log(tile.position.x, tile.position.y);
          console.log("tree", tree.position.x, tree.position.y);
          tree.position.x = tile.position.x + tile.width / 2 - tree.radius;
          tree.position.y = tile.position.y + tile.height / 2 - tree.radius;
          tile.addChild(tree);
          tile.vegetation = tree;
          console.log("tree location");
        }
      }
    }
  }
  randomizeGranaries() {
    for (const tile of this.children) {
      if (
        tile.type == "forest" ||
        tile.type == "mountains" ||
        tile.type == "hills"
      ) {
        const random = randomInt(0, 5);
        if (random === 0) {
          const granary = new Granary();
          console.log(tile.position.x, tile.position.y);
          console.log("gran", granary.position.x, granary.position.y);
          granary.position.x = tile.position.x + tile.width / 8;
          granary.position.y = tile.position.y + tile.height / 8;
          tile.addChild(granary);
          tile.feature = granary;
          console.log("granary location");
        }
      }
    }
  }

  randomizeTerrain() {
    for (const tile of this.children) {
      const numTerrainTypes = this.terrain.length;
      const randomTerrain = this.terrain[randomInt(0, numTerrainTypes - 1)];

      const terrainType = Object.keys(randomTerrain)[0];
      const terrainColor = randomTerrain[terrainType].color;
      this.terrainCount[terrainType]++;

      tile.type = terrainType;
      tile.color = terrainColor;
    }
  }

  ready() {
    this.createGrid();
    this.randomizeTerrain();
    console.log(this.terrainCount);
    this.randomizeGranaries();
    this.randomizeTrees();
    this.randomizeShrubs();
    this.randomizeFlowers();
    this.randomizeBurrows();
    this.randomizePerch();
  }
  updateTerrain() {}

  step(delta, root) {
    this.updateTerrain(delta, root);
  }

  drawImage(ctx) {
    ctx.beginPath();
    ctx.rect(
      this.border,
      this.border,
      this.width - this.border * 2,
      this.height - this.border * 2
    );
    ctx.fillStyle = this.color;
    ctx.fill();

    ctx.closePath();
  }
}
