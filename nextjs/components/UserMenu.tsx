"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface Props {
  image?: string | null;
  name?: string | null;
  signOutLabel: string;
  signOutAction: () => Promise<void>;
}

export default function UserMenu({ image, name, signOutLabel, signOutAction }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 overflow-hidden rounded-full border-2 border-slate-200 focus:outline-none dark:border-slate-600"
        aria-label="User menu"
      >
        {image ? (
          <Image src={image} alt={name ?? "User"} width={32} height={32} className="h-full w-full object-cover" />
        ) : (
          <span className="material-icons flex h-full w-full items-center justify-center bg-slate-100 text-[20px] leading-none text-slate-400 dark:bg-slate-700">
            person
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 min-w-[160px] rounded-xl border border-slate-100 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
          {name ? (
            <p className="truncate border-b border-slate-100 px-4 py-2 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
              {name}
            </p>
          ) : null}
          <form action={signOutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
            >
              <span className="material-icons select-none text-[16px] leading-none">logout</span>
              {signOutLabel}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
