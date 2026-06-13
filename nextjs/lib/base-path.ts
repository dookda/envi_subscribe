// BASE_PATH is empty because next.config.ts basePath:"/store" handles the prefix
// for <Link> and router.push automatically.
export const BASE_PATH = "";
// Full paths used for middleware redirects and NextAuth config (basePath not applied there)
export const LOGIN_PATH = "/store/login";
export const AUTH_BASE_PATH = "/api/auth";
