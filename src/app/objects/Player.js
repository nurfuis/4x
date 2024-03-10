import { Vector2 } from "../utils/Vector2.js";
import { AdjustHealth } from "../components/AdjustHealth.js";
import { AttackArea } from "../components/AttackArea.js";
import { GameObject } from "./GameObject.js";
import { WORLD_BOUNDARIES } from "../constants.js";
import { Battery } from "../components/Battery.js";
import { Motor } from "../components/Motor.js";
import { Transmission } from "../components/Transmission.js";
import { Eyesight } from "../components/Eyesight.js";

export class Player extends GameObject {
  constructor() {
    super({
      position: new Vector2(0, 0),
    });
    this.boundaries = WORLD_BOUNDARIES;
    this.wrapX = true;
    this.wrapY = true;

    this.radius = 32;
    this.scale = 10;
    
    //* Components *//
    this.health = new AdjustHealth(this);
    this.ability = new AttackArea(this, 20, this.radius / 2, 5);
    
    // battery
    this.powerSupply = new Battery();

    // motor
    this.motor = new Motor();

    // transmission
    this.transmission = new Transmission();
    
    // sight
    this.vision = new Eyesight();

    // body
    this.width = this.radius * 2;
    this.height = this.radius * 2;
    this.color = "rgba(055, 055, 100, 0.2)";

    this._maxSpeed = this.powerSupply.dischargeRate;
    this._mass = this.radius * this.scale ** 2;
    
    this._gravity = this.scale ** 3 / this._mass;
    this._drag = this.scale ** 2 / this._mass;

    this._acceleration = new Vector2(0, 0);
    this._velocity = new Vector2(0, 0);


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

  fall(root) {
    const targetId = "kill";
    const nether = root.layers.find((layer) => layer.id === targetId);
    this.parent.removeChild(this);
    nether.addChild(this);
  }

  move(direction) {
    if (direction) {
      const torque =
        (this.motor.KV * this.powerSupply.voltage * this.transmission.gearBox[this.transmission.gear].motor) /
        (this._mass * this.transmission.gearBox[this.transmission.gear].drive);

      switch (direction) {
        case "LEFT":
          if (Math.abs(this._acceleration.x) < this._maxSpeed) {
            this._acceleration.x -= torque;
          }
          break;
        case "RIGHT":
          if (Math.abs(this._acceleration.x) < this._maxSpeed) {
            this._acceleration.x += torque;
          }
          break;
        case "UP":
          if (Math.abs(this._acceleration.y) < this._maxSpeed) {
            this._acceleration.y -= torque;
          }
          break;
        case "DOWN":
          if (Math.abs(this._acceleration.y) < this._maxSpeed) {
            this._acceleration.y += torque;
          }
          break;
      }
    } else {
      // Reset acceleration to 0 on key release (no input)
      const aX = this._acceleration.x;
      const aY = this._acceleration.y;

      if (aX < 0) {
        this._acceleration.x = aX + this._drag;
      } else if (aX > 0) {
        this._acceleration.x = aX - this._drag;
      }

      if ((aX < 0.2 && aX > 0) || (aX > -0.2 && aX < 0)) {
        this._acceleration.x = 0;
      }

      if (aY < 0) {
        this._acceleration.y = aY + this._drag;
      } else if (aY > 0) {
        this._acceleration.y = aY - this._drag;
      }

      if ((aY < 0.2 && aY > 0) || (aY > -0.2 && aY < 0)) {
        this._acceleration.y = 0;
      }
    }

    const worldWidth = this.boundaries.maxX - this.width;
    const worldHeight = this.boundaries.maxY - this.height;

    const sag = this.powerSupply.dropoff[this.powerSupply.storedCharge];

    const forceX = this._acceleration.x * this._mass * sag;
    const forceY = this._acceleration.y * this._mass * sag;

    const vX = forceX / this._mass;
    const vY = forceY / this._mass;

    if (vX < 0 || vX > 0) {
      this._velocity.x = vX * 1 - this._gravity;
    } else if ((vX < 1 && vX > 0) || (vX > -1 && vX < 0)) {
      this._velocity.x = 0;
    }

    if (vY < 0 || vY > 0) {
      this._velocity.y = vY * 1 - this._gravity;
    } else if ((vY < 1 && vY > 0) || (vY > -1 && vY < 0)) {
      this._velocity.y = 0;
    }

    let newX = this.position.x + vX;
    let newY = this.position.y + vY;

    if (this.wrapX) {
      newX = (newX + worldWidth) % worldWidth;
    } else {
      newX = Math.max(0, Math.min(worldWidth, newX));
    }

    if (this.wrapY) {
      newY = (newY + worldHeight) % worldHeight;
    } else {
      newY = Math.max(0, Math.min(worldHeight, newY));
    }
    this.position.x = newX;
    this.position.y = newY;

    return this.position.duplicate();
  }
  
  step(delta, root) {
    const input = root.input || root.automatedInput;

    this.powerSupply.checkState();
    this.powerSupply.drawPower(this._acceleration);


    this.vision.scan(root, this.center, this.radius);
    this.move(input.direction);
    this.ability.attack(root);

  }

  drawImage(ctx) {
    ctx.beginPath(); // Start a new path
    ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2, true); // Draw the circle
    ctx.strokeWidth = 3; // Adjust to your desired thickness

    ctx.fillStyle = this.color;
    ctx.strokeStyle = "red";
    ctx.stroke(); // Draw the circle
    ctx.fill(); // Add a semi-transparent fill
    ctx.closePath(); // Close the path
    ctx.strokeWidth = 1; // Adjust to your desired thickness
  }
}
