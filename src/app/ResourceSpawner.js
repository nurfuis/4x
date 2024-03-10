import { WORLD_BOUNDARIES } from "./constants.js";
import { randomInt } from "./utils/randomInt.js";

export class ResourceSpawner {
  constructor(type) {
    this.boundaries = WORLD_BOUNDARIES
    this.resourceClass = type;
    this.max = 1000; // Set a maximum number of creatures
    this.count = 0; // Initialize a counter
  }

  spawn() {
    if (this.creatureCount >= this.maxCreatures) {
      console.warn("Maximum resource limit reached");
      return null; // Or handle the limit differently as needed
    }

    // Rest of the spawn logic
    const randomX = randomInt(this.boundaries.minX, this.boundaries.maxX);
    const randomY = randomInt(this.boundaries.minY, this.boundaries.maxY);

    const newResource = new this.resourceClass();
    newResource.position.x = randomX;
    newResource.position.y = randomY;

    this.count++; // Increment the counter

    return newResource;
  }
}
