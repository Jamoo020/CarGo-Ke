/*
  Warnings:

  - The values [DRIVER_RELEASE] on the enum `WalletTransactionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "WalletTransactionType_new" AS ENUM ('PAYMENT_RECEIVED', 'REFUND', 'REFUND_OUT', 'DRIVER_FIRST_RELEASE', 'DRIVER_FINAL_RELEASE', 'DRIVER_REVERSAL', 'DRIVER_ADJUSTMENT', 'ADJUSTMENT');
ALTER TABLE "WalletTransaction" ALTER COLUMN "type" TYPE "WalletTransactionType_new" USING ("type"::text::"WalletTransactionType_new");
ALTER TYPE "WalletTransactionType" RENAME TO "WalletTransactionType_old";
ALTER TYPE "WalletTransactionType_new" RENAME TO "WalletTransactionType";
DROP TYPE "WalletTransactionType_old";
COMMIT;
