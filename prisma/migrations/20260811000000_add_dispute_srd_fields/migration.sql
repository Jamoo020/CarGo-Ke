-- Add dispute SRD fields: description, category, priority, raisedBy

CREATE TYPE "DisputeCategory" AS ENUM ('VEHICLE_CONDITION','DRIVER_CONDUCT','PAYMENT','FUEL','DELIVERY','DESTINATION','DAMAGE','OTHER');
CREATE TYPE "DisputePriority" AS ENUM ('LOW','NORMAL','HIGH');

ALTER TABLE "Dispute" ADD COLUMN "raisedById" text;
ALTER TABLE "Dispute" ADD COLUMN "raisedByRole" "UserRole";
ALTER TABLE "Dispute" ADD COLUMN "description" text;
ALTER TABLE "Dispute" ADD COLUMN "category" "DisputeCategory";
ALTER TABLE "Dispute" ADD COLUMN "priority" "DisputePriority";

ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_RaisedBy_fk" FOREIGN KEY ("raisedById") REFERENCES "User"(id);
