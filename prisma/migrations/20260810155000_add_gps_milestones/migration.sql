-- CreateEnum
CREATE TYPE "MilestoneType" AS ENUM ('PICKUP_COMPLETED', 'TRIP_STARTED', 'FUEL_STOP', 'ROUTE_MILESTONE', 'DELAY', 'DESTINATION_REACHED', 'DELIVERY_INSPECTION_STARTED', 'DELIVERY_COMPLETED', 'OTHER');

-- CreateTable
CREATE TABLE "GPSLocation" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "accuracy" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GPSLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripMilestone" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "type" "MilestoneType" NOT NULL,
    "eventTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "accuracy" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TripMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GPSLocation_tripId_idx" ON "GPSLocation"("tripId");

-- CreateIndex
CREATE INDEX "GPSLocation_driverId_idx" ON "GPSLocation"("driverId");

-- CreateIndex
CREATE INDEX "TripMilestone_tripId_idx" ON "TripMilestone"("tripId");

-- CreateIndex
CREATE INDEX "TripMilestone_createdById_idx" ON "TripMilestone"("createdById");

-- AddForeignKey
ALTER TABLE "GPSLocation" ADD CONSTRAINT "GPSLocation_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GPSLocation" ADD CONSTRAINT "GPSLocation_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripMilestone" ADD CONSTRAINT "TripMilestone_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripMilestone" ADD CONSTRAINT "TripMilestone_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
