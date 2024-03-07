import { WORLD_BOUNDARIES } from "../constants";

export class MoveUnit {
  constructor(entity) {
    this.entity = entity;
    this.boundaries = WORLD_BOUNDARIES;
    this.observers = [];
  }
  subscribe(observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  notify(position) {
    this.observers.forEach((observer) => observer.update(position));
  }

  up(distance) {
    const newY = this.entity.position.y - distance;
    this.clampY(newY);

    this.notify({ x: this.entity.position.x, y: newY });
  }

  down(distance) {
    const newY = this.entity.position.y + distance;
    this.clampY(newY);

    this.notify({ x: this.entity.position.x, y: newY });
  }

  left(distance) {
    const newX = this.entity.position.x - distance;
    this.clampX(newX);

    this.notify({ x: newX, y: this.entity.position.y });
  }

  right(distance) {
    const newX = this.entity.position.x + distance;
    this.clampX(newX);

    this.notify({ x: newX, y: this.entity.position.y });
  }

  clampX(newX) {
    this.entity.position.x = Math.max(
      this.boundaries.minX,
      Math.min(newX, this.boundaries.maxX - this.entity.width)
    );
  }

  clampY(newY) {
    this.entity.position.y = Math.max(
      this.boundaries.minY,
      Math.min(newY, this.boundaries.maxY - this.entity.height)
    );
  }
}
