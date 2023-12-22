test("spy on a function", () => {
  const obj = {
    add(a, b) {
      return a + b;
    }
  }

  const spy = jest.spyOn(obj, "add");
  obj.add(1,2);
  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
})