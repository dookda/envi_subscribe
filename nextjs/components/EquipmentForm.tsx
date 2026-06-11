"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { EquipmentItem } from "@prisma/client";
import { createEquipment, updateEquipment } from "@/lib/db/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  equipment?: EquipmentItem;
}

type FieldErrors = Record<string, string[] | undefined>;

const fields = [
  { name: "equipmentName", label: "Equipment Name", placeholder: "Air quality monitor XR-200" },
  { name: "model", label: "Model", placeholder: "XR-200" },
  { name: "customerName", label: "Customer Name", placeholder: "Acme Corp" },
  { name: "location", label: "Installation Location", placeholder: "Building A, Floor 3" },
] as const;

export default function EquipmentForm({ equipment }: Props) {
  const router = useRouter();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const result = equipment ? await updateEquipment(equipment.id, formData) : await createEquipment(formData);

    setLoading(false);

    if (result.error) {
      setErrors(result.error as FieldErrors);
      return;
    }

    router.push(equipment ? `/equipment/${equipment.id}` : "/");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <Label htmlFor={field.name} className="mb-1.5 block text-sm text-slate-600">
            {field.label}
          </Label>
          <Input
            id={field.name}
            name={field.name}
            placeholder={field.placeholder}
            defaultValue={(equipment?.[field.name] as string | undefined) ?? ""}
            className="rounded-xl border-slate-200"
          />
          {errors[field.name] ? <p className="mt-1 text-xs text-red-500">{errors[field.name]?.[0]}</p> : null}
        </div>
      ))}
      {errors._form ? <p className="text-xs text-red-500">{errors._form[0]}</p> : null}
      <Button type="submit" className="h-12 w-full rounded-xl" disabled={loading}>
        {loading ? "Saving..." : equipment ? "Update Equipment" : "Add Equipment"}
      </Button>
    </form>
  );
}
