"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createServiceRecord } from "@/lib/db/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddServiceRecordForm({ equipmentId }: { equipmentId: string }) {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!date) {
      setError("Service date is required");
      return;
    }

    setLoading(true);
    setError("");
    const result = await createServiceRecord({
      equipmentId,
      serviceDate: date,
      notes: notes || undefined,
    });
    setLoading(false);

    if (result.error) {
      const formError =
        typeof result.error === "object" && result.error !== null && "_form" in result.error
          ? result.error._form?.[0]
          : undefined;
      setError(formError ?? "Failed to add service record");
      return;
    }

    setDate("");
    setNotes("");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2 max-sm:flex-col">
        <div className="flex-1">
          <Label className="mb-1 block text-xs text-slate-500">Service Date</Label>
          <Input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="rounded-xl border-slate-200 text-sm"
          />
        </div>
        <div className="flex-1">
          <Label className="mb-1 block text-xs text-slate-500">Notes (optional)</Label>
          <Input
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Service notes..."
            className="rounded-xl border-slate-200 text-sm"
          />
        </div>
      </div>
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
      <Button type="submit" size="sm" className="w-full rounded-xl" disabled={loading}>
        {loading ? "Adding..." : "+ Add Service Record"}
      </Button>
    </form>
  );
}
