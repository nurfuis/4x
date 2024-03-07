export class Shrink {
  constructor(entity) {
    this.entity = entity;
    this.healthSubject = entity.health;
    this.healthSubject.subscribe(this);
  }

  update(health) {
    this.entity.radius = this.entity.currentHealth / 10000;
    if (this.entity.currentHealth <= 0) {
      this.entity.destroy();
    }
  }
}
