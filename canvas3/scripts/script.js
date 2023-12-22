import Cell from '../component/cell.js';
import Particle from '../component/particle.js';
import { imageUrl } from '../utils/ignore.js';

const image = new Image();
image.src = imageUrl;

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const canvasWidth = 500;
const canvasHeight = 500;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

let particleArray, imageCellArray;

window.addEventListener("load", () => {
  particleArray = initParticles(canvas.width, canvas.height);
  imageCellArray = segmentImage(context, canvas.width, canvas.height);

  animate();
});

function initParticles(width, height) {
  const numberOfParticles = 5000;
  const particleArray = [];
  for (let i = 0; i < numberOfParticles; i++) {
    particleArray.push(new Particle(width, height));
  }

  return particleArray;
}

function segmentImage(context, width, height) {
  const imageData = getImageData(context, width, height);
  const rgbaDataSize = 4;

  const imageCellArray = [];
  for (let y = 0; y < height; y++) {
    const cells = [];
    const row = y * rgbaDataSize * width;
    for (let x = 0; x < width; x++) {
      const col = x * rgbaDataSize;
      const cell = createCell(imageData, row, col);
      cells.push(cell);
    }
    imageCellArray.push(cells);
  }

  return imageCellArray;
}

function getImageData(context, width, height) {
  context.drawImage(image, 0, 0, width, height);
  const imageData = context.getImageData(0, 0, width, height).data;
  context.clearRect(0, 0, width, height);

  return imageData;
}

function createCell(imageData, row, col) {
  const red = imageData[row + col];
  const green = imageData[row + col + 1];
  const blue = imageData[row + col + 2];
  return new Cell(red, green, blue);
}

function animate() {
  setBackground();
  updateParticles();
  requestAnimationFrame(animate);
}

function setBackground() {
  const defaultAlpha = 0.05;
  context.globalAlpha = defaultAlpha;
  context.fillStyle = "rgb(0, 0, 0)";
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function updateParticles() {
  for (let i = 0; i < particleArray.length; i++) {
    const particle = particleArray[i];
    const cell = imageCellArray[particle.getYAsRow()][particle.getXAsCol()];
    const moveCoefficient = createMoveCoefficientFromBrightness(cell.brightness);
    particle.update(context, moveCoefficient);
    particle.draw(context);
  }
}

function createMoveCoefficientFromBrightness(brightness) {
  const modifier = 100;
  return brightness / modifier;
}