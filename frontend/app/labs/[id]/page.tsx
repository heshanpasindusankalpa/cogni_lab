import { getLab, getLabEquipments } from "@/lib/actions";
import { notFound } from "next/navigation";
import { LabEditorClient } from "./lab-editor-client";

type LabEditorPageProps = {
  params: Promise<{ id: string }>;
};

export default async function LabEditorPage({ params }: LabEditorPageProps) {
  const { id } = await params;

  const [labResult, equipmentsResult] = await Promise.all([
    getLab(id),
    getLabEquipments(),
  ]);

  if (labResult.error || !labResult.data) {
    notFound();
  }

  return (
    <LabEditorClient
      lab={labResult.data}
      availableEquipments={equipmentsResult.data ?? []}
    />
  );
}
