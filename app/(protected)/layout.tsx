import Header from "@/components/Header";
import NavTabs from "@/components/NavTabs";

export const dynamic = "force-dynamic";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <NavTabs />
      <main className="mx-auto max-w-2xl px-4 py-6">{children}</main>
    </div>
  );
}
