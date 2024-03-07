import { randomInt } from "./utils/randomInt.js";
import { AutomatedInput } from "./Automatedinput.js";
import { Vector2 } from "./Vector2.js";
import { MoveUnit } from "./components/MoveUnit.js";
import { GameObject } from "./gameObject.js";
import { AdjustHealth } from "./components/AdjustHealth.js";
import { Shrink } from "./components/subscribers/Shrink.js";

export class Creature extends GameObject {
  constructor() {
    super({
      position: new Vector2(0, 0),
    });
    this.width = 32;
    this.height = 32;
    this.radius = 16;
    this.speed = 5;

    this.move = new MoveUnit(this);
    this.health = new AdjustHealth(this);


    this.size = new Shrink(this);

    this.input = new AutomatedInput();
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
  ready() {}

  step(delta, root) {
    const random = randomInt(0, 10);
    const { spawner } = root;

    if (random === 0 && spawner.count < spawner.max) {
      this.parent.addChild(spawner.spawn());
    }

    if (this.input.direction) {
      switch (this.input.direction) {
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
  }

  drawImage(ctx) {
    ctx.beginPath(); // Start a new path
    ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2, true); // Draw the circle
    ctx.strokeWidth = 5; // Adjust to your desired thickness

    ctx.strokeStyle = "red";
    ctx.fillStyle = "rgba(155, 155, 155, 1)";
    ctx.strokeStyle = "red";
    ctx.stroke(); // Draw the circle
    ctx.fill(); // Add a semi-transparent fill

    ctx.closePath(); // Close the path
    ctx.strokeWidth = 1; // Adjust to your desired thickness
  }
}
