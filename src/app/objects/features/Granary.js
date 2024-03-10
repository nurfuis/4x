import { Vector2 } from "../../utils/Vector2";
import { GameObject } from "../GameObject";

export class Granary extends GameObject {
  constructor() {
    super({
      position: new Vector2(8, 8),
    });
    this.type = "granary";

    this.radius = 7;
    this.width = this.radius * 2;
    this.height = this.radius * 2;

    this.color = "rgba(204, 195, 202, 1)";
    this.stroke = "rgba(26, 17, 16, 1)";

  }

  ready() {}

  step(delta, root) {
  
  }

  drawImage(ctx) {
    ctx.beginPath(); // Start a new path
    ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2, true); // Draw the circle
    ctx.strokeWidth = 3; // Adjust to your desired thickness

    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.stroke;
    ctx.stroke(); // Draw the circle
    ctx.fill(); // Add a semi-transparent fill

    ctx.closePath(); // Close the path
    ctx.strokeWidth = 1; // Adjust to your desired thickness
  }
}
