"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { archiveEquipment } from "@/lib/db/actions";
import { Button } from "@/components/ui/button";

export default function DeleteEquipmentButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Archive this equipment? The record will be hidden from the active list but its history will stay available.",
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);
    await archiveEquipment(id);
    setLoading(false);
    router.push("/");
    router.refresh();
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full rounded-xl border-red-100 text-red-500 hover:bg-red-50"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? "Archiving..." : "Archive Equipment"}
    </Button>
  );
}
