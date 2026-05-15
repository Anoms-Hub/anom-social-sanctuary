import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, userProfiles, decorationPackages, coinTransactions, achievements, userAchievements, lounges, loungeMembers, loungeMessages, kidsProgress } from "../drizzle/schema";
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

// ============================================
// LOUNGE HELPERS
// ============================================

export async function createLounge(
  ownerId: number,
  name: string,
  type: "family" | "friends" | "coworkers",
  description?: string,
  costAnom?: string,
  costReal?: string,
  neonTheme?: string
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create lounge: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(lounges).values({
      ownerId,
      name,
      type,
      description,
      costAnom: costAnom || "0",
      costReal: costReal || "0",
      neonTheme: neonTheme || "magenta",
      isPublic: false,
    });

    // Get the created lounge
    const createdLounge = await db
      .select()
      .from(lounges)
      .where(eq(lounges.ownerId, ownerId))
      .orderBy((t) => t.createdAt)
      .limit(1);

    if (createdLounge.length > 0) {
      // Add owner as member
      await db.insert(loungeMembers).values({
        loungeId: createdLounge[0].id,
        userId: ownerId,
        role: "owner",
      });

      return createdLounge[0];
    }

    return undefined;
  } catch (error) {
    console.error("[Database] Failed to create lounge:", error);
    throw error;
  }
}

export async function getUserLounges(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user lounges: database not available");
    return [];
  }

  try {
    // Get lounges where user is a member
    const memberLounges = await db
      .select()
      .from(lounges)
      .innerJoin(loungeMembers, eq(lounges.id, loungeMembers.loungeId))
      .where(eq(loungeMembers.userId, userId));

    return memberLounges.map((row) => row.lounges);
  } catch (error) {
    console.error("[Database] Failed to get user lounges:", error);
    throw error;
  }
}

export async function getLounge(loungeId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get lounge: database not available");
    return undefined;
  }

  try {
    const result = await db
      .select()
      .from(lounges)
      .where(eq(lounges.id, loungeId))
      .limit(1);

    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get lounge:", error);
    throw error;
  }
}

export async function getLoungeMembersWithUsers(loungeId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get lounge members: database not available");
    return [];
  }

  try {
    const result = await db
      .select()
      .from(loungeMembers)
      .innerJoin(users, eq(loungeMembers.userId, users.id))
      .where(eq(loungeMembers.loungeId, loungeId));

    return result.map((row) => ({
      member: row.lounge_members,
      user: row.users,
    }));
  } catch (error) {
    console.error("[Database] Failed to get lounge members:", error);
    throw error;
  }
}

export async function addLoungeMember(
  loungeId: number,
  userId: number,
  role: "owner" | "admin" | "member" = "member"
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot add lounge member: database not available");
    return undefined;
  }

  try {
    // Check if already a member
    const existing = await db
      .select()
      .from(loungeMembers)
      .where(
        and(
          eq(loungeMembers.loungeId, loungeId),
          eq(loungeMembers.userId, userId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return { success: false, message: "User is already a member" };
    }

    await db.insert(loungeMembers).values({
      loungeId,
      userId,
      role,
    });

    return { success: true, message: "Member added" };
  } catch (error) {
    console.error("[Database] Failed to add lounge member:", error);
    throw error;
  }
}

export async function removeLoungeMember(loungeId: number, userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot remove lounge member: database not available");
    return undefined;
  }

  try {
    await db
      .delete(loungeMembers)
      .where(
        and(
          eq(loungeMembers.loungeId, loungeId),
          eq(loungeMembers.userId, userId)
        )
      );

    return { success: true, message: "Member removed" };
  } catch (error) {
    console.error("[Database] Failed to remove lounge member:", error);
    throw error;
  }
}

export async function addLoungeMessage(
  loungeId: number,
  userId: number,
  content: string
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot add lounge message: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(loungeMessages).values({
      loungeId,
      userId,
      content,
    });

    // Return the created message
    const messages = await db
      .select()
      .from(loungeMessages)
      .where(eq(loungeMessages.loungeId, loungeId))
      .orderBy((t) => t.createdAt)
      .limit(1);

    return messages.length > 0 ? messages[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to add lounge message:", error);
    throw error;
  }
}

