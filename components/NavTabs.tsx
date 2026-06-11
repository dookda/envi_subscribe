"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Equipment", match: (pathname: string) => pathname === "/" || pathname.startsWith("/equipment") },
  { href: "/services", label: "Services", match: (pathname: string) => pathname.startsWith("/services") },
];

export default function NavTabs() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-slate-100 bg-white">
      <div className="mx-auto flex max-w-2xl gap-1 px-4">
        {tabs.map((tab) => {
          const active = tab.match(pathname);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                active
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700",
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
