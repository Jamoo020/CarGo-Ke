import { apiGet, apiPatch } from "./api";
import { User } from "../types/auth";
import { Trip, Payment, Dispute, TransportRequestQuote } from "../types/customer";

export function listUsers(params: { search?: string; role?: string; accountStatus?: string } = {}) {
  const qs = new URLSearchParams();
  if (params.search) qs.set("search", params.search);
  if (params.role) qs.set("role", params.role);
  if (params.accountStatus) qs.set("accountStatus", params.accountStatus);
  return apiGet<{ data: User[] }>(`/api/admin/users?${qs.toString()}`);
}

export function getUser(userId: string) {
  return apiGet<{ data: User }>(`/api/admin/users/${userId}`);
}

export function updateUserStatus(userId: string, body: { accountStatus: string; reason?: string }) {
  return apiPatch<{ data: User }>(`/api/admin/users/${userId}/status`, body);
}

export function listDrivers(params: { status?: string } = {}) {
  const qs = new URLSearchParams();
  if (params.status) qs.set("status", params.status);
  return apiGet<{ data: any[] }>(`/api/admin/drivers?${qs.toString()}`);
}

export function getDriver(driverId: string) {
  return apiGet<{ data: any }>(`/api/admin/drivers/${driverId}`);
}

export function approveDriver(driverId: string, body: { reason?: string } = {}) {
  return apiPatch<{ data: any }>(`/api/admin/drivers/${driverId}/approve`, body);
}

export function rejectDriver(driverId: string, body: { reason: string }) {
  return apiPatch<{ data: any }>(`/api/admin/drivers/${driverId}/reject`, body);
}

export function suspendDriver(driverId: string, body: { reason: string }) {
  return apiPatch<{ data: any }>(`/api/admin/drivers/${driverId}/suspend`, body);
}

export function reactivateDriver(driverId: string, body: { reason: string }) {
  return apiPatch<{ data: any }>(`/api/admin/drivers/${driverId}/reactivate`, body);
}

export function listTrips(params: { status?: string; search?: string } = {}) {
  const qs = new URLSearchParams();
  if (params.status) qs.set("status", params.status);
  if (params.search) qs.set("search", params.search);
  return apiGet<{ data: Trip[] }>(`/api/admin/trips?${qs.toString()}`);
}

export function getTrip(tripId: string) {
  return apiGet<{ data: Trip }>(`/api/admin/trips/${tripId}`);
}

export function listPayments(params: { status?: string; search?: string } = {}) {
  const qs = new URLSearchParams();
  if (params.status) qs.set("status", params.status);
  if (params.search) qs.set("search", params.search);
  return apiGet<{ data: Payment[] }>(`/api/admin/payments?${qs.toString()}`);
}

export function getPayment(paymentId: string) {
  return apiGet<{ data: Payment }>(`/api/admin/payments/${paymentId}`);
}

export function getDispute(disputeId: string) {
  return apiGet<{ data: Dispute }>(`/api/admin/disputes/${disputeId}`);
}

export function updateDispute(disputeId: string, body: Partial<Dispute>) {
  return apiPatch<{ data: Dispute }>(`/api/admin/disputes/${disputeId}`, body);
}

export function listConfig() {
  return apiGet<{ data: { key: string; value: string; description?: string }[] }>(`/api/admin/config`);
}

export function getConfig(key: string) {
  return apiGet<{ data: { key: string; value: string; description?: string } }>(`/api/admin/config/${key}`);
}

export function updateConfig(key: string, body: { value: string; description?: string }) {
  return apiPatch<{ data: any }>(`/api/admin/config/${key}`, body);
}

export function listAuditLogs() {
  return apiGet<{ data: any[] }>(`/api/admin/audit-logs`);
}

export default {};
