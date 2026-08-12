export type TransportRequestStatus =
  | "REQUESTED"
  | "QUOTING"
  | "BOOKED"
  | "IN_TRANSIT"
  | "COMPLETED"
  | "CANCELLED";

export interface TransportRequest {
  id: string;
  customerId: string;
  authorizedRepresentativeId?: string | null;
  vehicleDetailId: string;
  origin: string;
  destination: string;
  status: TransportRequestStatus | string;
  createdAt: string;
  updatedAt: string;
}

export interface TransportRequestQuoteDriver {
  id: string;
  user: {
    id: string;
    fullName: string | null;
    role: string;
  };
}

export interface TransportRequestQuote {
  id: string;
  transportRequestId: string;
  driverId: string;
  amount: number;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  driver?: TransportRequestQuoteDriver;
}

export interface TransportRequestQueryResponse {
  data: TransportRequest[];
}

export interface TransportRequestDetailResponse {
  data: TransportRequest;
}

export interface TransportRequestQuoteResponse {
  data: TransportRequestQuote[];
}

export interface TransportRequestCreatePayload {
  origin: string;
  destination: string;
  vehicleDetailId: string;
  customerId?: string;
}
