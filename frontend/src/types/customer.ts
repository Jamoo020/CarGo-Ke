export type TransportRequestStatus =
  | "REQUESTED"
  | "QUOTING"
  | "DRIVER_SELECTED"
  | "PAYMENT_PENDING"
  | "BOOKED"
  | "PICKUP_PENDING"
  | "PICKUP_INSPECTION"
  | "TRIP_START_PENDING"
  | "TRIP_ACTIVE"
  | "IN_TRANSIT"
  | "DELIVERY_PENDING"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "DISPUTED";

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
