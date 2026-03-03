import { prisma } from "@repo/db";
import type { Session } from "@repo/auth";

export interface TRPCContext {
  prisma: typeof prisma;
  session: Session | null;
}

export async function createTRPCContext(opts: {
  session: Session | null;
}): Promise<TRPCContext> {
  return {
    prisma,
    session: opts.session,
  };
}
