import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { getOrCreateUserProfile, getDecorationPackages, updateUserProfile, getCoinBalance, addCoinTransaction, getCoinTransactionHistory } from "./db";
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
});

export type AppRouter = typeof appRouter;
