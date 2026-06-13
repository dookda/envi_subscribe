import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import "../globals.css";
import { LangProvider } from "@/components/LangProvider";
import type { Lang } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "ENVIR Store",
  description: "Equipment service records management",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function SubscribeLayout({ children }: { children: React.ReactNode }) {
  const lang = ((await cookies()).get("lang")?.value ?? "th") as Lang;

  return (
    <LangProvider initial={lang}>
      <div className="min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-slate-900 dark:text-slate-100">
        {children}
      </div>
    </LangProvider>
  );
}
