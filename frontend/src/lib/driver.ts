import { apiGet, apiPost } from "./api";
import {
  TransportRequestQuoteResponse,
  TripQueryResponse,
  TripDetailResponse,
  TransportRequestQuote,
} from "../types/customer";

export function listMyQuotes() {
  return apiGet<TransportRequestQuoteResponse>("/api/drivers/me/quotes");
}

export function createQuote(transportRequestId: string, payload: { amount: number; message?: string }) {
  return apiPost<{ data: TransportRequestQuote }>(`/api/transport-requests/${transportRequestId}/quotes`, payload);
}

export function listTrips() {
  return apiGet<TripQueryResponse>("/api/trips");
}

export function getTrip(tripId: string) {
  return apiGet<TripDetailResponse>(`/api/trips/${tripId}`);
}

export function transitionTrip(tripId: string, action: string, payload: any = {}) {
  return apiPost<{ data: any }>(`/api/trips/${tripId}/transitions`, { action, ...payload });
}

export default {};
