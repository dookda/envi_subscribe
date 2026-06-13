import Link from "next/link";
import Image from "next/image";
import type { EquipmentItem } from "@prisma/client";

interface Props {
  item: EquipmentItem;
}

function RemainDays({ expiredAt }: { expiredAt: Date }) {
  const days = Math.ceil((expiredAt.getTime() - Date.now()) / 86_400_000);
  const icon = <span className="material-icons select-none text-[14px] leading-none">schedule</span>;
  if (days > 30) return <p className="flex items-center gap-1 text-xs text-green-600">{icon} เหลืออีก {days} วัน</p>;
  if (days > 0) return <p className="flex items-center gap-1 text-xs text-amber-500">{icon} เหลืออีก {days} วัน</p>;
  if (days === 0) return <p className="flex items-center gap-1 text-xs text-red-500">{icon} วันนี้</p>;
  return <p className="flex items-center gap-1 text-xs text-red-500">{icon} เกินกำหนด {Math.abs(days)} วัน</p>;
}

export default function EquipmentCard({ item }: Props) {
  return (
    <Link href={`/equipment/${item.id}`}>
      <div className="relative rounded-2xl border border-slate-100 bg-white transition-shadow hover:shadow-sm overflow-hidden dark:border-slate-700 dark:bg-slate-800">

        {item.inUse ? (
          <span className="absolute right-2 top-2 z-10 flex items-center justify-center rounded-full bg-green-500 text-white shadow" style={{ width: 20, height: 20 }}>
            <span className="material-icons select-none leading-none" style={{ fontSize: 14 }}>check</span>
          </span>
        ) : null}

        {item.image ? (
          <div className="relative aspect-video w-full bg-slate-100">
            <Image src={item.image} alt={item.equipmentName} fill className="object-contain" sizes="(max-width: 640px) 50vw, 33vw" />
          </div>
        ) : null}
        <div className="p-4">
          <p className="truncate font-semibold text-slate-800 dark:text-slate-100">{item.equipmentName}</p>
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{item.model}</p>
          <div className="mt-3 space-y-1">
            <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="material-icons select-none text-[14px] leading-none">person</span>
              {item.customerName}
            </p>
            <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="material-icons select-none text-[14px] leading-none">location_on</span>
              {item.latitude != null && item.longitude != null
                ? `${item.latitude.toFixed(5)}, ${item.longitude.toFixed(5)}`
                : item.location}
            </p>
            {item.inUse && item.expiredAt ? <RemainDays expiredAt={item.expiredAt} /> : null}
          </div>
        </div>
      </div>
    </Link>
  );
}
