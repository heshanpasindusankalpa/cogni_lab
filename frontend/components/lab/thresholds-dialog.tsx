"use client";

import { useState } from "react";
import { updateLab } from "@/lib/actions";
import { Lab } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type ThresholdsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lab: Lab;
};

export function ThresholdsDialog({
  open,
  onOpenChange,
  lab,
}: ThresholdsDialogProps) {
  const [thresholds, setThresholds] = useState(
    `${lab.toleranceMin ?? ""}, ${lab.toleranceMax ?? ""}`.trim(),
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);

    const parts = thresholds.split(",").map((p) => parseFloat(p.trim()));
    const toleranceMin = isNaN(parts[0]) ? undefined : parts[0];
    const toleranceMax = isNaN(parts[1]) ? undefined : parts[1];

    await updateLab(lab.id, {
      toleranceMin,
      toleranceMax,
    });

    setIsSaving(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Laboratory - Step 03</DialogTitle>
          <DialogDescription>
            Add threshold values of your experiment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="thresholds">Thresholds</Label>
            <Input
              id="thresholds"
              value={thresholds}
              onChange={(e) => setThresholds(e.target.value)}
              placeholder="1,24"
            />
            <p className="text-xs text-muted-foreground">
              Enter min and max values separated by comma (e.g., 1,24)
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Go back
          </Button>
          <Button variant="destructive" onClick={() => onOpenChange(false)}>
            Discard
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Finish"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
