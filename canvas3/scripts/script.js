import Cell from '../component/cell.js';
import Particle from '../component/particle.js';
import { imageUrl } from '../utils/imageUrl.js';

const image = new Image();
image.src = imageUrl;

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

let particleArray, imageCellArray;

window.addEventListener("load", () => {
  let particleArray = initParticles(canvas.width, canvas.height);
  let imageCellArray = segmentImage(context, canvas.width, canvas.height);
  animate(canvas, context, particleArray, imageCellArray);
});

function initParticles(width, height) {
  const NUM_OF_PARTICLES = 5000;
  const particleArray = [];
  for (let i = 0; i < NUM_OF_PARTICLES; i++) {
    particleArray.push(new Particle(width, height));
  }

  return particleArray;
}

function segmentImage(context, width, height) {
  const imageData = getImageData(context, width, height);
  const RGBA_DATA_SIZE = 4;

  const imageCellArray = [];
  for (let y = 0; y < height; y++) {
    const cells = [];
    const row = y * RGBA_DATA_SIZE * width;
    for (let x = 0; x < width; x++) {
      const col = x * RGBA_DATA_SIZE;
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
  const RED_INDEX = row + col;
  const GREEN_INDEX = row + col + 1;
  const BLUE_INDEX = row + col + 2;
  const red = imageData[RED_INDEX];
  const green = imageData[GREEN_INDEX];
  const blue = imageData[BLUE_INDEX];
  return new Cell(red, green, blue);
}

function animate(canvas, context, particleArray, imageCellArray) {
  setBackground(canvas, context);
  updateParticles(context, particleArray, imageCellArray);
  requestAnimationFrame(() => animate(canvas, context, particleArray, imageCellArray));
}

function setBackground(canvas, context) {
  const DEFAULT_ALPHA = 5;
  const BACKGROUND_COLOR = "rgb(0, 0, 0)";
  context.globalAlpha = DEFAULT_ALPHA;
  context.fillStyle = BACKGROUND_COLOR;
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function updateParticles(context, particleArray, imageCellArray) {
  for (let i = 0; i < particleArray.length; i++) {
    const particle = particleArray[i];
    const cell = imageCellArray[particle.getYAsRow()][particle.getXAsCol()];
    const moveCoefficient = createMoveCoefficientFromBrightness(cell.brightness);
    particle.update(context, moveCoefficient);
    particle.draw(context);
  }
}

function createMoveCoefficientFromBrightness(brightness) {
  const MODIFIER = 100;
  return brightness / MODIFIER;
}