import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import AddServiceRecordForm from "@/components/AddServiceRecordForm";
import DeleteEquipmentButton from "@/components/DeleteEquipmentButton";
import EquipmentForm from "@/components/EquipmentForm";
import ServiceRecordList from "@/components/ServiceRecordList";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db/prisma";

export default async function EquipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  noStore();
  const [{ id }, session] = await Promise.all([params, auth()]);
  const userId = session!.user.id;

  const equipment = await prisma.equipmentItem.findFirst({
    where: { id, userId, isArchived: false },
    include: {
      serviceRecords: {
        orderBy: { serviceDate: "desc" },
      },
    },
  });

  if (!equipment) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/">
          <Button variant="ghost" size="sm" className="rounded-xl text-slate-500">
            ← Back
          </Button>
        </Link>
        <h1 className="truncate text-xl font-bold text-slate-800">{equipment.equipmentName}</h1>
      </div>

      <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6">
        <h2 className="font-semibold text-slate-700">Equipment Details</h2>
        <EquipmentForm equipment={equipment} />
        <div className="border-t border-slate-100 pt-2">
          <DeleteEquipmentButton id={equipment.id} />
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6">
        <h2 className="font-semibold text-slate-700">Service Records</h2>
        <AddServiceRecordForm equipmentId={equipment.id} />
        <ServiceRecordList records={equipment.serviceRecords} />
      </div>
    </div>
  );
}
