import Link from "next/link";
import type { EquipmentItem, ServiceRecord } from "@prisma/client";
import { format } from "date-fns";

interface Props {
  item: EquipmentItem;
  latestService?: ServiceRecord | null;
}

const statusColors: Record<string, string> = {
  SCHEDULED: "border-blue-100 bg-blue-50 text-blue-700",
  COMPLETED: "border-green-100 bg-green-50 text-green-700",
  CANCELLED: "border-red-100 bg-red-50 text-red-700",
};

export default function EquipmentCard({ item, latestService }: Props) {
  return (
    <Link href={`/equipment/${item.id}`}>
      <div className="rounded-2xl border border-slate-100 bg-white p-4 transition-shadow hover:shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-800">{item.equipmentName}</p>
            <p className="mt-0.5 text-xs text-slate-400">{item.model}</p>
          </div>
          {latestService ? (
            <span
              className={`shrink-0 rounded-full border px-2 py-0.5 text-xs ${statusColors[latestService.status]}`}
            >
              {latestService.status}
            </span>
          ) : null}
        </div>
        <div className="mt-3 space-y-1">
          <p className="text-xs text-slate-500">👤 {item.customerName}</p>
          <p className="text-xs text-slate-500">📍 {item.location}</p>
          {latestService ? (
            <p className="text-xs text-slate-400">
              🗓 {format(new Date(latestService.serviceDate), "MMM d, yyyy")}
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
