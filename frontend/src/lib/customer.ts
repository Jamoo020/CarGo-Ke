import { apiGet, apiPost } from "./api";
import {
  TransportRequest,
  TransportRequestCreatePayload,
  TransportRequestDetailResponse,
  TransportRequestQueryResponse,
  TransportRequestQuote,
  TransportRequestQuoteResponse,
  Trip,
  TripQueryResponse,
  TripDetailResponse,
  PaymentResponse,
  TripPaymentResponse,
  DisputeResponse,
} from "../types/customer";

export function getTransportRequests() {
  return apiGet<TransportRequestQueryResponse>("/api/transport-requests");
}

export function createTransportRequest(payload: TransportRequestCreatePayload) {
  return apiPost<TransportRequestDetailResponse>("/api/transport-requests", payload);
}

export function getTransportRequest(id: string) {
  return apiGet<TransportRequestDetailResponse>(`/api/transport-requests/${id}`);
}

export function cancelTransportRequest(id: string) {
  return apiPost<TransportRequestDetailResponse>(`/api/transport-requests/${id}/cancel`, {});
}

export function getTransportRequestQuotes(transportRequestId: string) {
  return apiGet<TransportRequestQuoteResponse>(`/api/transport-requests/${transportRequestId}/quotes`);
}

export function selectQuote(quoteId: string) {
  return apiPost<{ data: TransportRequestQuote }>(`/api/quotes/${quoteId}/select`, {});
}

export function getTrips() {
  return apiGet<TripQueryResponse>("/api/trips");
}

export function getTrip(tripId: string) {
  return apiGet<TripDetailResponse>(`/api/trips/${tripId}`);
}

export function createPayment(tripId: string, payload: { providerReference?: string }) {
  return apiPost<PaymentResponse>(`/api/trips/${tripId}/payments`, payload);
}

export function getTripPayment(tripId: string) {
  return apiGet<TripPaymentResponse>(`/api/trips/${tripId}/payments`);
}

export function createDispute(tripId: string, payload: { description: string; category?: string; priority?: string }) {
  return apiPost<DisputeResponse>(`/api/trips/${tripId}/disputes`, payload);
}

export function getDispute(disputeId: string) {
  return apiGet<DisputeResponse>(`/api/disputes/${disputeId}`);
}
