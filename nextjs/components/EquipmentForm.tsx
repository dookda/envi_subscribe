"use client";

import { useState, useRef, type FormEvent, type ChangeEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { EquipmentItem } from "@prisma/client";
import { createEquipment, updateEquipment } from "@/lib/db/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BASE_PATH } from "@/lib/base-path";
import LocationPicker from "@/components/LocationPicker";
import { useLang } from "@/components/LangProvider";

interface Props {
  equipment?: EquipmentItem;
}

type FieldErrors = Record<string, string[] | undefined>;

export default function EquipmentForm({ equipment }: Props) {
  const { t } = useLang();
  const router = useRouter();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(equipment?.image ?? null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fields = [
    { name: "equipmentName", label: t.fieldBand, placeholder: "Air quality monitor XR-200", required: true },
    { name: "model", label: t.fieldModel, placeholder: "XR-200", required: true },
    { name: "customerName", label: t.fieldCustomer, placeholder: "Acme Corp", required: false },
    { name: "location", label: t.fieldLocation, placeholder: "Building A, Floor 3", required: false },
  ] as const;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const result = equipment
      ? await updateEquipment(equipment.id, formData)
      : await createEquipment(formData);

    setLoading(false);

    if (result.error) {
      setErrors(result.error as FieldErrors);
      return;
    }

    router.push(equipment ? `${BASE_PATH}/equipment/${equipment.id}` : BASE_PATH);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <Label htmlFor={field.name} className="mb-1.5 block text-sm text-slate-600 dark:text-slate-300">
            {field.label}{field.required ? <span className="ml-0.5 text-red-500">*</span> : null}
          </Label>
          <Input
            id={field.name}
            name={field.name}
            placeholder={field.placeholder}
            defaultValue={(equipment?.[field.name] as string | undefined) ?? ""}
            required={field.required}
            className="rounded-xl border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          {errors[field.name] ? <p className="mt-1 text-xs text-red-500">{errors[field.name]?.[0]}</p> : null}
        </div>
      ))}

      <div>
        <Label htmlFor="installedAt" className="mb-1.5 block text-sm text-slate-600 dark:text-slate-300">
          {t.fieldInstalledAt}<span className="ml-0.5 text-red-500">*</span>
        </Label>
        <Input
          id="installedAt"
          name="installedAt"
          type="date"
          required
          defaultValue={equipment?.installedAt ? new Date(equipment.installedAt).toISOString().slice(0, 10) : ""}
          className="rounded-xl border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
        />
        {errors.installedAt ? <p className="mt-1 text-xs text-red-500">{errors.installedAt[0]}</p> : null}
      </div>

      <div>
        <Label htmlFor="expiredAt" className="mb-1.5 block text-sm text-slate-600 dark:text-slate-300">
          {t.fieldExpiredAt}
        </Label>
        <Input
          id="expiredAt"
          name="expiredAt"
          type="date"
          defaultValue={equipment?.expiredAt ? new Date(equipment.expiredAt).toISOString().slice(0, 10) : ""}
          className="rounded-xl border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
        />
        {errors.expiredAt ? <p className="mt-1 text-xs text-red-500">{errors.expiredAt[0]}</p> : null}
      </div>

      <div>
        <Label htmlFor="image" className="mb-1.5 block text-sm text-slate-600 dark:text-slate-300">
          {t.fieldPhoto}
        </Label>
        {preview ? (
          <div className="mb-2 relative aspect-video w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-slate-700">
            <Image src={preview} alt="Equipment preview" fill className="object-contain" unoptimized />
            <button
              type="button"
              onClick={() => { setPreview(null); if (fileRef.current) fileRef.current.value = ""; }}
              className="absolute right-2 top-2 rounded-full bg-white/80 px-2 py-0.5 text-xs text-slate-500 shadow hover:bg-white dark:bg-slate-600/80 dark:text-slate-300 dark:hover:bg-slate-600"
            >
              Remove
            </button>
          </div>
        ) : null}
        <Input
          ref={fileRef}
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="rounded-xl border-slate-200 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-xs file:text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:file:bg-slate-600 dark:file:text-slate-300"
        />
      </div>

      <LocationPicker initialLat={equipment?.latitude} initialLng={equipment?.longitude} />

      {errors._form ? <p className="text-xs text-red-500">{errors._form[0]}</p> : null}
      <Button type="submit" className="h-12 w-full rounded-xl" disabled={loading}>
        {loading ? t.saving : equipment ? t.updateEquipment : t.registerEquipment}
      </Button>
    </form>
  );
}
