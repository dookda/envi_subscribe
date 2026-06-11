import { Suspense } from "react";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import EquipmentCard from "@/components/EquipmentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/db/prisma";
import { filterSchema } from "@/lib/validation/schemas";

export const dynamic = "force-dynamic";

function getString(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

async function EquipmentList({
  userId,
  search,
  serviceDate,
  sortBy,
  sortDir,
}: {
  userId: string;
  search?: string;
  serviceDate?: string;
  sortBy: "serviceDate" | "equipmentName" | "createdAt";
  sortDir: "asc" | "desc";
}) {
  const where: Prisma.EquipmentItemWhereInput = {
    userId,
    isArchived: false,
  };

  if (search) {
    where.OR = [
      { equipmentName: { contains: search, mode: "insensitive" } },
      { model: { contains: search, mode: "insensitive" } },
      { customerName: { contains: search, mode: "insensitive" } },
    ];
  }

  if (serviceDate) {
    where.serviceRecords = {
      some: {
        serviceDate: new Date(`${serviceDate}T00:00:00.000Z`),
      },
    };
  }

  const orderBy: Prisma.EquipmentItemOrderByWithRelationInput =
    sortBy === "equipmentName" ? { equipmentName: sortDir } : { createdAt: sortDir };

  const items = await prisma.equipmentItem.findMany({
    where,
    orderBy,
    include: {
      serviceRecords: {
        orderBy: { serviceDate: "desc" },
        take: 1,
      },
    },
  });

  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-slate-400">No equipment found.</p>
        <Link href="/equipment/new">
          <Button className="mt-4 rounded-xl" size="sm">
            Add your first equipment
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <EquipmentCard key={item.id} item={item} latestService={item.serviceRecords[0]} />
      ))}
    </div>
  );
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  noStore();
  const [session, rawParams] = await Promise.all([auth(), searchParams]);
  const parsed = filterSchema.safeParse({
    search: getString(rawParams.search),
    serviceDate: getString(rawParams.serviceDate),
    sortBy: getString(rawParams.sortBy),
    sortDir: getString(rawParams.sortDir),
  });
  const filters = parsed.success ? parsed.data : filterSchema.parse({});

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Equipment</h1>
        <Link href="/equipment/new">
          <Button className="rounded-xl text-sm" size="sm">
            + Add
          </Button>
        </Link>
      </div>

      <form className="space-y-2">
        <Input
          name="search"
          placeholder="Search name, model, customer..."
          defaultValue={filters.search}
          className="rounded-xl border-slate-200 bg-white"
        />
        <div className="flex gap-2">
          <Input
            name="serviceDate"
            type="date"
            defaultValue={filters.serviceDate}
            className="flex-1 rounded-xl border-slate-200 bg-white"
          />
          <Button type="submit" variant="outline" className="rounded-xl border-slate-200" size="sm">
            Filter
          </Button>
          <Link href="/">
            <Button variant="ghost" className="rounded-xl text-slate-400" size="sm">
              Clear
            </Button>
          </Link>
        </div>
      </form>

      <Suspense fallback={<div className="py-8 text-center text-sm text-slate-400">Loading...</div>}>
        <EquipmentList
          userId={session!.user.id}
          search={filters.search}
          serviceDate={filters.serviceDate}
          sortBy={filters.sortBy}
          sortDir={filters.sortDir}
        />
      </Suspense>
    </div>
  );
}
