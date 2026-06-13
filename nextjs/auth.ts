import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "@/auth.config";
import { prisma } from "@/lib/db/prisma";
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  basePath: "/store/api/auth",
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "line" && user.id && profile && "sub" in profile && profile.sub) {
        // updateMany: silently skips if user doesn't exist or lineUserId already set
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
