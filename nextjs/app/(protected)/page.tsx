import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { cookies } from "next/headers";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { LOGIN_PATH } from "@/lib/base-path";
import EquipmentCard from "@/components/EquipmentCard";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db/prisma";
import { filterSchema } from "@/lib/validation/schemas";
import { getT, type Lang } from "@/lib/i18n";
import SearchInput from "@/components/SearchInput";

export const dynamic = "force-dynamic";

function getString(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

async function EquipmentList({
  userId,
  search,
  sortBy,
  sortDir,
  t,
}: {
  userId: string;
  search?: string;
  sortBy: "equipmentName" | "createdAt";
  sortDir: "asc" | "desc";
  t: ReturnType<typeof getT>;
}) {
  const where: Prisma.EquipmentItemWhereInput = { userId, isArchived: false };

  if (search) {
    where.OR = [
      { equipmentName: { contains: search, mode: "insensitive" } },
      { model: { contains: search, mode: "insensitive" } },
      { customerName: { contains: search, mode: "insensitive" } },
    ];
  }

  const orderBy: Prisma.EquipmentItemOrderByWithRelationInput =
    sortBy === "equipmentName" ? { equipmentName: sortDir } : { createdAt: sortDir };

  const items = await prisma.equipmentItem.findMany({ where, orderBy });

  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-slate-400">{t.noEquipment}</p>
        <Link href={`/equipment/new`}>
          <Button className="mt-4 rounded-xl" size="sm">
            {t.addFirst}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <EquipmentCard key={item.id} item={item} />
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
  const [session, rawParams, jar] = await Promise.all([auth(), searchParams, cookies()]);
  if (!session?.user?.id) redirect(LOGIN_PATH);

  const lang = (jar.get("lang")?.value ?? "th") as Lang;
  const t = getT(lang);

  const parsed = filterSchema.safeParse({
    search: getString(rawParams.search),
    sortBy: getString(rawParams.sortBy),
    sortDir: getString(rawParams.sortDir),
  });
  const filters = parsed.success ? parsed.data : filterSchema.parse({});

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t.equipment}</h1>
        <Link href={`/equipment/new`}>
          <Button className="flex items-center gap-1 rounded-xl text-sm" size="sm">
            <span className="material-icons select-none text-[16px] leading-none">add</span>
            {t.register}
          </Button>
        </Link>
      </div>

      <div className="flex gap-2">
        <Suspense fallback={null}>
          <SearchInput defaultValue={filters.search} />
        </Suspense>
        <Link href="/">
          <Button variant="ghost" className="rounded-xl text-slate-400" size="sm">
            {t.clear}
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div className="py-8 text-center text-sm text-slate-400">{t.loading}</div>}>
        <EquipmentList
          userId={session.user.id}
          search={filters.search}
          sortBy={filters.sortBy}
          sortDir={filters.sortDir}
          t={t}
        />
      </Suspense>
    </div>
  );
}
