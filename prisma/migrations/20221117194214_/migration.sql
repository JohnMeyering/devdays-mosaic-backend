/*
  Warnings:

  - Added the required column `prize` to the `Raffle` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Raffle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "prize" TEXT NOT NULL,
    "winnerId" INTEGER NOT NULL,
    CONSTRAINT "Raffle_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Raffle" ("id", "winnerId") SELECT "id", "winnerId" FROM "Raffle";
DROP TABLE "Raffle";
ALTER TABLE "new_Raffle" RENAME TO "Raffle";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
