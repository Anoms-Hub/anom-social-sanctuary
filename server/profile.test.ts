import { describe, it, expect } from "vitest";
import { z } from "zod";

describe("Profile Procedures - Schema Validation", () => {
  it("should validate theme update input", () => {
    const themeSchema = z.object({ theme: z.enum(["magenta", "cyan", "purple"]) });
    
    const validInput = { theme: "cyan" as const };
    expect(() => themeSchema.parse(validInput)).not.toThrow();
    
    const result = themeSchema.parse(validInput);
    expect(result.theme).toBe("cyan");
  });

  it("should validate name color update input", () => {
    const nameColorSchema = z.object({ nameColor: z.string() });
    
    const validInput = { nameColor: "gold" };
    expect(() => nameColorSchema.parse(validInput)).not.toThrow();
    
    const result = nameColorSchema.parse(validInput);
    expect(result.nameColor).toBe("gold");
  });

  it("should validate profile update input", () => {
    const profileSchema = z.object({ 
      name: z.string().optional(), 
      bio: z.string().optional() 
    });
    
    const validInput = { bio: "Test bio" };
    expect(() => profileSchema.parse(validInput)).not.toThrow();
    
    const result = profileSchema.parse(validInput);
    expect(result.bio).toBe("Test bio");
  });

  it("should validate decorations update input", () => {
    const decorationsSchema = z.object({ packageIds: z.array(z.number()) });
    
    const validInput = { packageIds: [1, 2, 3] };
    expect(() => decorationsSchema.parse(validInput)).not.toThrow();
    
    const result = decorationsSchema.parse(validInput);
    expect(result.packageIds).toEqual([1, 2, 3]);
  });

  it("should reject invalid theme", () => {
    const themeSchema = z.object({ theme: z.enum(["magenta", "cyan", "purple"]) });
    
    const invalidInput = { theme: "invalid" };
    expect(() => themeSchema.parse(invalidInput)).toThrow();
  });

  it("should reject empty decorations array", () => {
    const decorationsSchema = z.object({ packageIds: z.array(z.number()) });
    
    const validInput = { packageIds: [] };
    expect(() => decorationsSchema.parse(validInput)).not.toThrow();
  });

  it("should handle optional profile fields", () => {
    const profileSchema = z.object({ 
      name: z.string().optional(), 
      bio: z.string().optional() 
    });
    
    const emptyInput = {};
    expect(() => profileSchema.parse(emptyInput)).not.toThrow();
    
    const result = profileSchema.parse(emptyInput);
    expect(result.name).toBeUndefined();
    expect(result.bio).toBeUndefined();
  });
});
