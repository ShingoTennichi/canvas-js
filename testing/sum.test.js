const sum = require("./sum");

test("add 1 + 2 = 3", () => {
  expect(sum(1, 2)).toBe(3);
});

test("test object", () => {
  const obj = {
    "test": "jest"
  }

  // !failed
  // expect(obj).toBe({"test": "jest"});
  // *success
  expect(obj).toEqual({ "test": "jest" });
})

test("falsy testing", () => {
  // const isFalsy = 1 === "1";
  // const isFalsy = null;
  // const isFalsy = undefined;
  // const isFalsy = "";
  // const isFalsy = 0;
  const isFalsy = [][0];

  expect(isFalsy).toBeFalsy();
})

test("truthy testing", () => {
  // const isTruthy = 1;
  // const isTruthy = "a";
  // const isTruthy = true;
  const isTruthy = [];

  expect(isTruthy).toBeTruthy();
})

test("throw testing", () => {

  expect(() => {
    // errorFunc("this function does not exist so returns error");
    sum("1", "2");
  }).toThrow();
})

test("async testing", (done) => {
  function asyncCallback(todo1) {
    try {
      expect(todo1).toEqual({
        "userId": 1,
        "id": 1,
        "title": "delectus aut autem",
        "completed": false
      });
      done();
    } catch (e) {
      done(e);
    }
  }
  testAsync(asyncCallback);
})

test("fetch await testing", async () => {

  const data = await testAsync2();
  expect(data).toEqual({
    "userId": 1,
    "id": 1,
    "title": "delectus aut autem",
    "completed": false
  })
})

async function testAsync(asyncCallback) {
  const data = await fetch('https://jsonplaceholder.typicode.com/todos/1');
  // const data = await fetch('https://jsonplaceholder.typicode.com/todos/2');
  const todo1 = await data.json();
  asyncCallback(todo1);
}

async function testAsync2() {
  const data = await fetch('https://jsonplaceholder.typicode.com/todos/1');
  // const data = await fetch('https://jsonplaceholder.typicode.com/todos/2');
  const todo1 = await data.json();
  return todo1;
}

