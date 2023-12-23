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
context.lineWidth = 2;

window.addEventListener("load", () => {
  class Particle {
    constructor(effect) {
      this.effect = effect;
      this.width = 30;
      this.height = 30;
      this.radius = Math.floor(Math.random() * 20 + 10);
      this._x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
      this._y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
      this.velocityX = Math.random() * 1 - 0.5;
      this.velocityY = Math.random() * 1 - 0.5;
      this.pushX = 0;
      this.pushY = 0;
      this.friction = 0.95;
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
      if (this.effect.mouse.pressed) {
        const dx = this._x - this.effect.mouse.x;
        const dy = this._y - this.effect.mouse.y;
        const distance = Math.hypot(dx, dy);
        const force = this.effect.mouse.radius / distance;
        if (distance < this.effect.mouse.radius) {
          const angle = Math.atan2(dy, dx);
          this.pushX += Math.cos(angle) * force;
          this.pushY += Math.sin(angle) * force;
        }
      }

      this.pushX *= this.friction;
      this.pushY *= this.friction;
      this._x += this.pushX + this.velocityX;
      this._y += this.pushY + this.velocityY;

      if (this.isLeftBoundary()) {
        this._x = this.radius;
        this.velocityX *= -1;
      } else if (this.isRightBoundary()) {
        this._x = this.effect.width - this.radius
        this.velocityX *= -1;
      }

      if (this.isTopBoundary()) {
        this._y = this.radius;
        this.velocityY *= -1;
      } else if (this.isBottomBoundary()) {
        this._y = this.effect.height - this.radius
        this.velocityY *= -1;
      }
    }

    isLeftBoundary() {
      return this._x < this.radius;
    }

    isRightBoundary() {
      return this._x > this.effect.width - this.radius;
    }

    isTopBoundary() {
      return this._y < this.radius;
    }

    isBottomBoundary() {
      return this._y > this.effect.height - this.radius;
    }

    resetPosition() {
      this._x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
      this._y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
    }
  }

  class Effect {
    constructor(canvas, context) {
      this.canvas = canvas;
      this.context = context;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.particleArray = [];
      this.numberOfParticles = 250;
      this._initParticles();

      this.mouse = {
        x: 0,
        y: 0,
        pressed: false,
        radius: 150
      }

      window.addEventListener("resize", (event) => {
        this.resize(event.target.window.innerWidth, event.target.window.innerHeight);
      })

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

    resize(width, height) {
      this.canvas.width = width;
      this.canvas.height = height;
      this.width = width;
      this.height = height;

      const gradient = this.context.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "white");
      gradient.addColorStop(0.25, "yellow");
      gradient.addColorStop(0.5, "green");
      gradient.addColorStop(0.75, "blue");
      gradient.addColorStop(1, "magenta");
      this.context.fillStyle = gradient;
      this.context.strokeStyle = "white";

      this.particleArray.forEach(particle => {
        particle.resetPosition();
      })
    }
  }

  const effect = new Effect(canvas, context);

  function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    effect.draw(context);
    requestAnimationFrame(animate);
  }

  animate();
})