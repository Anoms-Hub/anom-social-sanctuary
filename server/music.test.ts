import { describe, it, expect } from "vitest";
import {
  getAllMusicTracks,
  searchMusic,
  getMusicByMood,
  getMusicByGenre,
  getMusicForUseCase,
  getPopularMusic,
  getMusicLicenseInfo,
  getAvailableGenres,
  getAvailableMoods,
  getMusicTrackById,
} from "./music";

describe("Music Service", () => {
  it("should return all music tracks", () => {
    const tracks = getAllMusicTracks();
    expect(Array.isArray(tracks)).toBe(true);
    expect(tracks.length).toBeGreaterThan(0);
  });

  it("should have required fields in tracks", () => {
    const tracks = getAllMusicTracks();
    tracks.forEach((track) => {
      expect(track).toHaveProperty("id");
      expect(track).toHaveProperty("title");
      expect(track).toHaveProperty("artist");
      expect(track).toHaveProperty("duration");
      expect(track).toHaveProperty("genre");
      expect(track).toHaveProperty("mood");
      expect(track).toHaveProperty("license");
      expect(track).toHaveProperty("url");
      expect(track).toHaveProperty("attribution");
    });
  });

  it("should search music by title", () => {
    const results = searchMusic("ambient");
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title.toLowerCase()).toContain("ambient");
  });

  it("should search music by artist", () => {
    const results = searchMusic("pixabay");
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by mood", () => {
    const results = getMusicByMood("chill");
    expect(Array.isArray(results)).toBe(true);
    results.forEach((track) => {
      expect(track.mood).toBe("chill");
    });
  });

  it("should filter by genre", () => {
    const results = getMusicByGenre("ambient");
    expect(Array.isArray(results)).toBe(true);
    results.forEach((track) => {
      expect(track.genre).toBe("ambient");
    });
  });

  it("should return music for lounge use case", () => {
    const results = getMusicForUseCase("lounge");
    expect(Array.isArray(results)).toBe(true);
    results.forEach((track) => {
      expect(track.mood).toBe("chill");
    });
  });

  it("should return music for profile use case", () => {
    const results = getMusicForUseCase("profile");
    expect(Array.isArray(results)).toBe(true);
    results.forEach((track) => {
      expect(track.mood).toBe("uplifting");
    });
  });

  it("should return music for meme use case", () => {
    const results = getMusicForUseCase("meme");
    expect(Array.isArray(results)).toBe(true);
    results.forEach((track) => {
      expect(track.mood).toBe("energetic");
    });
  });

  it("should return music for promotion use case", () => {
    const results = getMusicForUseCase("promotion");
    expect(Array.isArray(results)).toBe(true);
    results.forEach((track) => {
      expect(track.mood).toBe("inspiring");
    });
  });

  it("should return popular music with limit", () => {
    const results = getPopularMusic(5);
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeLessThanOrEqual(5);
  });

  it("should return license info for pixabay", () => {
    const info = getMusicLicenseInfo("pixabay");
    expect(info).toHaveProperty("name");
    expect(info).toHaveProperty("attribution");
    expect(info).toHaveProperty("link");
    expect(info).toHaveProperty("commercial");
    expect(info.commercial).toBe(true);
  });

  it("should return license info for epidemic", () => {
    const info = getMusicLicenseInfo("epidemic");
    expect(info.commercial).toBe(true);
  });

  it("should return available genres", () => {
    const genres = getAvailableGenres();
    expect(Array.isArray(genres)).toBe(true);
    expect(genres.length).toBeGreaterThan(0);
  });

  it("should return available moods", () => {
    const moods = getAvailableMoods();
    expect(Array.isArray(moods)).toBe(true);
    expect(moods.length).toBeGreaterThan(0);
  });

  it("should get track by ID", () => {
    const allTracks = getAllMusicTracks();
    const trackId = allTracks[0].id;
    const track = getMusicTrackById(trackId);
    expect(track).toBeDefined();
    expect(track?.id).toBe(trackId);
  });

  it("should return undefined for non-existent track ID", () => {
    const track = getMusicTrackById("non-existent-id");
    expect(track).toBeUndefined();
  });

  it("should search with multiple filters", () => {
    const results = searchMusic("", { genre: "ambient", mood: "chill" });
    expect(Array.isArray(results)).toBe(true);
    results.forEach((track) => {
      expect(track.genre).toBe("ambient");
      expect(track.mood).toBe("chill");
    });
  });

  it("should handle empty search query", () => {
    const results = searchMusic("");
    expect(Array.isArray(results)).toBe(true);
  });
});
