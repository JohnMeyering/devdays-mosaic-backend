/*
  Warnings:

  - You are about to drop the column `event_name` on the `PhotoMosaic` table. All the data in the column will be lost.
  - Added the required column `eventName` to the `PhotoMosaic` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PhotoMosaic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filename" TEXT,
    "path" TEXT,
    "eventName" TEXT NOT NULL,
    "raffleId" INTEGER NOT NULL,
    CONSTRAINT "PhotoMosaic_raffleId_fkey" FOREIGN KEY ("raffleId") REFERENCES "Raffle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PhotoMosaic" ("filename", "id", "path", "raffleId") SELECT "filename", "id", "path", "raffleId" FROM "PhotoMosaic";
DROP TABLE "PhotoMosaic";
ALTER TABLE "new_PhotoMosaic" RENAME TO "PhotoMosaic";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
