test("mock function testing", () => {
  const mockFunction = jest.fn((x) => x + 100);

  expect(mockFunction(1)).toBe(101);
  expect(mockFunction).toHaveBeenCalledWith(1);
  // expect(mockFunction).toHaveBeenCalledWith("1");
})