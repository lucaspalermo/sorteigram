import { NextResponse } from "next/server";
import { prisma } from "@repo/db";
import { cookies } from "next/headers";
import { encode } from "next-auth/jwt";

export async function POST(req: Request) {
  try {
    const { accessToken, userID } = await req.json();

    if (!accessToken || !userID) {
      return NextResponse.json(
        { error: "Missing accessToken or userID" },
        { status: 400 }
      );
    }

    // Verify token with Facebook
    const fbRes = await fetch(
      `https://graph.facebook.com/v19.0/me?fields=id,name,email,picture.type(large)&access_token=${accessToken}`
    );
    const fbUser = await fbRes.json();

    if (fbUser.error) {
      return NextResponse.json(
        { error: "Invalid Facebook token" },
        { status: 401 }
      );
    }

    // Find or create user
    let account = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: "facebook",
          providerAccountId: fbUser.id,
        },
      },
      include: { user: true },
    });

    let user;

    if (account) {
      // Update access token
      await prisma.account.update({
        where: { id: account.id },
        data: { access_token: accessToken },
      });
      user = account.user;
    } else {
      // Create new user + account
      user = await prisma.user.create({
        data: {
          name: fbUser.name,
          email: fbUser.email,
          image: fbUser.picture?.data?.url,
          accounts: {
            create: {
              type: "oauth",
              provider: "facebook",
              providerAccountId: fbUser.id,
              access_token: accessToken,
            },
          },
        },
      });
    }

    // Create NextAuth session
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        sessionToken: crypto.randomUUID(),
      },
    });

    // Set session cookie (NextAuth format)
    const cookieStore = await cookies();
    const useSecure = process.env.NODE_ENV === "production";
    const cookieName = useSecure
      ? "__Secure-authjs.session-token"
      : "authjs.session-token";

    cookieStore.set(cookieName, session.sessionToken, {
      expires: session.expires,
      httpOnly: true,
      secure: useSecure,
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({ success: true, user: { id: user.id, name: user.name } });
  } catch (error) {
    console.error("[facebook-login] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
