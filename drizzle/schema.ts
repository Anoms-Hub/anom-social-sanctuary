import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with Anom Artsy profile and economy fields.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * User Profiles — stores Anom Artsy-specific profile data
 */
export const userProfiles = mysqlTable("user_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().unique(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  neonTheme: varchar("neon_theme", { length: 50 }).default("magenta"),
  decorationPackageIds: json("decoration_package_ids").$type<number[]>().default([]),
  level: int("level").default(1),
  xp: int("xp").default(0),
  anomCoinBalance: decimal("anom_coin_balance", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;

/**
 * Decoration Packages — pre-built neon themes, character badges, mood glows
 */
export const decorationPackages = mysqlTable("decoration_packages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }).notNull(), // "character_badge", "mood_glow", "neon_theme"
  imageUrl: text("image_url"),
  costAnom: decimal("cost_anom", { precision: 10, scale: 2 }).default("0"),
  costReal: decimal("cost_real", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type DecorationPackage = typeof decorationPackages.$inferSelect;
export type InsertDecorationPackage = typeof decorationPackages.$inferInsert;

/**
 * Anom Coin Transactions — track all coin earning and spending
 */
export const coinTransactions = mysqlTable("coin_transactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: mysqlEnum("type", ["earn", "spend"]).notNull(),
  reason: varchar("reason", { length: 100 }).notNull(), // "game_completion", "lesson_finish", "package_purchase", etc.
  relatedId: int("related_id"), // ID of related entity (game score, achievement, etc.)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type CoinTransaction = typeof coinTransactions.$inferSelect;
export type InsertCoinTransaction = typeof coinTransactions.$inferInsert;

/**
 * Achievements — visual badges earned for positive engagement
 */
export const achievements = mysqlTable("achievements", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  iconUrl: text("icon_url"),
  category: varchar("category", { length: 50 }).notNull(), // "social_good", "game", "family", "community"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = typeof achievements.$inferInsert;

/**
 * User Achievements — tracks which achievements a user has earned
 */
export const userAchievements = mysqlTable("user_achievements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  achievementId: int("achievement_id").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
});

export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = typeof userAchievements.$inferInsert;

/**
 * Lounges — private social spaces for Family, Friends, Coworkers
 */
export const lounges = mysqlTable("lounges", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  type: mysqlEnum("type", ["family", "friends", "coworkers"]).notNull(),
  ownerId: int("owner_id").notNull(),
  description: text("description"),
  neonTheme: varchar("neon_theme", { length: 50 }).default("magenta"),
  costAnom: decimal("cost_anom", { precision: 10, scale: 2 }).default("0"),
  costReal: decimal("cost_real", { precision: 10, scale: 2 }).default("0"),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Lounge = typeof lounges.$inferSelect;
export type InsertLounge = typeof lounges.$inferInsert;

/**
 * Lounge Members — tracks membership and access
 */
export const loungeMembers = mysqlTable("lounge_members", {
  id: int("id").autoincrement().primaryKey(),
  loungeId: int("lounge_id").notNull(),
  userId: int("user_id").notNull(),
  role: mysqlEnum("role", ["owner", "admin", "member"]).default("member"),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export type LoungeMember = typeof loungeMembers.$inferSelect;
export type InsertLoungeMember = typeof loungeMembers.$inferInsert;

/**
 * Lounge Messages — chat history within lounges
 */
export const loungeMessages = mysqlTable("lounge_messages", {
  id: int("id").autoincrement().primaryKey(),
  loungeId: int("lounge_id").notNull(),
  userId: int("user_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type LoungeMessage = typeof loungeMessages.$inferSelect;
export type InsertLoungeMessage = typeof loungeMessages.$inferInsert;

/**
 * Merch Requests — customer custom art requests
 */
export const merchRequests = mysqlTable("merch_requests", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  title: varchar("title", { length: 100 }).notNull(),
  description: text("description").notNull(),
  referenceImages: json("reference_images").$type<string[]>().default([]),
  status: mysqlEnum("status", ["pending", "approved", "in_progress", "completed", "rejected"]).default("pending"),
  estimatedPrice: decimal("estimated_price", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type MerchRequest = typeof merchRequests.$inferSelect;
export type InsertMerchRequest = typeof merchRequests.$inferInsert;

/**
 * Merch Orders — completed purchases
 */
export const merchOrders = mysqlTable("merch_orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  requestId: int("request_id"),
  productName: varchar("product_name", { length: 100 }).notNull(),
  quantity: int("quantity").default(1),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: mysqlEnum("payment_status", ["pending", "paid", "failed"]).default("pending"),
  fulfillmentStatus: mysqlEnum("fulfillment_status", ["pending", "created", "shipped", "delivered"]).default("pending"),
  printfulOrderId: varchar("printful_order_id", { length: 100 }),
  trackingUrl: text("tracking_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type MerchOrder = typeof merchOrders.$inferSelect;
export type InsertMerchOrder = typeof merchOrders.$inferInsert;

/**
 * Game Scores — tracks mini-game performance
 */
export const gameScores = mysqlTable("game_scores", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  gameName: varchar("game_name", { length: 50 }).notNull(), // "trivia", "memory", "mood_matcher", "snack_vault"
  score: int("score").notNull(),
  coinReward: decimal("coin_reward", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type GameScore = typeof gameScores.$inferSelect;
export type InsertGameScore = typeof gameScores.$inferInsert;

/**
 * Social Feed Posts — community content (memes, highlights, updates)
 */
export const feedPosts = mysqlTable("feed_posts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id"),
  postType: mysqlEnum("post_type", ["meme", "highlight", "update", "achievement"]).notNull(),
  title: varchar("title", { length: 100 }),
  content: text("content"),
  imageUrl: text("image_url"),
  likes: int("likes").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type FeedPost = typeof feedPosts.$inferSelect;
export type InsertFeedPost = typeof feedPosts.$inferInsert;

/**
 * Kids Corner Progress — tracks lessons, videos watched, game completions
 */
export const kidsProgress = mysqlTable("kids_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  contentType: varchar("content_type", { length: 50 }).notNull(), // "video", "lesson", "game", "coloring"
  contentId: varchar("content_id", { length: 100 }).notNull(),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type KidsProgress = typeof kidsProgress.$inferSelect;
export type InsertKidsProgress = typeof kidsProgress.$inferInsert;
