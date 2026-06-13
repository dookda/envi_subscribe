import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { AdapterUser } from "@auth/core/adapters";
import authConfig from "@/auth.config";
import { prisma } from "@/lib/db/prisma";

const baseAdapter = PrismaAdapter(prisma);

const adapter = {
  ...baseAdapter,

  // Handles users seeded directly in the User table with no Account row.
  // On first login: finds the user by lineUserId, self-heals by creating the
  // Account row, then returns the user (preventing createUser from being called).
  async getUserByAccount(providerAccount: { provider: string; providerAccountId: string }) {
    try {
      const found = await baseAdapter.getUserByAccount!(providerAccount);
      if (found) return found;
    } catch {
      // fall through to lineUserId lookup
    }

    if (providerAccount.provider === "line") {
      const user = await prisma.user.findUnique({
        where: { lineUserId: providerAccount.providerAccountId },
      });
      if (user) {
        // Self-heal: create the missing Account row so future logins use the fast path.
        try {
          await prisma.account.create({
            data: {
              userId: user.id,
              type: "oauth",
              provider: providerAccount.provider,
              providerAccountId: providerAccount.providerAccountId,
            },
          });
        } catch {
          // Account may already exist (race) — that's fine
        }
        return user as AdapterUser;
      }
    }
    return null;
  },

  // Last-resort guard: if getUserByAccount somehow returns null and Auth.js tries
  // to createUser with an existing lineUserId, return the existing user instead.
  // Auth.js then calls linkAccount which creates the Account row automatically.
  async createUser(data: AdapterUser & Record<string, unknown>) {
    if (data.lineUserId) {
      try {
        const existing = await prisma.user.findUnique({
          where: { lineUserId: String(data.lineUserId) },
        });
        if (existing) return existing as AdapterUser;
      } catch {
        // fall through to normal creation
      }
    }
    return baseAdapter.createUser!(data);
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter,
  basePath: "/store/api/auth",
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "line" && user.id && profile && "sub" in profile && profile.sub) {
        await prisma.user.updateMany({
          where: { id: user.id, lineUserId: null },
          data: {
            lineUserId: String(profile.sub),
            ...("name" in profile && profile.name ? { name: String(profile.name) } : {}),
            ...("picture" in profile && profile.picture ? { image: String(profile.picture) } : {}),
          },
        });
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
