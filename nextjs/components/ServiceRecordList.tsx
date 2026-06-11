"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ServiceRecord } from "@prisma/client";
import { format } from "date-fns";
import { deleteServiceRecord, updateServiceRecord } from "@/lib/db/actions";
import { Button } from "@/components/ui/button";

const statusColors: Record<string, string> = {
  SCHEDULED: "bg-blue-50 text-blue-700",
  COMPLETED: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-700",
};

const statuses = ["SCHEDULED", "COMPLETED", "CANCELLED"] as const;

export default function ServiceRecordList({
  records,
}: {
  records: ServiceRecord[];
}) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteServiceRecord(id);
    setDeletingId(null);
    router.refresh();
  };

  const handleStatusChange = async (id: string, status: (typeof statuses)[number]) => {
    setUpdatingId(id);
    await updateServiceRecord(id, { status });
    setUpdatingId(null);
    router.refresh();
  };

  if (records.length === 0) {
    return <p className="py-4 text-center text-sm text-slate-400">No service records yet.</p>;
  }

  return (
    <div className="space-y-2">
      {records.map((record) => (
        <div key={record.id} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-700">
              {format(new Date(record.serviceDate), "MMM d, yyyy")}
            </p>
            {record.notes ? <p className="mt-0.5 text-xs text-slate-400">{record.notes}</p> : null}
            <div className="mt-2 flex flex-wrap gap-1">
              {statuses.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleStatusChange(record.id, status)}
                  disabled={updatingId === record.id}
                  className={`rounded-full px-2 py-0.5 text-xs transition-opacity ${record.status === status
                      ? `${statusColors[status]} font-medium`
                      : "bg-slate-100 text-slate-400 hover:opacity-80"
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="px-2 text-xs text-red-400 hover:text-red-600"
            onClick={() => handleDelete(record.id)}
            disabled={deletingId === record.id}
          >
            {deletingId === record.id ? "..." : "✕"}
          </Button>
        </div>
      ))}
    </div>
  );
}
