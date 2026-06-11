import type { NextAuthConfig } from "next-auth";
import LineProvider from "next-auth/providers/line";

const authConfig = {
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID!,
      clientSecret: process.env.LINE_CLIENT_SECRET!,
      profile(profile) {
        return {
          lineUserId: profile.userId,
          name: profile.displayName,
          email: null,
          image: profile.pictureUrl ?? null,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;

export default authConfig;
