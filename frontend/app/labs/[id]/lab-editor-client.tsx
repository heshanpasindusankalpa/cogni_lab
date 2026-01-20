"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  pointerWithin,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  ArrowLeft,
  Play,
  Save,
  Trash2,
  Settings,
  Move,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Grid3X3,
} from "lucide-react";
import {
  Lab,
  LabEquipment,
  EquipmentPlacement,
  ExperimentStep,
} from "@/lib/types";
import { updateLabEquipments, updateLabSteps } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { EquipmentSidebar } from "@/components/lab/equipment-sidebar";
import { CanvasArea } from "@/components/lab/canvas-area";
import { StepsSidebar } from "@/components/lab/steps-sidebar";
import { DraggableEquipment } from "@/components/lab/draggable-equipment";
import { ThresholdsDialog } from "@/components/lab/thresholds-dialog";
import { EquipmentConfigDialog } from "@/components/lab/equipment-config-dialog";

type LabEditorClientProps = {
  lab: Lab;
  availableEquipments: LabEquipment[];
};

type PlacedEquipment = EquipmentPlacement & {
  equipment: LabEquipment;
};

export function LabEditorClient({
  lab,
  availableEquipments,
}: LabEditorClientProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  // Initialize placed equipments from lab data
  const [placedEquipments, setPlacedEquipments] = useState<PlacedEquipment[]>(
    () =>
      (lab.labEquipments || []).map((eq) => ({
        ...eq,
        equipment: eq.equipment!,
      })),
  );

  // Initialize steps from lab data
  const [steps, setSteps] = useState<ExperimentStep[]>(
    lab.experimentSteps || [],
  );

  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isThresholdsOpen, setIsThresholdsOpen] = useState(false);
  const [configEquipment, setConfigEquipment] =
    useState<PlacedEquipment | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // Check if dropping on canvas
    if (over.id === "canvas") {
      const equipment = availableEquipments.find((eq) => eq.id === active.id);
      if (equipment && canvasRef.current) {
        // Get canvas bounding rect
        const canvasRect = canvasRef.current.getBoundingClientRect();

        // Calculate position relative to canvas
        // The activatorEvent gives us the initial pointer position
        // delta gives us how much it moved
        const activatorEvent = event.activatorEvent as PointerEvent;
        const pointerX = activatorEvent.clientX + event.delta.x;
        const pointerY = activatorEvent.clientY + event.delta.y;

        // Calculate position relative to canvas, snapped to grid
        const relativeX = Math.max(
          0,
          Math.round((pointerX - canvasRect.left - 40) / 20) * 20,
        );
        const relativeY = Math.max(
          0,
          Math.round((pointerY - canvasRect.top - 40) / 20) * 20,
        );

        const newPlacement: PlacedEquipment = {
          equipmentId: equipment.id,
          positionX: relativeX,
          positionY: relativeY,
          positionZ: placedEquipments.length,
          configJson:
            (equipment.defaultConfigJson as Record<string, unknown>) || null,
          equipment,
        };
        setPlacedEquipments([...placedEquipments, newPlacement]);
      }
    }
  };

  const handleEquipmentMove = useCallback(
    (index: number, x: number, y: number) => {
      setPlacedEquipments((prev) =>
        prev.map((eq, i) =>
          i === index ? { ...eq, positionX: x, positionY: y } : eq,
        ),
      );
    },
    [],
  );

  const handleEquipmentRemove = useCallback((index: number) => {
    setPlacedEquipments((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleEquipmentConfig = useCallback(
    (index: number) => {
      setConfigEquipment(placedEquipments[index]);
    },
    [placedEquipments],
  );

  const handleConfigSave = useCallback(
    (config: Record<string, unknown>) => {
      if (!configEquipment) return;

      setPlacedEquipments((prev) =>
        prev.map((eq) =>
          eq.equipmentId === configEquipment.equipmentId &&
          eq.positionX === configEquipment.positionX &&
          eq.positionY === configEquipment.positionY
            ? { ...eq, configJson: config }
            : eq,
        ),
      );
      setConfigEquipment(null);
    },
    [configEquipment],
  );

  const handleSave = async () => {
    setIsSaving(true);

    // Save equipments
    await updateLabEquipments(
      lab.id,
      placedEquipments.map((eq) => ({
        equipmentId: eq.equipmentId,
        positionX: eq.positionX,
        positionY: eq.positionY,
        positionZ: eq.positionZ,
        configJson: eq.configJson || undefined,
      })),
    );

    // Save steps
    await updateLabSteps(
      lab.id,
      steps.map((step) => ({
        stepNumber: step.stepNumber,
        stepDescription: step.stepDescription,
        procedure: step.procedure || undefined,
        minTolerance: step.minTolerance || undefined,
        maxTolerance: step.maxTolerance || undefined,
        unit: step.unit || undefined,
      })),
    );

    setIsSaving(false);
  };

  const handleAddStep = () => {
    const newStep: ExperimentStep = {
      stepNumber: steps.length + 1,
      stepDescription: "New step",
      procedure: "",
    };
    setSteps([...steps, newStep]);
  };

  const handleUpdateStep = (
    index: number,
    updates: Partial<ExperimentStep>,
  ) => {
    setSteps((prev) =>
      prev.map((step, i) => (i === index ? { ...step, ...updates } : step)),
    );
  };

  const handleRemoveStep = (index: number) => {
    setSteps((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((step, i) => ({ ...step, stepNumber: i + 1 })),
    );
  };

  const activeEquipment = activeId
    ? availableEquipments.find((eq) => eq.id === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-screen flex-col bg-background max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex h-14 items-center justify-between border-b px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">{lab.labName}</h1>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsThresholdsOpen(true)}
            >
              <Settings className="mr-2 h-4 w-4" />
              Set Thresholds
            </Button>
            <Button variant="outline" size="sm">
              <Play className="mr-2 h-4 w-4" />
              Run
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Discard
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Steps */}
          <StepsSidebar
            objective={lab.description || ""}
            steps={steps}
            onAddStep={handleAddStep}
            onUpdateStep={handleUpdateStep}
            onRemoveStep={handleRemoveStep}
          />

          {/* Canvas Area */}
          <div className="flex flex-1 flex-col">
            {/* Toolbar */}
            <div className="flex h-10 items-center gap-1 border-b bg-muted/30 px-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Move className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <RotateCcw className="h-4 w-4" />
              </Button>
              <div className="mx-2 h-4 w-px bg-border" />
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <div className="mx-2 h-4 w-px bg-border" />
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Canvas */}
            <CanvasArea
              ref={canvasRef}
              placedEquipments={placedEquipments}
              onEquipmentMove={handleEquipmentMove}
              onEquipmentRemove={handleEquipmentRemove}
              onEquipmentConfig={handleEquipmentConfig}
            />
          </div>

          {/* Right Sidebar - Equipment */}
          <EquipmentSidebar equipments={availableEquipments} />
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeEquipment && (
          <DraggableEquipment equipment={activeEquipment} isDragging />
        )}
      </DragOverlay>

      {/* Thresholds Dialog */}
      <ThresholdsDialog
        open={isThresholdsOpen}
        onOpenChange={setIsThresholdsOpen}
        lab={lab}
      />

      {/* Equipment Config Dialog */}
      {configEquipment && (
        <EquipmentConfigDialog
          open={!!configEquipment}
          onOpenChange={(open: boolean) => !open && setConfigEquipment(null)}
          equipment={configEquipment.equipment}
          currentConfig={configEquipment.configJson || {}}
          onSave={handleConfigSave}
        />
      )}
    </DndContext>
  );
}