export async function getLoungeMessages(loungeId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get lounge messages: database not available");
    return [];
  }

  try {
    return await db
      .select()
      .from(loungeMessages)
      .where(eq(loungeMessages.loungeId, loungeId))
      .orderBy((t) => t.createdAt)
      .limit(limit);
  } catch (error) {
    console.error("[Database] Failed to get lounge messages:", error);
    throw error;
  }
}

export async function updateLounge(
  loungeId: number,
  updates: Partial<typeof lounges.$inferInsert>
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update lounge: database not available");
    return undefined;
  }

  try {
    await db.update(lounges).set(updates).where(eq(lounges.id, loungeId));

    const result = await db
      .select()
      .from(lounges)
      .where(eq(lounges.id, loungeId))
      .limit(1);

    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to update lounge:", error);
    throw error;
  }
}

// TODO: add feature queries here as your schema grows.

// ============================================
// KIDS CORNER HELPERS
// ============================================

export async function getKidsContent() {
  // Return hardcoded Kids Corner content
  // In production, this would fetch from a content management system
  return [
    {
      id: "pixel-dot-1",
      type: "video",
      title: "Pixel & Dot Episode 1: The Adventure Begins",
      description: "Join Pixel and Dot on their first adventure in the digital universe!",
      url: "https://example.com/pixel-dot-ep1.mp4",
      duration: 15,
      ageRating: 4,
    },
    {
      id: "pixel-dot-2",
      type: "video",
      title: "Pixel & Dot Episode 2: Colors of the Universe",
      description: "Discover the magical colors of the Anom Universe.",
      url: "https://example.com/pixel-dot-ep2.mp4",
      duration: 15,
      ageRating: 4,
    },
    {
      id: "pixel-dot-3",
      type: "video",
      title: "Pixel & Dot Episode 3: Making Friends",
      description: "Learn about friendship and kindness.",
      url: "https://example.com/pixel-dot-ep3.mp4",
      duration: 15,
      ageRating: 4,
    },
    {
      id: "coloring-1",
      type: "coloring",
      title: "Pixel's Coloring Page",
      description: "Color Pixel in the digital landscape.",
      url: "https://example.com/coloring-pixel.svg",
      ageRating: 3,
    },
    {
      id: "offgrid-1",
      type: "game",
      title: "Off-Grid Adventure: Kids Edition",
      description: "A fun educational game for kids.",
      url: "https://example.com/offgrid-kids.html",
      ageRating: 5,
    },
  ];
}

export async function trackKidsProgress(
  userId: number,
  contentType: string,
  contentId: string
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot track kids progress: database not available");
    return undefined;
  }

  try {
    // Check if progress already exists
    const existing = await db
      .select()
      .from(kidsProgress)
      .where(
        and(
          eq(kidsProgress.userId, userId),
          eq(kidsProgress.contentId, contentId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      // Update existing progress
      await db
        .update(kidsProgress)
        .set({ completed: true, completedAt: new Date() })
        .where(eq(kidsProgress.id, existing[0].id));

      return existing[0];
    }

    // Create new progress entry
    await db.insert(kidsProgress).values({
      userId,
      contentType,
      contentId,
      completed: true,
      completedAt: new Date(),
    });

    const result = await db
      .select()
      .from(kidsProgress)
      .where(
        and(
          eq(kidsProgress.userId, userId),
          eq(kidsProgress.contentId, contentId)
        )
      )
      .limit(1);

    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to track kids progress:", error);
    throw error;
  }
}

export async function getUserKidsProgress(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get kids progress: database not available");
    return [];
  }

  try {
    return await db
      .select()
      .from(kidsProgress)
      .where(eq(kidsProgress.userId, userId));
  } catch (error) {
    console.error("[Database] Failed to get kids progress:", error);
    throw error;
  }
}
