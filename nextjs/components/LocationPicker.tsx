"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useLang } from "@/components/LangProvider";

const MapPickerInner = dynamic(() => import("./MapPickerInner"), { ssr: false });

interface Props {
  initialLat?: number | null;
  initialLng?: number | null;
}

export default function LocationPicker({ initialLat, initialLng }: Props) {
  const { t } = useLang();
  const [open, setOpen] = useState(initialLat != null);
  const [lat, setLat] = useState<number | undefined>(initialLat ?? undefined);
  const [lng, setLng] = useState<number | undefined>(initialLng ?? undefined);

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
      >
        <span className="material-icons select-none text-[16px] leading-none align-middle">location_on</span>
        {" "}{open ? t.hideMap : t.pickMap}
      </button>

      {open && (
        <div className="space-y-2">
          <MapPickerInner
            initialLat={lat}
            initialLng={lng}
            onSelect={(la, ln) => { setLat(la); setLng(ln); }}
          />
          {lat != null && lng != null ? (
            <p className="text-xs text-slate-400 dark:text-slate-500">{lat.toFixed(6)}, {lng.toFixed(6)}</p>
          ) : (
            <p className="text-xs text-slate-400 dark:text-slate-500">{t.clickMap}</p>
          )}
        </div>
      )}

      <input type="hidden" name="latitude" value={lat ?? ""} />
      <input type="hidden" name="longitude" value={lng ?? ""} />
    </div>
  );
}
