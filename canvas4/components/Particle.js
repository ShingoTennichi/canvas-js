export default class Particle {
  constructor(width, height) {
    this.radius = Math.floor(Math.random() * 20 + 10);
    this.xBoundary = width;
    this.yBoundary = height;
    this._x = this.radius + Math.random() * (width - this.radius * 2);
    this._y = this.radius + Math.random() * (height - this.radius * 2);
    this.velocityX = Math.random() * 1 - 0.5;
    this.velocityY = Math.random() * 1 - 0.5;
    this.pushX = 0;
    this.pushY = 0;
    this.friction = 0.95;
    this.boundaries = {
      "LEFT": this.radius,
      "RIGHT": width - this.radius,
      "TOP": this.radius,
      "BOTTOM": height - this.radius,
    };
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  draw(context, setColor) {
    setColor();
    context.beginPath();
    context.arc(this._x, this._y, this.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  }

  update(mouse) {
    if (mouse.pressed) {
      this.applyForce(mouse);
    }
    this.applyFriction();
    this.updatePosition();
    this.preventBeyondBoundary();
  }

  applyForce(mouse) {
    const { hypotenuse: distance, radian: angle } = this.calculateDistanceAndAngle(mouse);
    if (this.isInMouseRadius(mouse.radius, distance)) {
      const force = this.calculateForce(mouse, distance);
      this.pushX += Math.cos(angle) * force;
      this.pushY += Math.sin(angle) * force;
    }
  };

  calculateDistanceAndAngle(mouse) {
    const dx = this._x - mouse.x;
    const dy = this._y - mouse.y;
    return {
      adjacent: dx,
      opposite: dy,
      hypotenuse: Math.hypot(dx, dy),
      radian: Math.atan2(dy, dx)
    };
  }

  isInMouseRadius(radius, distance) {
    return distance < radius;
  }

  calculateForce(mouse, distance) {
    return mouse.radius / distance;
  }

  applyFriction() {
    this.pushX *= this.friction;
    this.pushY *= this.friction;
  };

  updatePosition() {
    this._x += this.pushX + this.velocityX;
    this._y += this.pushY + this.velocityY;
  }

  preventBeyondBoundary() {
    const horizontal = this.checkBoundary(this._x, "LEFT", "RIGHT");
    const vertical = this.checkBoundary(this._y, "TOP", "BOTTOM");

    if (horizontal !== null) {
      this._x = this.boundaries[horizontal];
      this.velocityX *= -1;
    }

    if (vertical !== null) {
      this._y = this.boundaries[vertical];
      this.velocityY *= -1;
    }
  };

  checkBoundary(axis, minKey, maxKey) {
    if (axis < this.boundaries[minKey]) return minKey;
    if (axis > this.boundaries[maxKey]) return maxKey;
    return null;
  }

  resetPosition(width, height) {
    this._x = this.radius + Math.random() * (width - this.radius * 2);
    this._y = this.radius + Math.random() * (height - this.radius * 2);
    this.boundaries["RIGHT"] = width - this.radius;
    this.boundaries["BOTTOM"] = height - this.radius;
  }
}