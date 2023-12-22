export default class Cell {
  constructor(red, green, blue) {
    this._red = red;
    this._green = green;
    this._blue = blue;
    this._brightness = this._calcBrightness();
  }

  get brightness() {
    return this._brightness;
  }

  _calcBrightness() {
    // calculate the ratio of each color
    // summing up those ratios then square root returns between 0 and 255
    const redCoefficient = 0.299;
    const greenCoefficient = 0.587;
    const blueCoefficient = 0.114;
    return Math.sqrt(
      (this._red * this._red) * redCoefficient +
      (this._green * this._green) * greenCoefficient +
      (this._blue * this._blue) * blueCoefficient
    );
  }
}