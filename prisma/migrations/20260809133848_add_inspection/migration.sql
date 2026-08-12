-- CreateEnum
CREATE TYPE "InspectionType" AS ENUM ('PICKUP', 'DELIVERY');

-- CreateTable
CREATE TABLE "Inspection" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "type" "InspectionType" NOT NULL,
    "driverId" TEXT NOT NULL,
    "photoUrls" JSONB NOT NULL,
    "odometer" DOUBLE PRECISION NOT NULL,
    "fuelLevel" DOUBLE PRECISION,
    "vehicleCondition" TEXT NOT NULL,
    "damageNotes" TEXT,
    "observations" TEXT,
    "handoverConfirmed" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inspection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Inspection_tripId_idx" ON "Inspection"("tripId");

-- CreateIndex
CREATE INDEX "Inspection_driverId_idx" ON "Inspection"("driverId");

-- CreateIndex
CREATE UNIQUE INDEX "Inspection_tripId_type_key" ON "Inspection"("tripId", "type");

-- AddForeignKey
ALTER TABLE "Inspection" ADD CONSTRAINT "Inspection_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inspection" ADD CONSTRAINT "Inspection_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
