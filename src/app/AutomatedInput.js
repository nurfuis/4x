import { LEFT, RIGHT, UP, DOWN } from "./Input";
export class AutomatedInput {
  constructor(directions = [LEFT, RIGHT, UP, DOWN], interval = 500) {
    this.directions = directions;
    this.interval = interval;
    this.currentDirection = null;

    this.scheduleNextInput();
  }

  get direction() {
    return this.currentDirection;
  }

  scheduleNextInput() {
    setTimeout(() => {
      this.chooseRandomDirection();
      this.scheduleNextInput();
    }, this.interval);
  }

  chooseRandomDirection() {
    const randomIndex = Math.floor(Math.random() * this.directions.length);
    this.currentDirection = this.directions[randomIndex];
  }
}
