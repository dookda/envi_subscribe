import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { unstable_noStore as noStore } from "next/cache";
import { auth, signOut } from "@/auth";
import { LOGIN_PATH } from "@/lib/base-path";
import { getT, type Lang } from "@/lib/i18n";
import ThemeToggle from "@/components/ThemeToggle";
import LangToggle from "@/components/LangToggle";
import UserMenu from "@/components/UserMenu";
import logo from "@/app/logo.png";

export default async function Header() {
  noStore();
  const [session, jar] = await Promise.all([auth(), cookies()]);
  const lang = (jar.get("lang")?.value ?? "th") as Lang;
  const t = getT(lang);

  const signOutAction = async () => {
    "use server";
    await signOut({ redirectTo: LOGIN_PATH });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-10 border-b border-slate-100 bg-white/95 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-100"
        >
          <Image src={logo} alt="ENVIR Store logo" width={32} height={32} priority className="rounded-full" />
          <span>{t.appName}</span>
        </Link>

        <div className="flex items-center gap-2">
          <LangToggle />
          <ThemeToggle />
          <UserMenu
            image={session?.user?.image}
            name={session?.user?.name}
            signOutLabel={t.signOut}
            signOutAction={signOutAction}
          />
        </div>
      </div>
    </header>
  );
}
