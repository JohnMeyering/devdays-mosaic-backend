-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PhotoMosaic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filename" TEXT,
    "path" TEXT,
    "event_name" TEXT NOT NULL,
    "raffleId" INTEGER NOT NULL,
    CONSTRAINT "PhotoMosaic_raffleId_fkey" FOREIGN KEY ("raffleId") REFERENCES "Raffle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PhotoMosaic" ("event_name", "filename", "id", "path", "raffleId") SELECT "event_name", "filename", "id", "path", "raffleId" FROM "PhotoMosaic";
DROP TABLE "PhotoMosaic";
ALTER TABLE "new_PhotoMosaic" RENAME TO "PhotoMosaic";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
