/*
  Warnings:

  - You are about to drop the column `filename` on the `PhotoMosaic` table. All the data in the column will be lost.
  - You are about to drop the column `path` on the `PhotoMosaic` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PhotoMosaic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "targetFilename" TEXT,
    "targetPath" TEXT,
    "mosaicFilename" TEXT,
    "mosaicPath" TEXT,
    "eventName" TEXT NOT NULL,
    "raffleId" INTEGER,
    CONSTRAINT "PhotoMosaic_raffleId_fkey" FOREIGN KEY ("raffleId") REFERENCES "Raffle" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_PhotoMosaic" ("eventName", "id", "raffleId") SELECT "eventName", "id", "raffleId" FROM "PhotoMosaic";
DROP TABLE "PhotoMosaic";
ALTER TABLE "new_PhotoMosaic" RENAME TO "PhotoMosaic";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
