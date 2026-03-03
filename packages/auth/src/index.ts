import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Facebook from "next-auth/providers/facebook";
import { prisma } from "@repo/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            "instagram_basic,pages_show_list,pages_read_engagement,instagram_manage_comments",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // Buscar token Instagram da conta vinculada
        const account = await prisma.account.findFirst({
          where: { userId: user.id, provider: "facebook" },
          select: { access_token: true, igUserId: true, igUsername: true },
        });
        if (account) {
          (session as any).instagramAccessToken = account.access_token;
          (session as any).igUserId = account.igUserId;
          (session as any).igUsername = account.igUsername;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});

export type { Session } from "next-auth";
