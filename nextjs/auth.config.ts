import type { NextAuthConfig } from "next-auth";
import LineProvider from "next-auth/providers/line";
import { LOGIN_PATH } from "@/lib/base-path";

const authConfig = {
  trustHost: true,
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID!,
      clientSecret: process.env.LINE_CLIENT_SECRET!,
      profile(profile) {
        return {
          lineUserId: profile.sub ?? null,
          name: profile.name ?? null,
          email: null,
          image: profile.picture ?? null,
        };
      },
    }),
  ],
  pages: {
    signIn: LOGIN_PATH,
  },
} satisfies NextAuthConfig;

export default authConfig;
