import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { getOrCreateUserProfile, getDecorationPackages, updateUserProfile, getCoinBalance, addCoinTransaction, getCoinTransactionHistory, addXP, getAchievements, getUserAchievements, unlockAchievement, createLounge, getUserLounges, getLounge, getLoungeMembersWithUsers, addLoungeMember, removeLoungeMember, addLoungeMessage, getLoungeMessages, updateLounge, getKidsContent, trackKidsProgress, getUserKidsProgress } from "./db";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "../shared/const";

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
    getPublic: publicProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input, ctx }) => {
        const profile = await getOrCreateUserProfile(input.userId);
        if (!profile) return null;
        // Get user name from context
        const userName = ctx.user?.name || "Anonymous";
        // Return only public fields
        return {
          id: profile.id,
          userId: profile.userId,
          bio: profile.bio,
          neonTheme: profile.neonTheme,
          avatarUrl: profile.avatarUrl,
          coins: profile.anomCoinBalance || "0",
          level: profile.level || 1,
          achievements: 0,
          name: userName,
        };
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

  kidsCorner: router({
    getContent: publicProcedure.query(async () => {
      return await getKidsContent();
    }),

    trackProgress: protectedProcedure
      .input(
        z.object({
          contentType: z.string(),
          contentId: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await trackKidsProgress(ctx.user.id, input.contentType, input.contentId);
      }),

    getMyProgress: protectedProcedure.query(async ({ ctx }) => {
      return await getUserKidsProgress(ctx.user.id);
    }),
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

  merch: router({
    createRequest: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1, "Title is required"),
          description: z.string().min(1, "Description is required"),
          referenceImages: z.array(z.string()).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { createMerchRequest } = await import("./db");
        return await createMerchRequest(ctx.user.id, input.title, input.description, input.referenceImages);
      }),

    getMyRequests: protectedProcedure.query(async ({ ctx }) => {
      const { getUserMerchRequests } = await import("./db");
      return await getUserMerchRequests(ctx.user.id);
    }),

    getMyOrders: protectedProcedure.query(async ({ ctx }) => {
      const { getUserMerchOrders } = await import("./db");
      return await getUserMerchOrders(ctx.user.id);
    }),
  }),

  admin: router({
    getMerchRequests: protectedProcedure
      .input(z.object({ status: z.enum(["pending", "approved", "in_progress", "completed", "rejected"]).optional() }))
      .query(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        const { getAllMerchRequests } = await import("./db");
        return await getAllMerchRequests(input.status);
      }),

    approveMerchRequest: protectedProcedure
      .input(z.object({ requestId: z.number(), estimatedPrice: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        const { updateMerchRequestStatus } = await import("./db");
        return await updateMerchRequestStatus(input.requestId, "approved", input.estimatedPrice);
      }),

    rejectMerchRequest: protectedProcedure
      .input(z.object({ requestId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        const { updateMerchRequestStatus } = await import("./db");
        return await updateMerchRequestStatus(input.requestId, "rejected");
      }),

    getAnalytics: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const { getAdminAnalytics } = await import("./db");
      return await getAdminAnalytics();
    }),
  }),
});

export type AppRouter = typeof appRouter;
