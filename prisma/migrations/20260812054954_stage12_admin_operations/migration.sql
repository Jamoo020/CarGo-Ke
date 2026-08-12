/*
  Warnings:

  - You are about to drop the column `userId` on the `AuditLog` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DEACTIVATED');

-- CreateEnum
CREATE TYPE "DriverVerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');

-- AlterTable
ALTER TABLE "AuditLog" DROP COLUMN "userId",
ADD COLUMN     "actorId" TEXT,
ADD COLUMN     "capability" TEXT,
ADD COLUMN     "newState" TEXT,
ADD COLUMN     "previousState" TEXT,
ADD COLUMN     "reason" TEXT,
ADD COLUMN     "result" TEXT;

-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "lastReviewedByUserId" TEXT,
ADD COLUMN     "verificationNotes" TEXT,
ADD COLUMN     "verificationReason" TEXT,
ADD COLUMN     "verificationStatus" "DriverVerificationStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accountStatus" "AccountStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "PlatformSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" TEXT,

    CONSTRAINT "PlatformSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlatformSetting_key_key" ON "PlatformSetting"("key");
