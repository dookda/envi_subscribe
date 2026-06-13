// next.config.ts basePath:"/store" — Next.js adds /store automatically for:
//   <Link href>, router.push, redirect() from next/navigation, signOut/signIn redirectTo
// Use plain paths (no /store prefix) for those.
//
// Use full paths WITH /store for:
//   NextResponse.redirect() in proxy.ts, Auth.js pages.signIn (direct HTTP redirects)
export const BASE_PATH = "";
export const LOGIN_PATH = "/store/login"; // for proxy.ts NextResponse.redirect + Auth.js pages.signIn
export const AUTH_BASE_PATH = "/api/auth";
