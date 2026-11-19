ALTER TABLE "Refund"
ADD COLUMN "requestKey" TEXT;

CREATE UNIQUE INDEX "Refund_requestKey_key"
ON "Refund"("requestKey");
