"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { equipmentSchema, serviceRecordSchema } from "@/lib/schemas";

async function getSession() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return session;
}

function normalizeNotes(value: string | undefined) {
  return value?.trim() ? value.trim() : undefined;
}

export async function createEquipment(formData: FormData) {
  const session = await getSession();
  const raw = {
    equipmentName: formData.get("equipmentName"),
    model: formData.get("model"),
    customerName: formData.get("customerName"),
    location: formData.get("location"),
  };
  const result = equipmentSchema.safeParse(raw);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  await prisma.equipmentItem.create({
    data: { ...result.data, userId: session.user.id },
  });

  revalidatePath("/");
  revalidatePath("/services");
  return { success: true };
}

export async function updateEquipment(id: string, formData: FormData) {
  const session = await getSession();
  const raw = {
    equipmentName: formData.get("equipmentName"),
    model: formData.get("model"),
    customerName: formData.get("customerName"),
    location: formData.get("location"),
  };
  const result = equipmentSchema.safeParse(raw);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  const item = await prisma.equipmentItem.findFirst({
    where: { id, userId: session.user.id, isArchived: false },
  });

  if (!item) {
    return { error: { _form: ["Equipment not found"] } };
  }

  await prisma.equipmentItem.update({
    where: { id },
    data: result.data,
  });

  revalidatePath("/");
  revalidatePath(`/equipment/${id}`);
  revalidatePath("/services");
  return { success: true };
}

export async function archiveEquipment(id: string) {
  const session = await getSession();
  const item = await prisma.equipmentItem.findFirst({
    where: { id, userId: session.user.id, isArchived: false },
  });

  if (!item) {
    return { error: { _form: ["Equipment not found"] } };
  }

  await prisma.equipmentItem.update({
    where: { id },
    data: { isArchived: true, archivedAt: new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate())) },
  });

  revalidatePath("/");
  revalidatePath("/services");
  return { success: true };
}

export async function createServiceRecord(data: {
  equipmentId: string;
  serviceDate: string;
  status?: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  notes?: string;
}) {
  const session = await getSession();
  const result = serviceRecordSchema.safeParse({
    ...data,
    notes: normalizeNotes(data.notes),
  });

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  const item = await prisma.equipmentItem.findFirst({
    where: { id: result.data.equipmentId, userId: session.user.id, isArchived: false },
  });

  if (!item) {
    return { error: { _form: ["Equipment not found"] } };
  }

  const serviceDate = new Date(`${result.data.serviceDate}T00:00:00.000Z`);
  const existingRecord = await prisma.serviceRecord.findFirst({
    where: {
      equipmentId: result.data.equipmentId,
      userId: session.user.id,
      serviceDate,
    },
  });

  if (existingRecord) {
    return { error: { _form: ["A service record already exists for this date"] } };
  }

  await prisma.serviceRecord.create({
    data: {
      equipmentId: result.data.equipmentId,
      userId: session.user.id,
      serviceDate,
      status: result.data.status,
      notes: result.data.notes,
    },
  });

  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath(`/equipment/${result.data.equipmentId}`);
  return { success: true };
}

export async function deleteServiceRecord(id: string) {
  const session = await getSession();
  const record = await prisma.serviceRecord.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!record) {
    return { error: { _form: ["Record not found"] } };
  }

  await prisma.serviceRecord.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath(`/equipment/${record.equipmentId}`);
  return { success: true };
}

const updateServiceRecordSchema = z.object({
  status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED"]).optional(),
  notes: z.string().trim().max(1000).optional(),
});

export async function updateServiceRecord(
  id: string,
  data: {
    status?: "SCHEDULED" | "COMPLETED" | "CANCELLED";
    notes?: string;
  },
) {
  const session = await getSession();
  const result = updateServiceRecordSchema.safeParse({
    ...data,
    notes: normalizeNotes(data.notes),
  });

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  const record = await prisma.serviceRecord.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!record) {
    return { error: { _form: ["Record not found"] } };
  }

  await prisma.serviceRecord.update({
    where: { id },
    data: result.data,
  });

  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath(`/equipment/${record.equipmentId}`);
  return { success: true };
}
