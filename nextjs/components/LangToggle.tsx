"use client";

import { useRouter } from "next/navigation";
import { useLang } from "@/components/LangProvider";

export default function LangToggle() {
  const { lang, setLang } = useLang();
  const router = useRouter();

  const toggle = () => {
    setLang(lang === "th" ? "en" : "th");
    router.refresh();
  };

  return (
    <button
      onClick={toggle}
      className="flex h-8 items-center rounded-full border border-slate-200 px-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
    >
      {lang === "th" ? "EN" : "TH"}
    </button>
  );
}
