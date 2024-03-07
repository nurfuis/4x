import { Vector2 } from "./Vector2.js";
import { AdjustHealth } from "./components/AdjustHealth.js";
import { AttackArea } from "./components/AttackArea.js";
import { Grow } from "./components/subscribers/Grow.js";
import { MoveUnit } from "./components/MoveUnit.js";
import { GameObject } from "./gameObject.js";

export class Player extends GameObject {
  constructor() {
    super({
      position: new Vector2(0, 0),
    });
    this.width = 64;
    this.height = 64;
    this.radius = 32;
    this.speed = 10;

    this.move = new MoveUnit(this);
    this.health = new AdjustHealth(this);
    this.ability = new AttackArea(this, 1000, this.radius * 3, 5);
    
    this.grow = new Grow(this);
  }

  get center() {
    if (this.position && this.width && this.height) {
      const x = Math.floor(this.position.x + this.width / 2);
      const y = Math.floor(this.position.y + this.height / 2);
      return new Vector2(x, y);
    } else {
      return this.position.duplicate();
    }
  }

  step(delta, root) {
    const input = root.input || root.automatedInput;

    if (input.direction) {
      switch (input.direction) {
        case "LEFT":
          this.move.left(this.speed);
          break;
        case "RIGHT":
          this.move.right(this.speed);
          break;
        case "UP":
          this.move.up(this.speed);
          break;
        case "DOWN":
          this.move.down(this.speed);
          break;
      }
    }

    this.ability.attack();
  }

  drawImage(ctx) {
    ctx.beginPath(); // Start a new path
    ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2, true); // Draw the circle
    ctx.strokeWidth = 5; // Adjust to your desired thickness

    ctx.strokeStyle = "red";
    ctx.fillStyle = "rgba(055, 055, 100, 0.8)";
    ctx.strokeStyle = "red";
    ctx.stroke(); // Draw the circle
    ctx.fill(); // Add a semi-transparent fill

    ctx.closePath(); // Close the path
    ctx.strokeWidth = 3; // Adjust to your desired thickness
  }
}
