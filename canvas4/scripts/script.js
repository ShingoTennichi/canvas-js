const canvas = document.getElementById("canvas");
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

const context = canvas.getContext("2d");
const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, "white");
gradient.addColorStop(0.25, "yellow");
gradient.addColorStop(0.5, "green");
gradient.addColorStop(0.75, "blue");
gradient.addColorStop(1, "magenta");
context.fillStyle = gradient;
context.strokeStyle = "white";

window.addEventListener("load", () => {
  class Particle {
    constructor(effect) {
      this.effect = effect;
      this.width = 30;
      this.height = 30;
      this.radius = Math.random() * 20 + 10;
      this._x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
      this._y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
      this.velocityX = Math.random() * 1 - 0.5;
      this.velocityY = Math.random() * 1 - 0.5;
    }

    get x() {
      return this._x;
    }

    get y() {
      return this._y;
    }

    draw(context) {
      // context.fillStyle = `hsl(${this._x * 0.5}, 100%, 50%)`
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(this._x, this._y, this.radius, 0, Math.PI * 2);
      context.fill();
      context.stroke();
    }

    update() {
      this._x += this.velocityX;
      if (this.isOverBoundary()) {
        this.velocityX *= -1;
      }

      this._y += this.velocityY;
      if (this.isOverBoundary()) {
        this.velocityY *= -1;
      }
    }

    isOverBoundary() {
      return (
        this._x < this.radius
        || this._x > this.effect.width - this.radius
        || this._y < this.radius
        || this._y > this.effect.height - this.radius
      );
    }
  }

  class Effect {
    constructor(canvas) {
      this.canvas = canvas;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.particleArray = [];
      this.numberOfParticles = 250;
      this._initParticles();
    }

    _initParticles() {
      for (let i = 0; i < this.numberOfParticles; i++) {
        this.particleArray.push(new Particle(this));
      }
    }

    draw(context) {
      this.connectParticles(context);
      this.particleArray.forEach(particle => {
        particle.draw(context);
        particle.update();
      })
    }

    connectParticles(context) {
      const maxDistance = 150;
      for (let current = 0; current < this.particleArray.length; current++) {
        const currentParticle = this.particleArray[current];
        for (let target = current; target < this.particleArray.length; target++) {

          const targetParticle = this.particleArray[target];
          const dx = currentParticle.x - targetParticle.x;
          const dy = currentParticle.y - targetParticle.y;
          const distance = Math.hypot(dx, dy);

          if (distance < maxDistance) {
            context.save();
            const opacity = 1 - (distance / maxDistance);
            context.globalAlpha = opacity;
            context.beginPath();
            context.moveTo(currentParticle.x, currentParticle.y);
            context.lineTo(targetParticle.x, targetParticle.y);
            context.stroke();
            context.restore();
          }
        }
      }
    }
  }

  const effect = new Effect(canvas);

  function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    effect.draw(context);
    requestAnimationFrame(animate);
  }

  animate();
})