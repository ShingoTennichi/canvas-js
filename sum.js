function sum(num1, num2) {
  if(typeof num1 !== "number" && typeof num2 !== "number") {
    throw new Error("type not match");
  }
  return num1 + num2;
}



module.exports = sum;