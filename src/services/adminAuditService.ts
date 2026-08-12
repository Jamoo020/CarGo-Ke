import { Prisma } from "@prisma/client";
import { prisma } from "../db";

export interface CreateAdminAuditParams {
  actorId: string;
  entity: string;
  entityId: string;
  action: string;
  capability?: string;
  previousState?: string | null;
  newState?: string | null;
  reason?: string | null;
  result?: string | null;
  metadata?: Record<string, unknown> | null;
  tx?: Prisma.TransactionClient;
}

export async function createAdminAuditLog(params: CreateAdminAuditParams) {
  const client = params.tx ?? prisma;
  return client.auditLog.create({
    data: {
      actorId: params.actorId,
      entity: params.entity,
      entityId: params.entityId,
      action: params.action,
      capability: params.capability ?? null,
      previousState: params.previousState ?? null,
      newState: params.newState ?? null,
      reason: params.reason ?? null,
      result: params.result ?? null,
      metadata: params.metadata ? (params.metadata as any) : null,
    },
  });
}
