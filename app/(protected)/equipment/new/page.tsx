import Link from "next/link";
import EquipmentForm from "@/components/EquipmentForm";
import { Button } from "@/components/ui/button";

export default function NewEquipmentPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/">
          <Button variant="ghost" size="sm" className="rounded-xl text-slate-500">
            ← Back
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-slate-800">Add Equipment</h1>
      </div>
      <div className="rounded-2xl border border-slate-100 bg-white p-6">
        <EquipmentForm />
      </div>
    </div>
  );
}
