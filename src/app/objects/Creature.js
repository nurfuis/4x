import { randomInt } from "../utils/randomInt.js";
import { AutomatedInput } from "../utils/AutomatedInput.js";
import { Vector2 } from "../utils/Vector2.js";
import { MoveUnit } from "../components/MoveUnit.js";
import { GameObject } from "./GameObject.js";
import { AdjustHealth } from "../components/AdjustHealth.js";
import { Shrink } from "../components/subscribers/Shrink.js";
import { GatherResource } from "../components/GatherResource.js";
import { Procreate } from "../components/subscribers/Procreate.js";

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
    this.ability = new GatherResource(this, this.radius * 2, 1);

    this.size = new Shrink(this);
    this.procreate = new Procreate(this);

    this.input = new AutomatedInput();
  }

  trySpawn(root) {
    const random = randomInt(0, 10);
    const { spawner } = root;

    if (random === 0 && spawner.count < spawner.max) {
      this.parent.addChild(spawner.spawn());
    }
  }

  tryMove() {
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
  reproduce() {
    const offspring = new Creature();
    offspring.position = this.position.duplicate();
    this.parent.addChild(offspring);

  }

  ready() {}

  step(delta, root) {
    if (this.currentHealth <= 0) {
      this.destroy();
    }
    this.trySpawn(root);
    this.tryMove();
    this.ability.collect(root.resources);
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
