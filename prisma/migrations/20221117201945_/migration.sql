-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Raffle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "prize" TEXT NOT NULL,
    "winnerId" INTEGER,
    CONSTRAINT "Raffle_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Raffle" ("id", "prize", "winnerId") SELECT "id", "prize", "winnerId" FROM "Raffle";
DROP TABLE "Raffle";
ALTER TABLE "new_Raffle" RENAME TO "Raffle";
CREATE TABLE "new_PhotoMosaic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filename" TEXT,
    "path" TEXT,
    "eventName" TEXT NOT NULL,
    "raffleId" INTEGER,
    CONSTRAINT "PhotoMosaic_raffleId_fkey" FOREIGN KEY ("raffleId") REFERENCES "Raffle" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_PhotoMosaic" ("eventName", "filename", "id", "path", "raffleId") SELECT "eventName", "filename", "id", "path", "raffleId" FROM "PhotoMosaic";
DROP TABLE "PhotoMosaic";
ALTER TABLE "new_PhotoMosaic" RENAME TO "PhotoMosaic";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
