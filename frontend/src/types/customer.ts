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

export type TripStatus = TransportRequestStatus;

export type QuoteStatus = "PENDING" | "SELECTED" | "REJECTED" | string;

export interface TransportRequest {
  id: string;
  customerId: string;
  authorizedRepresentativeId?: string | null;
  vehicleDetailId: string;
  vehicleDetail?: {
    make: string;
    model: string;
    year: number;
    color?: string | null;
    engineCC?: number | null;
    vehicleType?: string | null;
    capacity?: number | null;
  } | null;
  origin: string;
  destination: string;
  travelDateTime?: string | null;
  notes?: string | null;
  pickupAddress?: string | null;
  pickupLatitude?: number | null;
  pickupLongitude?: number | null;
  destinationAddress?: string | null;
  destinationLatitude?: number | null;
  destinationLongitude?: number | null;
  distanceMeters?: number | null;
  estimatedDurationSeconds?: number | null;
  routePolyline?: string | null;
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
  fuelBudget?: number | null;
  message: string;
  status: QuoteStatus | string;
  createdAt: string;
  updatedAt: string;
  driver?: TransportRequestQuoteDriver;
}

export interface Trip {
  id: string;
  transportRequestId: string;
  customerId?: string | null;
  authorizedRepresentativeId?: string | null;
  driverId: string;
  vehicleDetailId: string;
  status: TripStatus | string;
  bookingAmount: number;
  driverFee: number;
  fuelBudget?: number | null;
  carGoFee?: number | null;
  driverAmountReleased: number;
  driverAmountRemaining: number;
  driverCompletionConfirmedAt?: string | null;
  driverCompletionConfirmedById?: string | null;
  customerCompletionConfirmedAt?: string | null;
  customerCompletionConfirmedById?: string | null;
  tripWallet?: {
    driverCompensationReleased: number;
    driverCompensationRemaining: number;
    releaseAccountingVersion: number;
    fuelAccountingStatus: string;
  } | null;
  refundAmount: number;
  createdAt: string;
  updatedAt: string;
  customer?: { fullName: string | null } | null;
  driver?: { user?: { fullName: string | null } | null } | null;
  transportRequest?: TransportRequest | null;
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

export interface TripQueryResponse {
  data: Trip[];
}

export interface TripDetailResponse {
  data: Trip;
}

export type PaymentStatus = "PENDING" | "CONFIRMED" | "FAILED" | string;

export interface Payment {
  id: string;
  tripId: string;
  customerId: string;
  amount: number;
  status: PaymentStatus | string;
  providerReference?: string | null;
  providerCallbackReference?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentResponse {
  data: Payment;
}

export interface TripPaymentResponse {
  data: Payment;
}

export type DisputeStatus = "OPEN" | "UNDER_REVIEW" | "RESOLVED" | "CLOSED" | string;
export type DisputeCategory =
  | "VEHICLE_CONDITION"
  | "DRIVER_CONDUCT"
  | "PAYMENT"
  | "FUEL"
  | "DELIVERY"
  | "DESTINATION"
  | "DAMAGE"
  | "OTHER"
  | string;
export type DisputePriority = "LOW" | "NORMAL" | "HIGH" | string;

export interface Dispute {
  id: string;
  tripId: string;
  customerId: string;
  raisedById?: string | null;
  raisedByRole?: string | null;
  description?: string | null;
  category?: DisputeCategory | null;
  priority?: DisputePriority | null;
  status: DisputeStatus | string;
  resolutionType?: string | null;
  resolutionAmount?: number | null;
  resolutionSummary?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DisputeResponse {
  data: Dispute;
}

export interface TransportRequestCreatePayload {
  origin: string;
  destination: string;
  pickupAddress: string;
  pickupLatitude: number;
  pickupLongitude: number;
  destinationAddress: string;
  destinationLatitude: number;
  destinationLongitude: number;
  distanceMeters?: number;
  estimatedDurationSeconds?: number;
  routePolyline?: string;
  vehicleDetailId?: string;
  customerId?: string;
  make?: string;
  model?: string;
  year?: number;
  registrationNumber?: string;
  color?: string;
  engineCC?: number;
  vehicleType?: string;
  capacity?: number;
  travelDateTime?: string;
  notes?: string;
}
