import Effect from "../components/Effect.js";
import Particle from "../components/Particle.js";

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

const particleArray = [];
const numberOfParticles = 250;
initParticles();

const effect = new Effect(canvas, context);

window.addEventListener("load", () => {
  animate();
})

window.addEventListener("resize", (event) => {
  effect.resize(event.target.window.innerWidth, event.target.window.innerHeight, particleArray);
})

function initParticles() {
  for (let i = 0; i < numberOfParticles; i++) {
    particleArray.push(new Particle(canvas.width, canvas.height));
  }
}

function animate() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  effect.draw(particleArray);
  requestAnimationFrame(animate);
}