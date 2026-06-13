import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = Boolean(req.auth);
  const { pathname } = req.nextUrl; // basePath is stripped — /store/login appears as /login

  const isLoginPage = pathname === "/login";

  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL("/store/login", req.nextUrl.origin));
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/store", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [`/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)`],
};
