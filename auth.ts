import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "@/auth.config";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  ...authConfig,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (
        account?.provider === "line" &&
        user.id &&
        profile &&
        typeof profile === "object" &&
        "userId" in profile &&
        typeof profile.userId === "string"
      ) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            lineUserId: profile.userId,
            name: user.name ?? undefined,
            image: user.image ?? undefined,
          },
        });
      }

      return true;
    },
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});
