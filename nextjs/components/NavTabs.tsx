"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BASE_PATH } from "@/lib/base-path";

const tabs = [
  {
    href: BASE_PATH,
    label: "Equipment",
    match: (pathname: string) => pathname === BASE_PATH || pathname.startsWith(`${BASE_PATH}/equipment`),
  },
];

export default function NavTabs() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-slate-100 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto flex max-w-5xl gap-1 px-4">
        {tabs.map((tab) => {
          const active = tab.match(pathname);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                active
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
