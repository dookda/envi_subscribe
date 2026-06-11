import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { format, parseISO } from "date-fns";
import { auth } from "@/auth";
import AddServiceFromEquipment from "@/components/AddServiceFromEquipment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

function getDateString(value: string | string[] | undefined) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : undefined;
}

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  noStore();
  const [session, rawParams] = await Promise.all([auth(), searchParams]);
  const userId = session!.user.id;
  const today = new Date().toISOString().split("T")[0];
  const selectedDate = getDateString(rawParams.date) ?? today;

  const [records, allEquipment] = await Promise.all([
    prisma.serviceRecord.findMany({
      where: {
        userId,
        serviceDate: new Date(`${selectedDate}T00:00:00.000Z`),
      },
      include: {
        equipment: true,
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.equipmentItem.findMany({
      where: { userId, isArchived: false },
      orderBy: { equipmentName: "asc" },
      select: { id: true, equipmentName: true, model: true, customerName: true },
    }),
  ]);

  const scheduledIds = new Set(records.map((record) => record.equipmentId));
  const availableEquipment = allEquipment.filter((equipment) => !scheduledIds.has(equipment.id));

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-800">Service Date</h1>

      <form className="flex gap-2">
        <Input
          name="date"
          type="date"
          defaultValue={selectedDate}
          className="flex-1 rounded-xl border-slate-200 bg-white"
        />
        <Button type="submit" className="rounded-xl" size="sm">
          View
        </Button>
      </form>

      <div>
        <p className="mb-3 text-sm font-medium text-slate-500">
          {format(parseISO(selectedDate), "EEEE, MMMM d, yyyy")}
        </p>

        {records.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center">
            <p className="text-sm text-slate-400">No services scheduled for this date.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {records.map((record) => (
              <div key={record.id} className="rounded-2xl border border-slate-100 bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link href={`/equipment/${record.equipmentId}`} className="text-sm font-semibold text-slate-800 hover:underline">
                      {record.equipment.equipmentName}
                    </Link>
                    <p className="text-xs text-slate-400">
                      {record.equipment.model} · {record.equipment.customerName}
                    </p>
                    <p className="text-xs text-slate-400">📍 {record.equipment.location}</p>
                    {record.notes ? <p className="mt-1 text-xs text-slate-500">{record.notes}</p> : null}
                  </div>
                  <span
                    className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-xs ${record.status === "COMPLETED"
                        ? "bg-green-50 text-green-700"
                        : record.status === "CANCELLED"
                          ? "bg-red-50 text-red-700"
                          : "bg-blue-50 text-blue-700"
                      }`}
                  >
                    {record.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-slate-700">Add Service for This Date</p>
        <div className="space-y-2">
          {availableEquipment.map((equipment) => (
            <AddServiceFromEquipment key={equipment.id} equipment={equipment} serviceDate={selectedDate} />
          ))}
          {availableEquipment.length === 0 ? (
            <p className="py-2 text-center text-xs text-slate-400">
              All equipment is already scheduled for this date.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
