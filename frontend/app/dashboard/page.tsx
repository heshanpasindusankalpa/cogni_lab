import {
  getLabEquipments,
  getLabStats,
  getMyLabs,
  getMyModules,
} from "@/lib/actions";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const [labsResult, statsResult, modulesResult, equipmentResult] =
    await Promise.all([
      getMyLabs(),
      getLabStats(),
      getMyModules(),
      getLabEquipments(),
    ]);

  return (
    <DashboardClient
      initialLabs={labsResult.data ?? []}
      initialStats={
        statsResult.data ?? { totalLabs: 0, activeLabs: 0, totalProgress: 0 }
      }
      modules={modulesResult.data ?? []}
      initialEquipments={equipmentResult.data ?? []}
      error={
        labsResult.error ||
        statsResult.error ||
        modulesResult.error ||
        equipmentResult.error
      }
    />
  );
}
