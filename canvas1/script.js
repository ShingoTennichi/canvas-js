window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;



  class Particle {
    constructor(effect, x, y, color) {
      this.effect = effect;
      this.x = Math.random() * this.effect.width;
      this.y = Math.random() * this.effect.height;
      this.originX = x;
      this.originY = y;
      this.color = color;
      this.size = this.effect.gap;
      this.vx = 0;
      this.vy = 0;
      this.ease = 0.1;
      this.friction = 0.9;
      this.dx = 0;
      this.dy = 0;
      this.distance = 0;
      this.force = 0;
      this.angle = 0;
    }

    draw(context) {
      context.fillStyle = this.color;
      context.fillRect(this.x, this.y, this.size, this.size);
    }

    update() {
      // d: distance
      this.dx = this.effect.mouse.x - this.x;
      this.dy = this.effect.mouse.y - this.y;
      // C^2 = A^2 + B^2
      this.distance = this.dx * this.dx + this.dy * this.dy;
      this.force = -this.effect.mouse.radius / this.distance;

      // detect if the mouse radius contact to the object
      if (this.distance < this.effect.mouse.radius) {
        // atan2 returns degree of θ in radians
        this.angle = Math.atan2(this.dy, this.dx);
        // cos & sin returns between -1 to 1
        this.vx += this.force * Math.cos(this.angle);
        this.vy += this.force * Math.sin(this.angle);
      }

      // calculate original position
      this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
      this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
    }

    warp() {
      this.x = Math.random() * this.effect.width;
      this.y = Math.random() * this.effect.height;
      this.ease = 0.1
    }
  }

  class Effect {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.particleArray = [];
      this.image = document.getElementById("angler");
      this.centerX = this.width * 0.5;
      this.centerY = this.height * 0.5;
      this.x = this.centerX - this.image.width * 0.5;
      this.y = this.centerY - this.image.height * 0.5;
      this.gap = 2;
      this.mouse = {
        radius: 3000,
        x: undefined,
        y: undefined
      }
      window.addEventListener("mousemove", (event) => {
        this.mouse.x = event.x;
        this.mouse.y = event.y;
      })

    }

    init(context) {
      context.drawImage(this.image, this.x, this.y);
      const pixels = context.getImageData(0, 0, this.width, this.height).data;
      for (let row = 0; row < this.height; row += this.gap) {
        for (let col = 0; col < this.width; col += this.gap) {
          const index = (row * this.width + col) * 4;
          const red = pixels[index];
          const green = pixels[index + 1];
          const blue = pixels[index + 2];
          const alpha = pixels[index + 3];
          const color = `rgb(${red}, ${green}, ${blue})`;

          if (alpha > 0) {
            this.particleArray.push(new Particle(this, col, row, color));
          }

        }
      }
    }

    draw(context) {
      this.particleArray.forEach(particle => particle.draw(context));

    }

    update() {
      this.particleArray.forEach(particle => particle.update());
    }

    warp() {
      this.particleArray.forEach(particle => particle.warp());
    }
  }

  const effect = new Effect(canvas.width, canvas.height);
  effect.init(context);

  function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    effect.draw(context);
    effect.update();
    window.requestAnimationFrame(animate);
  }

  animate();

  const warpButton = document.getElementById("warpButton");
  warpButton.addEventListener("click", () => {
    effect.warp();
  })
})


// fillRect(x-axis, y-axis, width, height)
// drawImage(image element, x-axis, y-axis, width(optional), height(optional))
// getImageData(x-axis, y-axis, width, height)
//Math.atan2(y-axis, x-axis);

// context.fillRect(120, 150, 100, 200);
// context.drawImage(anglerImg, 100, 100, 400, 300);