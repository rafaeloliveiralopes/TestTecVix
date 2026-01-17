import { sanetizeName } from "../../src/utils/sanetizeName";

describe("sanetizeName", () => {
  it("should return sanitized name without special characters", () => {
    const result = sanetizeName("file name.txt");
    expect(result).toBe("file_name.txt");
  });

  it("should replace invalid filename characters", () => {
    const result = sanetizeName("file:name*with?invalid<chars>.txt");
    expect(result).toBe("file_name_with_invalid_chars_.txt");
  });

  it("should replace @ with _at_", () => {
    const result = sanetizeName("user@email.txt");
    expect(result).toBe("user_at_email.txt");
  });

  it("should replace % with _percent_", () => {
    const result = sanetizeName("50%discount.txt");
    expect(result).toBe("50_percent_discount.txt");
  });

  it("should remove diacritics", () => {
    const result = sanetizeName("açúcar.txt");
    expect(result).toBe("acucar.txt");
  });

  it("should truncate long names to limit", () => {
    const longName = "a".repeat(150);
    const result = sanetizeName(longName, 100);
    expect(result.length).toBeLessThanOrEqual(100);
  });

  it("should not truncate short names", () => {
    const shortName = "short.txt";
    const result = sanetizeName(shortName, 100);
    expect(result).toBe("short.txt");
  });

  it("should reduce multiple underscores to single", () => {
    const result = sanetizeName("file___name.txt");
    expect(result).toBe("file_name.txt");
  });

  it("should handle empty string", () => {
    const result = sanetizeName("");
    expect(result).toBe("");
  });

  it("should remove control characters", () => {
    const result = sanetizeName("file\x00name.txt");
    expect(result).toBe("filename.txt");
  });
});
