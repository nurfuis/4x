import { WORLD_BOUNDARIES } from "./constants.js";
import { randomInt } from "./utils/randomInt.js";

export class Spawner {
  constructor(type) {
    this.boundaries = WORLD_BOUNDARIES
    this.creatureClass = type;
    this.max = 16; // Set a maximum number of creatures
    this.count = 0; // Initialize a counter
  }

  spawn() {
    if (this.creatureCount >= this.maxCreatures) {
      console.warn("Maximum creature limit reached");
      return null; // Or handle the limit differently as needed
    }

    // Rest of the spawn logic
    const randomX = randomInt(this.boundaries.minX, this.boundaries.maxX);
    const randomY = randomInt(this.boundaries.minY, this.boundaries.maxY);

    const newCreature = new this.creatureClass();
    newCreature.position.x = randomX;
    newCreature.position.y = randomY;

    this.count++; // Increment the counter

    return newCreature;
  }
}
