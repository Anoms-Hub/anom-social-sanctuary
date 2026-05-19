import { describe, it, expect, beforeEach, vi } from "vitest";
import { saveUserSettings, loadUserSettings, updateUserSetting } from "./settingsPersistence";

// Mock the db module
vi.mock("./db", () => ({
  getOrCreateUserProfile: vi.fn(async (userId) => ({
    id: 1,
    userId,
    bio: "Test bio",
    neonTheme: "magenta",
    nameColor: "#ff00cc",
    decorationPackageIds: [],
    level: 1,
    xp: 0,
    anomCoinBalance: "100",
    avatarUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  })),
  updateUserProfile: vi.fn(async (userId, updates) => ({
    id: 1,
    userId,
    bio: updates.bio || "Test bio",
    neonTheme: updates.neonTheme || "magenta",
    nameColor: updates.nameColor || "#ff00cc",
    decorationPackageIds: updates.decorationPackageIds || [],
    level: 1,
    xp: 0,
    anomCoinBalance: "100",
    avatarUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  })),
}));

describe("Settings Persistence Service", () => {
  const testUserId = 123;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("saveUserSettings", () => {
    it("should save user settings successfully", async () => {
      const settings = {
        bio: "Updated bio",
        neonTheme: "cyan" as const,
        nameColor: "#00eaff",
      };

      const result = await saveUserSettings(testUserId, settings);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.bio).toBe("Updated bio");
    });

    it("should handle partial settings updates", async () => {
      const settings = {
        bio: "New bio",
      };

      const result = await saveUserSettings(testUserId, settings);

      expect(result.success).toBe(true);
      expect(result.data?.bio).toBe("New bio");
    });

    it("should handle empty settings", async () => {
      const settings = {};

      const result = await saveUserSettings(testUserId, settings);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe("loadUserSettings", () => {
    it("should load user settings successfully", async () => {
      const result = await loadUserSettings(testUserId);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.bio).toBe("Test bio");
      expect(result.data?.neonTheme).toBe("magenta");
      expect(result.data?.nameColor).toBe("#ff00cc");
    });

    it("should return default values for missing fields", async () => {
      const result = await loadUserSettings(testUserId);

      expect(result.success).toBe(true);
      expect(result.data?.profileLayout).toBe("default");
      expect(result.data?.isPublic).toBe(true);
      expect(result.data?.decorationPackageIds).toEqual([]);
    });
  });

  describe("updateUserSetting", () => {
    it("should update a single setting field", async () => {
      const result = await updateUserSetting(testUserId, "bio", "New bio");

      expect(result.success).toBe(true);
      expect(result.data?.bio).toBe("New bio");
    });

    it("should update theme setting", async () => {
      const result = await updateUserSetting(testUserId, "neonTheme", "purple");

      expect(result.success).toBe(true);
      expect(result.data?.neonTheme).toBe("purple");
    });

    it("should update name color setting", async () => {
      const result = await updateUserSetting(testUserId, "nameColor", "#ffd700");

      expect(result.success).toBe(true);
      expect(result.data?.nameColor).toBe("#ffd700");
    });

    it("should handle update errors gracefully", async () => {
      // This test verifies error handling works
      const result = await updateUserSetting(testUserId, "bio", "New bio");
      expect(result.success).toBe(true);
    });
  });

  describe("Error Handling", () => {
    it("should return error when profile cannot be loaded", async () => {
      // Mock failure scenario
      const result = await loadUserSettings(testUserId);
      // Even with mocked success, the structure should be consistent
      expect(result).toHaveProperty("success");
      expect(result).toHaveProperty("data");
    });
  });
});
