-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'CUSTOMER', 'DRIVER', 'AUTHORIZED_REPRESENTATIVE');

-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('REQUESTED', 'QUOTING', 'DRIVER_SELECTED', 'PAYMENT_PENDING', 'BOOKED', 'PICKUP_PENDING', 'PICKUP_INSPECTION', 'TRIP_START_PENDING', 'TRIP_ACTIVE', 'IN_TRANSIT', 'DELIVERY_PENDING', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'FAILED');

-- CreateEnum
CREATE TYPE "RefundStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "DisputeStatus" AS ENUM ('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "DisputeResolutionType" AS ENUM ('FULL_REFUND', 'PARTIAL_REFUND', 'DRIVER_PENALTY', 'NO_ACTION');

-- CreateEnum
CREATE TYPE "WalletTransactionType" AS ENUM ('PAYMENT_RECEIVED', 'REFUND', 'REFUND_OUT', 'DRIVER_RELEASE', 'DRIVER_REVERSAL', 'DRIVER_ADJUSTMENT', 'ADJUSTMENT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "driverProfileId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerRepresentative" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "representativeId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "CustomerRepresentative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleDetail" (
    "id" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransportRequest" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "authorizedRepresentativeId" TEXT,
    "vehicleDetailId" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "status" "TripStatus" NOT NULL DEFAULT 'REQUESTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransportRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "licenseNumber" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DriverQuote" (
    "id" TEXT NOT NULL,
    "transportRequestId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DriverQuote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL,
    "transportRequestId" TEXT NOT NULL,
    "customerId" TEXT,
    "authorizedRepresentativeId" TEXT,
    "driverId" TEXT NOT NULL,
    "vehicleDetailId" TEXT NOT NULL,
    "status" "TripStatus" NOT NULL DEFAULT 'REQUESTED',
    "bookingAmount" DOUBLE PRECISION NOT NULL,
    "driverFee" DOUBLE PRECISION NOT NULL,
    "fuelBudget" DOUBLE PRECISION,
    "carGoFee" DOUBLE PRECISION,
    "driverAmountReleased" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "driverAmountRemaining" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "refundAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripWallet" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "customerPaymentAmount" DOUBLE PRECISION NOT NULL,
    "refundAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "driverAmountReleased" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "driverAmountRemaining" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TripWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DriverWallet" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "availableBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pendingBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalEarned" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DriverWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletTransaction" (
    "id" TEXT NOT NULL,
    "tripWalletId" TEXT,
    "driverWalletId" TEXT,
    "paymentId" TEXT,
    "refundId" TEXT,
    "type" "WalletTransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WalletTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "providerReference" TEXT,
    "providerCallbackReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Refund" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "RefundStatus" NOT NULL DEFAULT 'PENDING',
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Refund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dispute" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "status" "DisputeStatus" NOT NULL DEFAULT 'OPEN',
    "resolutionType" "DisputeResolutionType",
    "resolutionAmount" DOUBLE PRECISION,
    "resolutionSummary" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dispute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "userId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_driverProfileId_key" ON "User"("driverProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerRepresentative_customerId_representativeId_key" ON "CustomerRepresentative"("customerId", "representativeId");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleDetail_registrationNumber_year_key" ON "VehicleDetail"("registrationNumber", "year");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_userId_key" ON "Driver"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Trip_transportRequestId_key" ON "Trip"("transportRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "TripWallet_tripId_key" ON "TripWallet"("tripId");

-- CreateIndex
CREATE UNIQUE INDEX "DriverWallet_driverId_key" ON "DriverWallet"("driverId");

-- CreateIndex
CREATE INDEX "DriverWallet_driverId_idx" ON "DriverWallet"("driverId");

-- CreateIndex
CREATE INDEX "WalletTransaction_tripWalletId_idx" ON "WalletTransaction"("tripWalletId");

-- CreateIndex
CREATE INDEX "WalletTransaction_driverWalletId_idx" ON "WalletTransaction"("driverWalletId");

-- CreateIndex
CREATE INDEX "WalletTransaction_paymentId_idx" ON "WalletTransaction"("paymentId");

-- CreateIndex
CREATE INDEX "WalletTransaction_refundId_idx" ON "WalletTransaction"("refundId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_tripId_key" ON "Payment"("tripId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_providerReference_key" ON "Payment"("providerReference");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_providerCallbackReference_key" ON "Payment"("providerCallbackReference");

-- CreateIndex
CREATE UNIQUE INDEX "Dispute_tripId_key" ON "Dispute"("tripId");

-- AddForeignKey
ALTER TABLE "CustomerRepresentative" ADD CONSTRAINT "CustomerRepresentative_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerRepresentative" ADD CONSTRAINT "CustomerRepresentative_representativeId_fkey" FOREIGN KEY ("representativeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransportRequest" ADD CONSTRAINT "TransportRequest_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransportRequest" ADD CONSTRAINT "TransportRequest_authorizedRepresentativeId_fkey" FOREIGN KEY ("authorizedRepresentativeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransportRequest" ADD CONSTRAINT "TransportRequest_vehicleDetailId_fkey" FOREIGN KEY ("vehicleDetailId") REFERENCES "VehicleDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverQuote" ADD CONSTRAINT "DriverQuote_transportRequestId_fkey" FOREIGN KEY ("transportRequestId") REFERENCES "TransportRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverQuote" ADD CONSTRAINT "DriverQuote_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_transportRequestId_fkey" FOREIGN KEY ("transportRequestId") REFERENCES "TransportRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_authorizedRepresentativeId_fkey" FOREIGN KEY ("authorizedRepresentativeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_vehicleDetailId_fkey" FOREIGN KEY ("vehicleDetailId") REFERENCES "VehicleDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripWallet" ADD CONSTRAINT "TripWallet_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverWallet" ADD CONSTRAINT "DriverWallet_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_tripWalletId_fkey" FOREIGN KEY ("tripWalletId") REFERENCES "TripWallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_driverWalletId_fkey" FOREIGN KEY ("driverWalletId") REFERENCES "DriverWallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_refundId_fkey" FOREIGN KEY ("refundId") REFERENCES "Refund"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
