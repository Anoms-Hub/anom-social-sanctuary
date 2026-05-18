import { describe, it, expect } from "vitest";
import {
  getTierDefinition,
  getAllTiers,
  getTierBenefits,
  getTierFeatures,
  hasTierFeature,
  getCoinMultiplier,
  getMaxLounges,
  getTierBadgeColor,
  calculateDaysRemaining,
  isTierActive,
  getTierUpgradePrice,
  getTierComparison,
  formatTierName,
  isValidTier,
} from "./membershipTiers";

describe("Membership Tiers", () => {
  describe("getTierDefinition", () => {
    it("should return basic tier definition", () => {
      const tier = getTierDefinition("basic");
      expect(tier.id).toBe("basic");
      expect(tier.monthlyPrice).toBe(0);
      expect(tier.coinMultiplier).toBe(1.0);
    });

    it("should return vip tier definition", () => {
      const tier = getTierDefinition("vip");
      expect(tier.id).toBe("vip");
      expect(tier.monthlyPrice).toBe(9.99);
      expect(tier.coinMultiplier).toBe(2.0);
    });

    it("should return super_vip tier definition", () => {
      const tier = getTierDefinition("super_vip");
      expect(tier.id).toBe("super_vip");
      expect(tier.monthlyPrice).toBe(24.99);
      expect(tier.coinMultiplier).toBe(3.0);
    });
  });

  describe("getAllTiers", () => {
    it("should return all three tiers", () => {
      const tiers = getAllTiers();
      expect(tiers).toHaveLength(3);
      expect(tiers.map((t) => t.id)).toEqual(["basic", "vip", "super_vip"]);
    });
  });

  describe("getTierBenefits", () => {
    it("should return benefits for basic tier", () => {
      const benefits = getTierBenefits("basic");
      expect(benefits).toContain("Standard profile customization");
      expect(benefits.length).toBeGreaterThan(0);
    });

    it("should return more benefits for vip tier", () => {
      const basicBenefits = getTierBenefits("basic");
      const vipBenefits = getTierBenefits("vip");
      expect(vipBenefits.length).toBeGreaterThan(basicBenefits.length);
    });
  });

  describe("getTierFeatures", () => {
    it("should return features for basic tier", () => {
      const features = getTierFeatures("basic");
      expect(features.unlimitedLounges).toBe(false);
      expect(features.premiumDecorations).toBe(false);
    });

    it("should return features for vip tier", () => {
      const features = getTierFeatures("vip");
      expect(features.unlimitedLounges).toBe(true);
      expect(features.premiumDecorations).toBe(true);
      expect(features.customThemes).toBe(true);
    });

    it("should return features for super_vip tier", () => {
      const features = getTierFeatures("super_vip");
      expect(features.unlimitedLounges).toBe(true);
      expect(features.customAnimations).toBe(true);
      expect(features.advancedAnalytics).toBe(true);
    });
  });

  describe("hasTierFeature", () => {
    it("should check if tier has feature", () => {
      expect(hasTierFeature("basic", "unlimitedLounges")).toBe(false);
      expect(hasTierFeature("vip", "unlimitedLounges")).toBe(true);
      expect(hasTierFeature("super_vip", "advancedAnalytics")).toBe(true);
    });
  });

  describe("getCoinMultiplier", () => {
    it("should return correct coin multipliers", () => {
      expect(getCoinMultiplier("basic")).toBe(1.0);
      expect(getCoinMultiplier("vip")).toBe(2.0);
      expect(getCoinMultiplier("super_vip")).toBe(3.0);
    });
  });

  describe("getMaxLounges", () => {
    it("should return correct max lounges", () => {
      expect(getMaxLounges("basic")).toBe(1);
      expect(getMaxLounges("vip")).toBe(999);
      expect(getMaxLounges("super_vip")).toBe(999);
    });
  });

  describe("getTierBadgeColor", () => {
    it("should return correct badge colors", () => {
      expect(getTierBadgeColor("basic")).toBe("#7a7f8e");
      expect(getTierBadgeColor("vip")).toBe("#00eaff");
      expect(getTierBadgeColor("super_vip")).toBe("#ffd700");
    });
  });

  describe("calculateDaysRemaining", () => {
    it("should calculate days remaining correctly", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const daysRemaining = calculateDaysRemaining(futureDate);
      expect(daysRemaining).toBeGreaterThanOrEqual(29);
      expect(daysRemaining).toBeLessThanOrEqual(30);
    });

    it("should return 0 for past dates", () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const daysRemaining = calculateDaysRemaining(pastDate);
      expect(daysRemaining).toBe(0);
    });
  });

  describe("isTierActive", () => {
    it("should return true for no expiry date", () => {
      expect(isTierActive()).toBe(true);
    });

    it("should return true for future expiry", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      expect(isTierActive(futureDate)).toBe(true);
    });

    it("should return false for past expiry", () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      expect(isTierActive(pastDate)).toBe(false);
    });
  });

  describe("getTierUpgradePrice", () => {
    it("should calculate upgrade price from basic to vip", () => {
      const price = getTierUpgradePrice("basic", "vip");
      expect(price).toBe(9.99);
    });

    it("should calculate upgrade price from vip to super_vip", () => {
      const price = getTierUpgradePrice("vip", "super_vip");
      expect(price).toBeCloseTo(15.0, 2);
    });

    it("should return 0 for downgrade", () => {
      const price = getTierUpgradePrice("vip", "basic");
      expect(price).toBe(0);
    });
  });

  describe("getTierComparison", () => {
    it("should return comparison data with all tiers and features", () => {
      const comparison = getTierComparison();
      expect(comparison.tiers).toHaveLength(3);
      expect(comparison.features.length).toBeGreaterThan(0);
    });
  });

  describe("formatTierName", () => {
    it("should format tier names correctly", () => {
      expect(formatTierName("basic")).toBe("Basic Member");
      expect(formatTierName("vip")).toBe("VIP Member");
      expect(formatTierName("super_vip")).toBe("Super VIP Member");
    });
  });

  describe("isValidTier", () => {
    it("should validate tier strings", () => {
      expect(isValidTier("basic")).toBe(true);
      expect(isValidTier("vip")).toBe(true);
      expect(isValidTier("super_vip")).toBe(true);
      expect(isValidTier("invalid")).toBe(false);
      expect(isValidTier("")).toBe(false);
    });
  });
});
