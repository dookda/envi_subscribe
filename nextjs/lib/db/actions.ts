"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { equipmentSchema } from "@/lib/validation/schemas";

async function getSession() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");
    return session;
}

async function saveImage(file: File): Promise<string> {
    const ext = path.extname(file.name).toLowerCase() || ".jpg";
    const filename = `${crypto.randomUUID()}${ext}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });
    await fs.writeFile(path.join(uploadsDir, filename), Buffer.from(await file.arrayBuffer()));
    return `/uploads/${filename}`;
}

export async function createEquipment(formData: FormData) {
    const session = await getSession();
    const raw = {
        equipmentName: formData.get("equipmentName"),
        model: formData.get("model"),
        customerName: formData.get("customerName"),
        location: formData.get("location"),
        inUse: formData.get("inUse") || undefined,
        installedAt: formData.get("installedAt") || undefined,
        expiredAt: formData.get("expiredAt") || undefined,
        latitude: formData.get("latitude") || undefined,
        longitude: formData.get("longitude") || undefined,
    };
    const result = equipmentSchema.safeParse(raw);
    if (!result.success) return { error: result.error.flatten().fieldErrors };

    const imageFile = formData.get("image") as File | null;
    const image = imageFile && imageFile.size > 0 ? await saveImage(imageFile) : undefined;

    await prisma.equipmentItem.create({
        data: { ...result.data, userId: session.user.id, ...(image ? { image } : {}) },
    });

    revalidatePath("/");
    return { success: true };
}

export async function updateEquipment(id: string, formData: FormData) {
    const session = await getSession();
    const raw = {
        equipmentName: formData.get("equipmentName"),
        model: formData.get("model"),
        customerName: formData.get("customerName"),
        location: formData.get("location"),
        inUse: formData.get("inUse") || undefined,
        installedAt: formData.get("installedAt") || undefined,
        expiredAt: formData.get("expiredAt") || undefined,
        latitude: formData.get("latitude") || undefined,
        longitude: formData.get("longitude") || undefined,
    };
    const result = equipmentSchema.safeParse(raw);
    if (!result.success) return { error: result.error.flatten().fieldErrors };

    const item = await prisma.equipmentItem.findFirst({
        where: { id, userId: session.user.id, isArchived: false },
    });
    if (!item) return { error: { _form: ["Equipment not found"] } };

    const imageFile = formData.get("image") as File | null;
    const image = imageFile && imageFile.size > 0 ? await saveImage(imageFile) : undefined;

    await prisma.equipmentItem.update({
        where: { id },
        data: { ...result.data, ...(image ? { image } : {}) },
    });

    revalidatePath("/");
    revalidatePath(`/equipment/${id}`);
    return { success: true };
}

export async function deleteEquipment(id: string) {
    const session = await getSession();
    const item = await prisma.equipmentItem.findFirst({
        where: { id, userId: session.user.id },
    });
    if (!item) return { error: { _form: ["Equipment not found"] } };

    await prisma.equipmentItem.delete({ where: { id } });

    revalidatePath("/");
    return { success: true };
}

