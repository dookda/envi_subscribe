import Header from "@/components/Header";

export const dynamic = "force-dynamic";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />
      <main className="mx-auto max-w-5xl px-4 pb-6 pt-20">{children}</main>
    </div>
  );
}
