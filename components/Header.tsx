import Image from "next/image";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function Header() {
  noStore();
  const session = await auth();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-slate-800">
          🔧 AQI Tools
        </Link>
        <div className="flex items-center gap-3">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name ?? "User"}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : null}
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <Button variant="ghost" size="sm" type="submit" className="text-xs text-slate-500">
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
