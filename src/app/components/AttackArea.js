export class AttackArea {
    constructor(entity, damage, radius, maxTargets) {
      this.entity = entity;
      this.damage = damage;
      this.radius = radius;
      this.maxTargets = maxTargets;
      this.damageDealt = 0;
      this.observers = [];
      this.scoreCounter = document.getElementById("score-counter");


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
  
    notify(damage) {
      this.observers.forEach((observer) => observer.update(damage));
    }

    attack() {
      const targets = this.findTargets();
      const damagePerTarget = this.calculateDamagePerTarget(targets.length);
  
      for (const target of targets) {
        if (target !== this.entity) {
          target.health.subtract(damagePerTarget);
          this.damageDealt += damagePerTarget;
          this.scoreCounter.textContent = this.damageDealt;
          this.notify(damagePerTarget)
        }
      }
    }
  
    findTargets() {
      const children = this.entity.parent.children;
      return children.filter(child => this.isInRange(child));
    }
  
    isInRange(target) {
      const distance = this.getDistance(target);
      return distance <= this.radius;
    }
  
    getDistance(target) {
      const dx = target.position.x - this.entity.position.x;
      const dy = target.position.y - this.entity.position.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  
    calculateDamagePerTarget(numTargets) {
      if (numTargets === 0) {
        return 0;
      }
      return Math.floor(this.damage / numTargets);
    }
  }
  