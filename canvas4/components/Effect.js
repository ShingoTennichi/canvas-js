export default class Effect {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.numberOfParticles = 250;

    this.mouse = {
      x: 0,
      y: 0,
      pressed: false,
      radius: 150
    }

    window.addEventListener("mousemove", (event) => {
      if (this.mouse.pressed) {
        this.mouse.x = event.x;
        this.mouse.y = event.y;
      }
    })

    window.addEventListener("mousedown", (event) => {
      this.mouse.pressed = true;
      this.mouse.x = event.x;
      this.mouse.y = event.y;
    })

    window.addEventListener("mouseup", (event) => {
      this.mouse.pressed = false;
    })
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  resize(width, height, particleArray) {
    this.canvas.width = width;
    this.canvas.height = height;
    particleArray.forEach(particle => {
      particle.resetPosition(width, height);
    })
    this.setColor();
  }

  draw(particleArray) {
    this.connectParticles(particleArray);
    particleArray.forEach(particle => {
      particle.draw(this.context, () => this.setColor());
      particle.update(this.mouse);
    })
  }

  connectParticles(particleArray) {
    const maxDistance = 150;
    for (let current = 0; current < particleArray.length; current++) {
      const currentParticle = particleArray[current];
      for (let target = current; target < particleArray.length; target++) {
        const targetParticle = particleArray[target];
        const distance = this.calculateDistance(currentParticle, targetParticle);

        if (this.canBeConnected(distance, maxDistance)) {
          this.context.save();
          this.context.globalAlpha = this.calculateOpacity(distance, maxDistance);
          this.context.beginPath();
          this.context.moveTo(currentParticle.x, currentParticle.y);
          this.context.lineTo(targetParticle.x, targetParticle.y);
          this.context.stroke();
          this.context.restore();
        }
      }
    }
  }

  calculateDistance(currentParticle, targetParticle) {
    const dx = currentParticle.x - targetParticle.x;
    const dy = currentParticle.y - targetParticle.y;
    return Math.hypot(dx, dy);
  }

  canBeConnected(distance, maxDistance) {
    return distance < maxDistance;
  }

  calculateOpacity(distance, maxDistance) {
    return 1 - (distance / maxDistance);
  }

  setColor() {
    const gradient = this.context.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
    gradient.addColorStop(0, "white");
    gradient.addColorStop(0.25, "yellow");
    gradient.addColorStop(0.5, "green");
    gradient.addColorStop(0.75, "blue");
    gradient.addColorStop(1, "magenta");
    this.context.fillStyle = gradient;
    this.context.strokeStyle = "white";
    this.context.lineWidth = 2;
  }
}