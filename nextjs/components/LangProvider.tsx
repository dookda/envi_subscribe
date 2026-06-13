"use client";

import { createContext, useContext, useState } from "react";
import { getT, type Lang, type TKeys } from "@/lib/i18n";

interface LangContextValue {
  lang: Lang;
  t: Record<TKeys, string>;
  setLang: (l: Lang) => void;
}

const LangContext = createContext<LangContextValue>({
  lang: "th",
  t: getT("th"),
  setLang: () => {},
});

export function LangProvider({ initial, children }: { initial: Lang; children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initial);

  const setLang = (l: Lang) => {
    setLangState(l);
    document.cookie = `lang=${l};path=/;max-age=31536000`;
  };

  return (
    <LangContext.Provider value={{ lang, t: getT(lang), setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
