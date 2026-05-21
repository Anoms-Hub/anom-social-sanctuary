import { notifyOwner } from "./notification";
import { adminProcedure, publicProcedure, router, protectedProcedure } from "./trpc";
import { z } from "zod";

export const systemRouter = router({
  health: publicProcedure
    .input(
      z.object({
        timestamp: z.number().min(0, "timestamp cannot be negative"),
      })
    )
    .query(() => ({
      ok: true,
    })),

  notifyOwner: adminProcedure
    .input(
      z.object({
        title: z.string().min(1, "title is required"),
        content: z.string().min(1, "content is required"),
      })
    )
    .mutation(async ({ input }) => {
      const delivered = await notifyOwner(input);
      return {
        success: delivered,
      } as const;
    }),

  getStats: adminProcedure.query(async () => {
    // Return real-time stats - in production, query database
    return {
      totalUsers: 1234,
      userGrowth: 12,
      activeMembers: 567,
      activeGrowth: 8,
      monthlyRevenue: 4250,
      revenueGrowth: 25,
      coinsDistributed: 45678,
      coinsGrowth: 15,
      totalLounges: 89,
      totalOrders: 234,
      achievementsUnlocked: 567,
    };
  }),

  getAllUsers: adminProcedure.query(async ({ ctx }) => {
    // Return mock users for now - in production, query from database
    return [
      { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin', createdAt: new Date() },
      { id: 2, name: 'Test User', email: 'user@example.com', role: 'user', createdAt: new Date() },
    ];
  }),

  getEvents: adminProcedure.query(async () => {
    // Return mock events for now - in production, query from database
    return [];
  }),

  createEvent: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        date: z.string(),
        imageUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // In production, save to database
      return { id: Date.now(), ...input };
    }),

  deleteEvent: adminProcedure
    .input(z.object({ eventId: z.number() }))
    .mutation(async ({ input }) => {
      // In production, delete from database
      return { success: true };
    }),

  updateSettings: adminProcedure
    .input(
      z.object({
        siteName: z.string(),
        siteDescription: z.string(),
        maxCoinsPerDay: z.number(),
        levelUpXP: z.number(),
        achievementMultiplier: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      // In production, save to database
      return { success: true };
    }),
});
