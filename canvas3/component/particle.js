export default class Particle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this._x = 0;
    this._y = this._getRandomYAxis();
    this.velocity = Math.random();
    this.size = 1;
  }

  _getRandomYAxis() {
    return Math.random() * this.height;
  }

  getYAsRow() {
    return Math.floor(this._y);
  }

  getXAsCol() {
    return Math.floor(this._x);
  }

  draw(context) {
    const BACKGROUND_COLOR = "rgb(255, 255, 255)";
    context.beginPath();
    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(this._x, this._y, this.size, this.size);
  }

  update(context, moveCoefficient) {
    this._modifyAlpha(context, moveCoefficient);
    this._modifyPosition(moveCoefficient);
  }

  _modifyAlpha(context, moveCoefficient) {
    const ALPHA_MODIFIER = 0.5;
    context.globalAlpha = moveCoefficient * ALPHA_MODIFIER;
  }

  _modifyPosition(moveCoefficient) {
    const THRESHOLD = 2.55;
    let movement = (THRESHOLD - moveCoefficient) + this.velocity;
    this._x += movement;

    if (this._isOverCanvasWidth()) {
      this._resetPosition();
    }
  }

  _isOverCanvasWidth() {
    return this._x >= this.width;
  }

  _resetPosition() {
    this._x = 0;
    this._y = this._getRandomYAxis();
  }
}