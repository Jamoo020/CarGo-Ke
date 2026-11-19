-- CreateEnum
CREATE TYPE "CapacityUnit" AS ENUM ('PASSENGERS', 'KG', 'TONNES', 'OTHER');

-- AlterTable
ALTER TABLE "TransportRequest" ADD COLUMN     "destinationAddress" TEXT,
ADD COLUMN     "destinationLatitude" DOUBLE PRECISION,
ADD COLUMN     "destinationLongitude" DOUBLE PRECISION,
ADD COLUMN     "distanceMeters" INTEGER,
ADD COLUMN     "estimatedDurationSeconds" INTEGER,
ADD COLUMN     "pickupAddress" TEXT,
ADD COLUMN     "pickupLatitude" DOUBLE PRECISION,
ADD COLUMN     "pickupLongitude" DOUBLE PRECISION,
ADD COLUMN     "routePolyline" TEXT;
