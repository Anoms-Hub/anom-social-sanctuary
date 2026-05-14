import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, userProfiles, decorationPackages, coinTransactions, achievements, userAchievements } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getOrCreateUserProfile(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user profile: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
    if (result.length > 0) {
      return result[0];
    }

    // Create new profile if it doesn't exist
    await db.insert(userProfiles).values({
      userId,
      level: 1,
      xp: 0,
      anomCoinBalance: "0",
      neonTheme: "magenta",
      decorationPackageIds: [],
    });

    const newProfile = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
    return newProfile.length > 0 ? newProfile[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get or create user profile:", error);
    throw error;
  }
}

export async function getDecorationPackages() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get decoration packages: database not available");
    return [];
  }

  try {
    return await db.select().from(decorationPackages);
  } catch (error) {
    console.error("[Database] Failed to get decoration packages:", error);
    throw error;
  }
}

export async function updateUserProfile(userId: number, updates: Partial<typeof userProfiles.$inferInsert>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update user profile: database not available");
    return undefined;
  }

  try {
    await db.update(userProfiles).set(updates).where(eq(userProfiles.userId, userId));
    const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to update user profile:", error);
    throw error;
  }
}

export async function getCoinBalance(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get coin balance: database not available");
    return "0";
  }

  try {
    const profile = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
    return profile.length > 0 ? profile[0].anomCoinBalance : "0";
  } catch (error) {
    console.error("[Database] Failed to get coin balance:", error);
    throw error;
  }
}

export async function addCoinTransaction(userId: number, type: "earn" | "spend", amount: string, reason: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot add coin transaction: database not available");
    return undefined;
  }

  try {
    // Get current balance
    const profile = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
    if (profile.length === 0) {
      throw new Error("User profile not found");
    }

    const currentBalance = parseFloat(profile[0].anomCoinBalance || "0");
    const amountNum = parseFloat(amount);
    let newBalance = currentBalance;

    if (type === "earn") {
      newBalance = currentBalance + amountNum;
    } else if (type === "spend") {
      if (currentBalance < amountNum) {
        throw new Error("Insufficient Anom Coin balance");
      }
      newBalance = currentBalance - amountNum;
    }

    // Record transaction
    await db.insert(coinTransactions).values({
      userId,
      type,
      amount,
      reason,
    });

    // Update profile balance
    await db.update(userProfiles).set({ anomCoinBalance: newBalance.toString() }).where(eq(userProfiles.userId, userId));

    return { success: true, newBalance: newBalance.toString() };
  } catch (error) {
    console.error("[Database] Failed to add coin transaction:", error);
    throw error;
  }
}

export async function getCoinTransactionHistory(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get coin history: database not available");
    return [];
  }

  try {
    return await db.select().from(coinTransactions).where(eq(coinTransactions.userId, userId));
  } catch (error) {
    console.error("[Database] Failed to get coin transaction history:", error);
    throw error;
  }
}

export async function addXP(userId: number, amount: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot add XP: database not available");
    return undefined;
  }

  try {
    const profile = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
    if (profile.length === 0) {
      throw new Error("User profile not found");
    }

    const currentXP = profile[0].xp || 0;
    const currentLevel = profile[0].level || 1;
    let newXP = currentXP + amount;
    let newLevel = currentLevel;

    // Level up every 100 XP
    const xpPerLevel = 100;
    while (newXP >= xpPerLevel) {
      newLevel += 1;
      newXP -= xpPerLevel;
    }

    await db.update(userProfiles).set({ xp: newXP, level: newLevel }).where(eq(userProfiles.userId, userId));

    return { success: true, newLevel, newXP, leveledUp: newLevel > currentLevel };
  } catch (error) {
    console.error("[Database] Failed to add XP:", error);
    throw error;
  }
}

export async function getAchievements() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get achievements: database not available");
    return [];
  }

  try {
    return await db.select().from(achievements);
  } catch (error) {
    console.error("[Database] Failed to get achievements:", error);
    throw error;
  }
}

export async function getUserAchievements(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user achievements: database not available");
    return [];
  }

  try {
    return await db.select().from(userAchievements).where(eq(userAchievements.userId, userId));
  } catch (error) {
    console.error("[Database] Failed to get user achievements:", error);
    throw error;
  }
}

export async function unlockAchievement(userId: number, achievementId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot unlock achievement: database not available");
    return undefined;
  }

  try {
    // Check if already unlocked
    const existing = await db.select().from(userAchievements).where(eq(userAchievements.userId, userId) && eq(userAchievements.achievementId, achievementId)).limit(1);
    if (existing.length > 0) {
      return { success: false, message: "Achievement already unlocked" };
    }

    await db.insert(userAchievements).values({
      userId,
      achievementId,
    });

    return { success: true, message: "Achievement unlocked!" };
  } catch (error) {
    console.error("[Database] Failed to unlock achievement:", error);
    throw error;
  }
}

// TODO: add feature queries here as your schema grows.
