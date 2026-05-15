import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { getOrCreateUserProfile, getDecorationPackages, updateUserProfile, getCoinBalance, addCoinTransaction, getCoinTransactionHistory, addXP, getAchievements, getUserAchievements, unlockAchievement, createLounge, getUserLounges, getLounge, getLoungeMembersWithUsers, addLoungeMember, removeLoungeMember, addLoungeMessage, getLoungeMessages, updateLounge } from "./db";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  profile: router({
    getMe: protectedProcedure.query(async ({ ctx }) => {
      return await getOrCreateUserProfile(ctx.user.id);
    }),
    updateTheme: protectedProcedure
      .input(z.object({ theme: z.enum(["magenta", "cyan", "purple"]) }))
      .mutation(async ({ ctx, input }) => {
        return await updateUserProfile(ctx.user.id, { neonTheme: input.theme });
      }),
    applyDecorations: protectedProcedure
      .input(z.object({ packageIds: z.array(z.number()) }))
      .mutation(async ({ ctx, input }) => {
        return await updateUserProfile(ctx.user.id, {
          decorationPackageIds: input.packageIds,
        });
      }),
  }),

  decorations: router({
    list: publicProcedure.query(async () => {
      return await getDecorationPackages();
    }),
  }),

  coin: router({
    getBalance: protectedProcedure.query(async ({ ctx }) => {
      const balance = await getCoinBalance(ctx.user.id);
      return { balance: balance || "0" };
    }),
    earn: protectedProcedure
      .input(z.object({ amount: z.string(), reason: z.string() }))
      .mutation(async ({ ctx, input }) => {
        return await addCoinTransaction(ctx.user.id, "earn", input.amount, input.reason);
      }),
    spend: protectedProcedure
      .input(z.object({ amount: z.string(), reason: z.string() }))
      .mutation(async ({ ctx, input }) => {
        return await addCoinTransaction(ctx.user.id, "spend", input.amount, input.reason);
      }),
    history: protectedProcedure.query(async ({ ctx }) => {
      return await getCoinTransactionHistory(ctx.user.id);
    }),
  }),

  achievement: router({
    getAll: publicProcedure.query(async () => getAchievements()),
    getUserAchievements: protectedProcedure.query(async ({ ctx }) => getUserAchievements(ctx.user.id)),
    addXP: protectedProcedure
      .input(z.object({ amount: z.number().positive() }))
      .mutation(async ({ ctx, input }) => addXP(ctx.user.id, input.amount)),
    unlock: protectedProcedure
      .input(z.object({ achievementId: z.number() }))
      .mutation(async ({ ctx, input }) => unlockAchievement(ctx.user.id, input.achievementId)),
  }),

  lounge: router({
    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1, "Lounge name is required"),
          type: z.enum(["family", "friends", "coworkers"]),
          description: z.string().optional(),
          costAnom: z.string().optional(),
          costReal: z.string().optional(),
          neonTheme: z.enum(["magenta", "cyan", "purple"]).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await createLounge(
          ctx.user.id,
          input.name,
          input.type,
          input.description,
          input.costAnom,
          input.costReal,
          input.neonTheme
        );
      }),

    getMyLounges: protectedProcedure.query(async ({ ctx }) => {
      return await getUserLounges(ctx.user.id);
    }),

    getById: protectedProcedure
      .input(z.object({ loungeId: z.number() }))
      .query(async ({ input }) => {
        return await getLounge(input.loungeId);
      }),

    getMembers: protectedProcedure
      .input(z.object({ loungeId: z.number() }))
      .query(async ({ input }) => {
        return await getLoungeMembersWithUsers(input.loungeId);
      }),

    addMember: protectedProcedure
      .input(
        z.object({
          loungeId: z.number(),
          userId: z.number(),
          role: z.enum(["owner", "admin", "member"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await addLoungeMember(input.loungeId, input.userId, input.role);
      }),

    removeMember: protectedProcedure
      .input(z.object({ loungeId: z.number(), userId: z.number() }))
      .mutation(async ({ input }) => {
        return await removeLoungeMember(input.loungeId, input.userId);
      }),

    sendMessage: protectedProcedure
      .input(
        z.object({
          loungeId: z.number(),
          content: z.string().min(1, "Message cannot be empty"),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await addLoungeMessage(input.loungeId, ctx.user.id, input.content);
      }),

    getMessages: protectedProcedure
      .input(z.object({ loungeId: z.number(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        return await getLoungeMessages(input.loungeId, input.limit);
      }),

    updateSettings: protectedProcedure
      .input(
        z.object({
          loungeId: z.number(),
          name: z.string().optional(),
          description: z.string().optional(),
          neonTheme: z.enum(["magenta", "cyan", "purple"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const updates: Record<string, any> = {};
        if (input.name) updates.name = input.name;
        if (input.description) updates.description = input.description;
        if (input.neonTheme) updates.neonTheme = input.neonTheme;
        return await updateLounge(input.loungeId, updates);
      }),
  }),
});

export type AppRouter = typeof appRouter;
