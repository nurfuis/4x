import { Vector2 } from "../utils/Vector2.js";
import { AdjustHealth } from "../components/AdjustHealth.js";
import { AttackArea } from "../components/AttackArea.js";
import { Grow } from "../components/subscribers/Grow.js";
import { GameObject } from "./GameObject.js";
import { WORLD_BOUNDARIES } from "../constants.js";

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

    // battery
    this.storedEnergy = 120000;
    this.storedCapacity = 120000; // mHa
    this.floatStage = 0.95;
    this.absorptionStage = 0.8;
    this.criticalStage = 0.2;
    this.dischargeRate = 40; // Amps
    this.voltage = 6; // Volts
    this.dropoff = {
      float: 1,
      absorb: 0.9,
      bulk: 0.8,
      critical: 0.5,
      failed: 0,
    };

    // motor
    this.KV = 20;

    // transmission
    this.gearBox = {
      1: { drive: 1, motor: 2 }, // low
      2: { drive: 1, motor: 1 }, // direct
      3: { drive: 2, motor: 1 }, // overdrive
    };
    this.gear = 1;

    // body
    this.width = this.radius * 2;
    this.height = this.radius * 2;
    this.color = "rgba(055, 055, 100, 0.2)";

    this._mass = this.radius * this.scale ** 2;
    this._maxSpeed = this.dischargeRate;
    this._friction = this.scale ** 3 / this._mass;
    this._dampening = this.scale ** 2 / this._mass;

    this._acceleration = new Vector2(0, 0);
    this._velocity = new Vector2(0, 0);

    //* Components *//
    this.health = new AdjustHealth(this);
    this.ability = new AttackArea(this, 1000, this.radius * 3, 5);

    //* Secondaries *//
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

  fall(root) {
    const targetId = "kill";
    const nether = root.layers.find((layer) => layer.id === targetId);
    this.parent.removeChild(this);
    nether.addChild(this);
  }

  detect(root, viewDistanceMultiplier = 0.5) {
    const targetId = "world";
    const world = root.layers.find((layer) => layer.id === targetId);
    const viewDistanceX = this.width * viewDistanceMultiplier;
    const viewDistanceY = this.height * viewDistanceMultiplier;

    let mostOverlappingTile = null;
    let highestOverlap = 0;

    for (const tile of world.children) {
      const playerRight = this.center.x + viewDistanceX;
      const playerLeft = this.center.x - viewDistanceX;
      const playerBottom = this.center.y + viewDistanceY;
      const playerTop = this.center.y - viewDistanceY;
      const tileRight = tile.position.x + tile.width;
      const tileLeft = tile.position.x;
      const tileBottom = tile.position.y + tile.height;
      const tileTop = tile.position.y;

      if (
        playerRight >= tileLeft && // Player right edge pasts tile left edge
        playerLeft <= tileRight && // Player left edge before tile right edge
        playerBottom >= tileTop && // Player bottom edge pasts tile top edge
        playerTop <= tileBottom // Player top edge before tile bottom edge
      ) {
        // Overlap detected within view distance
        const overlapX =
          Math.min(playerRight, tileRight) - Math.max(playerLeft, tileLeft);
        const overlapY =
          Math.min(playerBottom, tileBottom) - Math.max(playerTop, tileTop);
        const overlapArea = overlapX * overlapY;

        if (overlapArea > highestOverlap) {
          highestOverlap = overlapArea;
          mostOverlappingTile = tile;
        }

        // if (tile.fog) {
        //   tile.fog = false; // Reveal fogged tiles within view distance
        // }

        // You can also perform other actions based on the detected tile here
      }
    }
    if (mostOverlappingTile) {
      mostOverlappingTile.selected = true;
    }
  }

  updateBattery() {
    if (this._acceleration.x != 0 || this._acceleration.y != 0) {
      const cost = Math.abs(this._acceleration.x + this._acceleration.y);
      this.storedEnergy -= cost;
    }
  }

  move(delta, direction) {
    if (direction) {
      const torque = (this.KV * this.voltage * this.gearBox[this.gear].motor) / (this._mass * this.gearBox[this.gear].drive);

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
        this._acceleration.x = aX + this._dampening;
      } else if (aX > 0) {
        this._acceleration.x = aX - this._dampening;
      }

      if ((aX < 0.2 && aX > 0) || (aX > -0.2 && aX < 0)) {
        this._acceleration.x = 0;
      }

      if (aY < 0) {
        this._acceleration.y = aY + this._dampening;
      } else if (aY > 0) {
        this._acceleration.y = aY - this._dampening;
      }

      if ((aY < 0.2 && aY > 0) || (aY > -0.2 && aY < 0)) {
        this._acceleration.y = 0;
      }
    }

    const worldWidth = this.boundaries.maxX - this.width;
    const worldHeight = this.boundaries.maxY - this.height;

    const sag = this.dropoff[this.storedCharge];

    const forceX = this._acceleration.x * this._mass * sag;
    const forceY = this._acceleration.y * this._mass * sag;

    const vX = forceX / this._mass;
    const vY = forceY / this._mass;

    if (vX < 0 || vX > 0) {
      this._velocity.x = vX * 1 - this._friction;
    } else if ((vX < 1 && vX > 0) || (vX > -1 && vX < 0)) {
      this._velocity.x = 0;
    }

    if (vY < 0 || vY > 0) {
      this._velocity.y = vY * 1 - this._friction;
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
  }

  checkState() {
    if (this.storedEnergy >= this.storedCapacity * this.floatStage) {
      this.storedCharge = "float";
    } else if (
      this.storedEnergy < this.storedCapacity &&
      this.storedEnergy >= this.storedCapacity * this.absorptionStage
    ) {
      this.storedCharge = "absorb";
    } else if (
      this.storedEnergy < this.storedCapacity * this.absorptionStage &&
      this.storedEnergy > this.storedEnergy * this.criticalStage
    ) {
      this.storedCharge = "bulk";
    } else if (
      this.storedEnergy < this.storedCapacity * this.criticalStage &&
      this.storedEnergy >= 0
    ) {
      this.storedCharge = "depleted";
    } else if (this.storedEnergy < 0) {
      this.storedCharge = "failed";
    }
  }
  recharge() {
    this.storedEnergy += this.storedCapacity;
  }

  step(delta, root) {
    const input = root.input || root.automatedInput;
    this.checkState();
    this.detect(root);
    this.move(delta, input.direction);
    this.ability.attack();
    this.updateBattery();
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
