"use client";

import Image from "next/image";
import { useDraggable } from "@dnd-kit/core";
import { LabEquipment } from "@/lib/types";
import { ImageIcon } from "lucide-react";

const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const getCloudinaryUrl = (publicId?: string | null) => {
  if (!publicId || !cloudinaryCloudName) {
    return null;
  }
  return `https://res.cloudinary.com/${cloudinaryCloudName}/image/upload/${publicId}`;
};

type DraggableEquipmentProps = {
  equipment: LabEquipment;
  isDragging?: boolean;
};

export function DraggableEquipment({
  equipment,
  isDragging,
}: DraggableEquipmentProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: equipment.id,
  });

  const imageUrl = getCloudinaryUrl(equipment.imageUrl);

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`flex cursor-grab flex-col items-center gap-1 rounded-lg border bg-card p-2 transition-shadow hover:shadow-md ${
        isDragging ? "shadow-lg ring-2 ring-primary" : ""
      }`}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={equipment.equipmentName}
            fill
            className="object-contain p-1"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
          </div>
        )}
      </div>
      <span className="line-clamp-1 text-center text-xs font-medium">
        {equipment.equipmentName}
      </span>
    </div>
  );
}
