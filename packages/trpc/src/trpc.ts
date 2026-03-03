import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TRPCContext } from "./context";

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user?.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  const userId: string = ctx.session.user.id;
  return next({
    ctx: {
      ...ctx,
      session: {
        ...ctx.session,
        user: { ...ctx.session.user, id: userId },
      } as typeof ctx.session & { user: { id: string } },
    },
  });
});
