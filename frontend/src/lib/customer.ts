import { apiGet, apiPost } from "./api";
import { TransportRequest, TransportRequestCreatePayload, TransportRequestDetailResponse, TransportRequestQueryResponse, TransportRequestQuote, TransportRequestQuoteResponse } from "../types/customer";

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
