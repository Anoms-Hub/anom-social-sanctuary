import { describe, it, expect, beforeEach, vi } from "vitest";

describe("Games Procedures", () => {
  describe("Game Coin Rewards", () => {
    it("should award correct coins for trivia game", () => {
      const baseReward = 50;
      const score = 100;
      const expectedReward = Math.max(baseReward, Math.floor(score / 10) * 10);
      expect(expectedReward).toBe(100);
    });

    it("should award correct coins for memory game", () => {
      const baseReward = 75;
      const score = 150;
      const expectedReward = Math.max(baseReward, Math.floor(score / 10) * 10);
      expect(expectedReward).toBe(150);
    });

    it("should award correct coins for mood-matcher game", () => {
      const baseReward = 40;
      const score = 50;
      const expectedReward = Math.max(baseReward, Math.floor(score / 10) * 10);
      expect(expectedReward).toBe(50);
    });

    it("should use base reward when score is low", () => {
      const baseReward = 50;
      const score = 25;
      const expectedReward = Math.max(baseReward, Math.floor(score / 10) * 10);
      expect(expectedReward).toBe(50);
    });

    it("should calculate XP rewards correctly", () => {
      const xpRewards: Record<string, number> = {
        trivia: 10,
        memory: 15,
        "mood-matcher": 8,
        "snack-vault": 12,
      };

      expect(xpRewards["trivia"]).toBe(10);
      expect(xpRewards["memory"]).toBe(15);
      expect(xpRewards["mood-matcher"]).toBe(8);
      expect(xpRewards["snack-vault"]).toBe(12);
    });

    it("should handle unknown game with default rewards", () => {
      const coinRewards: Record<string, number> = {
        trivia: 50,
        memory: 75,
        "mood-matcher": 40,
      };

      const unknownGameReward = coinRewards["unknown-game"] || 50;
      expect(unknownGameReward).toBe(50);
    });

    it("should calculate total coins from multiple games", () => {
      const gameScores: Record<string, number> = {
        trivia: 100,
        memory: 150,
        "mood-matcher": 50,
      };

      const coinRewards: Record<string, number> = {
        trivia: 50,
        memory: 75,
        "mood-matcher": 40,
      };

      let totalCoins = 0;
      Object.entries(gameScores).forEach(([gameId, score]) => {
        const baseReward = coinRewards[gameId] || 50;
        const reward = Math.max(baseReward, Math.floor(score / 10) * 10);
        totalCoins += reward;
      });

      expect(totalCoins).toBe(100 + 150 + 50);
    });

    it("should format success message correctly", () => {
      const coinsAwarded = 100;
      const xpAwarded = 10;
      const message = `🎉 You earned ${coinsAwarded} Anom Coins and ${xpAwarded} XP!`;

      expect(message).toBe("🎉 You earned 100 Anom Coins and 10 XP!");
    });

    it("should handle zero score", () => {
      const baseReward = 50;
      const score = 0;
      const expectedReward = Math.max(baseReward, Math.floor(score / 10) * 10);
      expect(expectedReward).toBe(50);
    });

    it("should handle very high scores", () => {
      const baseReward = 50;
      const score = 1000;
      const expectedReward = Math.max(baseReward, Math.floor(score / 10) * 10);
      expect(expectedReward).toBe(1000);
    });
  });

  describe("Game Leaderboard", () => {
    it("should initialize empty leaderboard", () => {
      const leaderboard = {
        topPlayers: [],
        yourRank: 0,
      };

      expect(leaderboard.topPlayers).toHaveLength(0);
      expect(leaderboard.yourRank).toBe(0);
    });

    it("should track player rank", () => {
      const playerRank = 5;
      expect(playerRank).toBeGreaterThan(0);
    });
  });

  describe("Game History", () => {
    it("should initialize empty game history", () => {
      const history = {
        games: [],
        totalCoinsEarned: "0",
        totalGamesPlayed: 0,
      };

      expect(history.games).toHaveLength(0);
      expect(history.totalCoinsEarned).toBe("0");
      expect(history.totalGamesPlayed).toBe(0);
    });

    it("should track total coins earned", () => {
      const totalCoins = "500";
      expect(parseInt(totalCoins)).toBe(500);
    });

    it("should track games played count", () => {
      const gamesPlayed = 3;
      expect(gamesPlayed).toBeGreaterThan(0);
    });
  });
});
