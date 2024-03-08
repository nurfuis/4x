import { Vector2 } from "../utils/Vector2.js";
import { AdjustHealth } from "../components/AdjustHealth.js";
import { AttackArea } from "../components/AttackArea.js";
import { Grow } from "../components/subscribers/Grow.js";
import { MoveUnit } from "../components/MoveUnit.js";
import { GameObject } from "./gameObject.js";
import { WORLD_BOUNDARIES } from "../constants.js";

export class Player extends GameObject {
  constructor() {
    super({
      position: new Vector2(0, 0),
    });
    this.width = 64;
    this.height = 64;
    this.radius = 32;
    this.maxSpeed = 10;
    this.friction = 0.1;
    this.dampening = 0.02;

    this.acceleration = new Vector2(0, 0);
    this.velocity = new Vector2(0, 0);
    this.boundaries = WORLD_BOUNDARIES;

    // component
    this.health = new AdjustHealth(this);
    this.ability = new AttackArea(this, 1000, this.radius * 3, 5);

    // affects
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
          if (Math.abs(this.acceleration.x) < this.maxSpeed) {
            this.acceleration.x -= 0.005;
          }
          break;
        case "RIGHT":
          if (Math.abs(this.acceleration.x) < this.maxSpeed) {
            this.acceleration.x += 0.005;
          }
          break;
        case "UP":
          if (Math.abs(this.acceleration.y) < this.maxSpeed) {
            this.acceleration.y -= 0.005;
          }
          break;
        case "DOWN":
          if (Math.abs(this.acceleration.y) < this.maxSpeed) {
            this.acceleration.y += 0.005;
          }
          break;
      }
    } else {
      // Reset acceleration to 0 on key release (no input)
      const aX = this.acceleration.x;
      const aY = this.acceleration.y;

      if (aX < 0) {
        this.acceleration.x = aX + this.dampening;
      } else if (aX > 0) {
        this.acceleration.x = aX - this.dampening;
      }

      if ((aX < 0.1 && aX > 0) || (aX > -0.1 && aX < 0)) {
        this.acceleration.x = 0;
      }

      if (aY < 0) {
        this.acceleration.y = aY + this.dampening;
      } else if (aY > 0) {
        this.acceleration.y = aY - this.dampening;
      }

      if ((aY < 0.1 && aY > 0) || (aY > -0.1 && aY < 0)) {
        this.acceleration.y = 0;
      }
    }

    const vX = this.acceleration.x * delta;
    const vY = this.acceleration.y * delta;

    const newX = (this.position.x += vX);
    const newY = (this.position.y += vY);

    const worldWidth = this.boundaries.maxX - this.width;
    const worldHeight = this.boundaries.maxY - this.height;

    this.position.x = (this.position.x + worldWidth) % worldWidth;
    this.position.y = (this.position.y + worldHeight) % worldHeight;

    if (vX < 0 || vX > 0) {
      this.velocity.x = vX * 1 - this.friction;
    } else if ((vX < 1 && vX > 0) || (vX > -1 && vX < 0)) {
      this.velocity.x = 0;
    }

    if (vY < 0 || vY > 0) {
      this.velocity.y = vY * 1 - this.friction;
    } else if ((vY < 1 && vY > 0) || (vY > -1 && vY < 0)) {
      this.velocity.y = 0;
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
