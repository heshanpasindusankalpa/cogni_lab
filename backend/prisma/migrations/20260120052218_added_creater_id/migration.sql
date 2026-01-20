/*
  Warnings:

  - Added the required column `creatorId` to the `lab_equipment` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_lab_equipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "creatorId" TEXT NOT NULL,
    "equipmentType" TEXT NOT NULL,
    "equipmentName" TEXT NOT NULL,
    "description" TEXT,
    "supportsConfiguration" BOOLEAN NOT NULL DEFAULT false,
    "defaultConfigJson" JSONB,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "lab_equipment_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_lab_equipment" ("createdAt", "defaultConfigJson", "description", "equipmentName", "equipmentType", "id", "imageUrl", "supportsConfiguration") SELECT "createdAt", "defaultConfigJson", "description", "equipmentName", "equipmentType", "id", "imageUrl", "supportsConfiguration" FROM "lab_equipment";
DROP TABLE "lab_equipment";
ALTER TABLE "new_lab_equipment" RENAME TO "lab_equipment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
