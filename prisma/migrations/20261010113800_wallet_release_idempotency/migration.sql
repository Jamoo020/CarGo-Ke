ALTER TABLE "WalletTransaction"
ADD COLUMN "idempotencyKey" TEXT;

CREATE UNIQUE INDEX "WalletTransaction_idempotencyKey_key"
ON "WalletTransaction"("idempotencyKey");
