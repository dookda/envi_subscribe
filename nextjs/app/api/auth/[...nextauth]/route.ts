import { handlers } from "@/auth";
import { type NextRequest } from "next/server";

// Next.js strips basePath (/store) before routing. Auth.js never sees /store,
// so it can't include /store in generated callback URLs.
// We restore /store in the pathname so Auth.js sees the full path.
function restoreBasePath(req: NextRequest): Request {
  const url = new URL(req.url);
  url.pathname = `/store${url.pathname}`;
  return new Request(url.toString(), req);
}

export async function GET(req: NextRequest) {
  return handlers.GET(restoreBasePath(req) as NextRequest);
}

export async function POST(req: NextRequest) {
  return handlers.POST(restoreBasePath(req) as NextRequest);
}
