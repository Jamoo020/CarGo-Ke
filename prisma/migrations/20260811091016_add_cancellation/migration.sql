-- CreateTable
CREATE TABLE "Cancellation" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "initiatedById" TEXT NOT NULL,
    "initiatorRole" "UserRole" NOT NULL,
    "reason" TEXT NOT NULL,
    "statusBefore" "TripStatus" NOT NULL,
    "statusAfter" "TripStatus" NOT NULL DEFAULT 'CANCELLED',
    "refundAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cancellation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cancellation_tripId_key" ON "Cancellation"("tripId");

-- AddForeignKey
ALTER TABLE "Cancellation" ADD CONSTRAINT "Cancellation_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cancellation" ADD CONSTRAINT "Cancellation_initiatedById_fkey" FOREIGN KEY ("initiatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
