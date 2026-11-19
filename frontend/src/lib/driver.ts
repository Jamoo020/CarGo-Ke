import { apiGet, apiPost } from "./api";
import {
  TransportRequestQuoteResponse,
  TripQueryResponse,
  TripDetailResponse,
  TransportRequestQuote,
  TransportRequestQueryResponse,
} from "../types/customer";

export function listAvailableRequests() {
  return apiGet<TransportRequestQueryResponse>("/api/transport-requests");
}

export function listMyQuotes() {
  return apiGet<TransportRequestQuoteResponse>("/api/drivers/me/quotes");
}

export function createQuote(transportRequestId: string, payload: { amount: number; fuelBudget?: number; message?: string }) {
  return apiPost<{ data: TransportRequestQuote }>(`/api/transport-requests/${transportRequestId}/quotes`, payload);
}

export function listTrips() {
  return apiGet<TripQueryResponse>("/api/trips");
}

export function getTrip(tripId: string) {
  return apiGet<TripDetailResponse>(`/api/trips/${tripId}`);
}

export function getTripWallet(tripId: string) {
  return apiGet<{ data: any }>(`/api/trips/${tripId}/wallet`);
}

export function releaseDriverFunds(tripId: string) {
  return apiPost<{ data: any }>(`/api/trips/${tripId}/wallet/releases`, {});
}

export function confirmTripCompletion(tripId: string) {
  return apiPost<TripDetailResponse>(`/api/trips/${tripId}/completion-confirmations`, {});
}

export function transitionTrip(tripId: string, action: string, payload: any = {}) {
  return apiPost<{ data: any }>(`/api/trips/${tripId}/transitions`, { action, ...payload });
}

export function createInspection(
  tripId: string,
  payload: {
    type: "PICKUP" | "DELIVERY";
    photoUrls: string[];
    odometer: number;
    fuelLevel?: number;
    vehicleCondition: string;
    damageNotes?: string;
    observations?: string;
    handoverConfirmed: boolean;
  },
) {
  return apiPost<{ data: any }>(`/api/trips/${tripId}/inspections`, payload);
}

export function uploadTripInspectionPhoto(tripId: string, file: File) {
  const formData = new FormData();
  formData.append("files", file);
  return apiPost<{ data: Array<{ url: string }> }>(`/api/trips/${tripId}/inspections/photos`, formData);
}

export function listTripInspections(tripId: string) {
  return apiGet<{ data: any[] }>(`/api/trips/${tripId}/inspections`);
}

export default {};
