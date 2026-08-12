-- DropForeignKey
ALTER TABLE "Dispute" DROP CONSTRAINT "Dispute_RaisedBy_fk";

-- AddForeignKey
ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_raisedById_fkey" FOREIGN KEY ("raisedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
