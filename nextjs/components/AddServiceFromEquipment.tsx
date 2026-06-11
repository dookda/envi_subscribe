"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createServiceRecord } from "@/lib/db/actions";
import { Button } from "@/components/ui/button";

interface Props {
  equipment: { id: string; equipmentName: string; model: string; customerName: string };
  serviceDate: string;
}

export default function AddServiceFromEquipment({ equipment, serviceDate }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    await createServiceRecord({ equipmentId: equipment.id, serviceDate });
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-700">{equipment.equipmentName}</p>
        <p className="text-xs text-slate-400">
          {equipment.model} · {equipment.customerName}
        </p>
      </div>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="ml-2 shrink-0 rounded-xl text-xs"
        onClick={handleAdd}
        disabled={loading}
      >
        {loading ? "..." : "+ Schedule"}
      </Button>
    </div>
  );
}
