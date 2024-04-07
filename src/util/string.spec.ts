import { substringAfter, substringAfterLast, substringBefore, substringBeforeLast } from "src/util/string";

describe("string", () => {
  describe("substringBefore", () => {
    it("should return substring before delimiter", () => {
      expect(substringBefore("hello, world", ", ")).toBe("hello");
    });
    it("should return empty string if delimiter not found", () => {
      expect(substringBefore("hello, world", "$")).toBe("");
    });
  });

  describe("substringBeforeLast", () => {
    it("should return substring before last delimiter", () => {
      expect(substringBeforeLast("hello, world, world", ", ")).toBe("hello, world");
    });
    it("should return empty string if delimiter not found", () => {
      expect(substringBeforeLast("hello, world", "$")).toBe("");
    });
  });

  describe("substringAfter", () => {
    it("should return substring after delimiter", () => {
      expect(substringAfter("hello, world", ", ")).toBe("world");
    });
    it("should return empty string if delimiter not found", () => {
      expect(substringAfter("hello, world", "$")).toBe("");
    });
  });

  describe("substringAfterLast", () => {
    it("should return substring after last delimiter", () => {
      expect(substringAfterLast("hello, world, world", ", ")).toBe("world");
    });
    it("should return empty string if delimiter not found", () => {
      expect(substringAfterLast("hello, world", "$")).toBe("");
    });
  });
});
