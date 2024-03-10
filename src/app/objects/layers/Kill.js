import { WORLD_HEIGHT, WORLD_WIDTH } from "../../constants.js";
import { Vector2 } from "../../utils/Vector2.js";
import { GameObject } from "../GameObject.js";

export class Kill extends GameObject {
  constructor() {
    super({
      position: new Vector2(0, 0),
    });
    this.id = "kill";
  }
  step(delta, root) {
    if (this.children.length > 0) {
      for (const child of this.children) {
        this.removeChild(child);
        console.log('You fell out of the world!')
      }
    }
  }
  drawImage(ctx) {
    const width = WORLD_WIDTH;
    const height = WORLD_HEIGHT;

    ctx.beginPath();
    ctx.rect(
      0,
      0,
      width,
      height
    ); // Adjust width and height for desired size

    // Set fill properties for the interior
    ctx.fillStyle = "rgba(255, 155, 55, 0.1)";
    ctx.lineWidth = 1; // Reset line width

    // Fill the rectangle (interior)
    ctx.fill();

    ctx.closePath();
  }
}
