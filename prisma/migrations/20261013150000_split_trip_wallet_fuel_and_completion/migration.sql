BEGIN;

ALTER TABLE "Trip"
ADD COLUMN "driverCompletionConfirmedAt" TIMESTAMP(3),
ADD COLUMN "driverCompletionConfirmedById" TEXT,
ADD COLUMN "customerCompletionConfirmedAt" TIMESTAMP(3),
ADD COLUMN "customerCompletionConfirmedById" TEXT;

ALTER TABLE "Trip"
ADD CONSTRAINT "Trip_driverCompletionConfirmedById_fkey"
FOREIGN KEY ("driverCompletionConfirmedById") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT "Trip_customerCompletionConfirmedById_fkey"
FOREIGN KEY ("customerCompletionConfirmedById") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "TripWallet"
ADD COLUMN "driverCompensationReleased" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "driverCompensationRemaining" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "releaseAccountingVersion" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN "fuelAllocated" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "fuelSpent" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "fuelPending" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "fuelRemaining" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "fuelAccountingStatus" TEXT NOT NULL DEFAULT 'LEGACY_UNRECONCILED';

ALTER TABLE "TripWallet"
ALTER COLUMN "releaseAccountingVersion" SET DEFAULT 2,
ALTER COLUMN "fuelAccountingStatus" SET DEFAULT 'RESTRICTED';

UPDATE "TripWallet"
SET "fuelAllocated" = "fuelBudget";

COMMIT;
