import { z } from "zod";

export const equipmentSchema = z.object({
    equipmentName: z.string().min(1, "Equipment name is required").max(200),
    model: z.string().min(1, "Model is required").max(200),
    customerName: z.string().min(1, "Customer name is required").max(200),
    location: z.string().min(1, "Location is required").max(500),
});

export type EquipmentFormData = z.infer<typeof equipmentSchema>;

export const serviceRecordSchema = z.object({
    equipmentId: z.string().cuid(),
    serviceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
    status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED"]).default("SCHEDULED"),
    notes: z.string().trim().max(1000).optional(),
});

export type ServiceRecordFormData = z.infer<typeof serviceRecordSchema>;

export const filterSchema = z.object({
    search: z.string().trim().optional(),
    serviceDate: z.string().optional(),
    sortBy: z.enum(["serviceDate", "equipmentName", "createdAt"]).default("createdAt"),
    sortDir: z.enum(["asc", "desc"]).default("desc"),
});
