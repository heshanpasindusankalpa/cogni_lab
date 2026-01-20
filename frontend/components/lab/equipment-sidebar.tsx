"use client";

import { useState } from "react";
import Image from "next/image";
import { useDraggable } from "@dnd-kit/core";
import { Search } from "lucide-react";
import { LabEquipment } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { DraggableEquipment } from "./draggable-equipment";

const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

type EquipmentSidebarProps = {
  equipments: LabEquipment[];
};

export function EquipmentSidebar({ equipments }: EquipmentSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEquipments = equipments.filter(
    (eq) =>
      eq.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.equipmentType.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <aside className="flex w-64 flex-col border-l bg-background">
      <div className="border-b p-4">
        <h2 className="mb-3 font-semibold">Equipment &amp; Materials</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search equipment"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">
          Components
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {filteredEquipments.map((equipment) => (
            <DraggableEquipment key={equipment.id} equipment={equipment} />
          ))}
        </div>

        {filteredEquipments.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            No equipment found
          </p>
        )}
      </div>
    </aside>
  );
}
