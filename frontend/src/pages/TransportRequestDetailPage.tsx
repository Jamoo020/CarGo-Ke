import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getTransportRequest,
  getTransportRequestQuotes,
  selectQuote,
  cancelTransportRequest,
  getTrips,
  createPayment,
  confirmPayment,
  getTripPayment,
  createDispute,
} from "../lib/customer";
import PaymentMethodSelector, { PaymentMethod } from "../components/payment/PaymentMethodSelector";
import {
  TransportRequest,
  TransportRequestQuote,
  Trip,
  Payment,
  Dispute,
  DisputeCategory,
  DisputePriority,
} from "../types/customer";
import { ApiError } from "../types/auth";
import { listTripInspections, transitionTrip } from "../lib/driver";
import InspectionEvidenceGallery from "../components/trips/InspectionEvidenceGallery";
import {
  formatDateTime,
  formatDisplayName,
  formatDistance,
  formatDuration,
  formatLocation,
  formatReference,
  formatStatus,
  formatVehicle,
} from "../lib/presentation";
import { getStoredRouteLocationIssue } from "../lib/routeLocation";

const CANCELLABLE_STATUSES = ["REQUESTED", "QUOTING"];
const SELECTABLE_STATUSES = ["REQUESTED", "QUOTING"];
const DISPUTE_ELIGIBLE_STATUSES = [
  "BOOKED",
  "PICKUP_PENDING",
  "PICKUP_INSPECTION",
  "TRIP_START_PENDING",
  "TRIP_ACTIVE",
  "IN_TRANSIT",
  "DELIVERY_PENDING",
  "DELIVERED",
  "COMPLETED",
];
const TRIP_DISCOVERY_STATUSES = [
  "DRIVER_SELECTED",
  "PAYMENT_PENDING",
  "BOOKED",
  "PICKUP_PENDING",
  "PICKUP_INSPECTION",
  "TRIP_START_PENDING",
  "TRIP_ACTIVE",
  "IN_TRANSIT",
  "DELIVERY_PENDING",
  "DELIVERED",
  "COMPLETED",
  "DISPUTED",
  "CANCELLED",
];
const DISPUTE_CATEGORIES: DisputeCategory[] = [
  "VEHICLE_CONDITION",
  "DRIVER_CONDUCT",
  "PAYMENT",
  "FUEL",
  "DELIVERY",
  "DESTINATION",
  "DAMAGE",
  "OTHER",
];
const DISPUTE_PRIORITIES: DisputePriority[] = ["LOW", "NORMAL", "HIGH"];

export default function TransportRequestDetailPage() {
  const { requestId } = useParams();
  const [request, setRequest] = useState<TransportRequest | null>(null);
  const [quotes, setQuotes] = useState<TransportRequestQuote[]>([]);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [disputeDescription, setDisputeDescription] = useState("");
  const [disputeCategory, setDisputeCategory] = useState<DisputeCategory>("PAYMENT");
  const [disputePriority, setDisputePriority] = useState<DisputePriority>("NORMAL");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [isSubmittingDispute, setIsSubmittingDispute] = useState(false);
  const [showPaymentMethodSelector, setShowPaymentMethodSelector] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const [disputeError, setDisputeError] = useState<string | null>(null);
  const [disputeSuccess, setDisputeSuccess] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancellationError, setCancellationError] = useState<string | null>(null);
  const [selectingQuoteId, setSelectingQuoteId] = useState<string | null>(null);
  const [selectQuoteError, setSelectQuoteError] = useState<string | null>(null);
  const [quoteSelectionSuccess, setQuoteSelectionSuccess] = useState<string | null>(null);
  const [quoteConfirmation, setQuoteConfirmation] = useState<TransportRequestQuote | null>(null);
  const [expandedQuoteId, setExpandedQuoteId] = useState<string | null>(null);
  const [isDiscoveringTrip, setIsDiscoveringTrip] = useState(false);
  const [tripDiscoveryError, setTripDiscoveryError] = useState<string | null>(null);
  const [pickupInspection, setPickupInspection] = useState<any | null>(null);
  const [deliveryInspection, setDeliveryInspection] = useState<any | null>(null);
  const [inspectionLoading, setInspectionLoading] = useState(false);
  const [inspectionError, setInspectionError] = useState<string | null>(null);
  const [tripActionLoading, setTripActionLoading] = useState(false);
  const isDevelopmentMode = import.meta.env.DEV;

  async function loadData() {
    if (!requestId) return;

    setIsLoading(true);
    setError(null);

    try {
      const [requestResponse, quoteResponse] = await Promise.all([
        getTransportRequest(requestId),
        getTransportRequestQuotes(requestId),
      ]);

      const loadedRequest = requestResponse.data ?? null;
      setRequest(loadedRequest);
      setQuotes(quoteResponse.data ?? []);
      setError(null);
      setTrip(null);
      setPayment(null);
      setDispute(null);
      setDisputeError(null);
      setDisputeSuccess(null);
      setQuoteSelectionSuccess(null);
      setQuoteConfirmation(null);
      setExpandedQuoteId(null);

      if (loadedRequest && TRIP_DISCOVERY_STATUSES.includes(loadedRequest.status)) {
        await discoverTrip(requestId);
      }
    } catch (caughtError) {
      const apiError = caughtError as ApiError;
      setError(apiError.error ?? "Failed to load request");
      setRequest(null);
      setQuotes([]);
      setTrip(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!requestId) return;

    let isMounted = true;

    async function runLoad() {
      if (!isMounted) return;
      await loadData();
    }

    runLoad();

    return () => {
      isMounted = false;
    };
  }, [requestId]);

  async function loadTripPayment(tripId: string) {
    setPaymentError(null);
    setIsLoadingPayment(true);
    try {
      const paymentResponse = await getTripPayment(tripId);
      setPayment(paymentResponse.data);
    } catch (caughtError) {
      const apiError = caughtError as ApiError;
      if (apiError.status === "404") {
        setPayment(null);
      } else {
        setPaymentError(apiError.error ?? "Unable to load payment details.");
      }
    } finally {
      setIsLoadingPayment(false);
    }
  }

  async function loadTripInspections(tripId: string) {
    if (!tripId) return;

    setInspectionLoading(true);
    setInspectionError(null);

    try {
      const response = await listTripInspections(tripId);
      const inspections = response.data ?? [];
      setPickupInspection(inspections.find((inspection: any) => inspection.type === "PICKUP") ?? null);
      setDeliveryInspection(inspections.find((inspection: any) => inspection.type === "DELIVERY") ?? null);
    } catch (caughtError) {
      const apiError = caughtError as ApiError;
      setInspectionError(apiError.error ?? "Unable to load trip inspection details.");
      setPickupInspection(null);
      setDeliveryInspection(null);
    } finally {
      setInspectionLoading(false);
    }
  }

  async function discoverTrip(requestId: string) {
    setTripDiscoveryError(null);
    setIsDiscoveringTrip(true);
    try {
      const tripsResponse = await getTrips();
      const matchedTrip = tripsResponse.data.find(
        (currentTrip) =>
          currentTrip.transportRequest?.id === requestId ||
          currentTrip.transportRequestId === requestId,
      );
      setTrip(matchedTrip ?? null);

      if (matchedTrip) {
        await loadTripInspections(matchedTrip.id);
      } else {
        setPickupInspection(null);
        setDeliveryInspection(null);
      }

      if (matchedTrip?.status === "PAYMENT_PENDING") {
        await loadTripPayment(matchedTrip.id);
      } else {
        setPayment(null);
      }

      if (matchedTrip?.status !== "DISPUTED") {
        setDispute(null);
        setDisputeError(null);
        setDisputeSuccess(null);
      }
    } catch (caughtError) {
      const apiError = caughtError as ApiError;
      setTripDiscoveryError(apiError.error ?? "Unable to load trip details.");
      setTrip(null);
      setPayment(null);
      setDispute(null);
    } finally {
      setIsDiscoveringTrip(false);
    }
  }

  async function handleCreatePayment(paymentMethod?: PaymentMethod) {
    if (!trip) return;

    // If no payment method selected, show the selector
    if (!paymentMethod) {
      setShowPaymentMethodSelector(true);
      return;
    }

    setPaymentError(null);
    setPaymentSuccess(null);
    setIsPaying(true);
    setShowPaymentMethodSelector(false);

    try {
      const providerReference = paymentMethod.id?.trim()
        ? `${paymentMethod.type.toLowerCase()}_${paymentMethod.id.trim()}_${Date.now()}`
        : `${paymentMethod.type.toLowerCase()}_${Date.now()}`;

      const paymentResponse = await createPayment(trip.id, { providerReference });
      setPayment(paymentResponse.data);
      setPaymentSuccess("Payment record created. Awaiting trusted provider confirmation.");
    } catch (caughtError) {
      const apiError = caughtError as ApiError;
      let message = apiError.error ?? "Failed to initiate payment.";
      if (apiError.status === "400") {
        message = "Payment cannot be created for this trip at the moment.";
      } else if (apiError.status === "401") {
        message = "Authentication failed. Please log in again.";
      } else if (apiError.status === "403") {
        message = "You do not have permission to make this payment.";
      } else if (apiError.status === "404") {
        message = "Trip not found or payment cannot be created.";
      } else if (apiError.status === "409") {
        message = "A payment already exists for this trip.";
        await loadTripPayment(trip.id);
      }
      setPaymentError(message);
    } finally {
      setIsPaying(false);
    }
  }

  async function handleSimulateSuccessfulPayment() {
    if (!payment?.id) return;

    setPaymentError(null);
    setPaymentSuccess(null);
    setIsConfirmingPayment(true);

    try {
      const confirmedPayment = await confirmPayment(payment.id, {
        providerCallbackReference: `dev-confirm-${Date.now()}`,
      });
      setPayment(confirmedPayment.data);
      setPaymentSuccess("Simulation successful. The backend is processing the payment confirmation.");
      if (trip?.id) {
        await discoverTrip(requestId ?? trip.transportRequestId ?? trip.id);
      }
    } catch (caughtError) {
      const apiError = caughtError as ApiError;
      setPaymentError(apiError.error ?? "Unable to simulate this payment.");
    } finally {
      setIsConfirmingPayment(false);
    }
  }

  async function handleTripAction(action: "activateTrip" | "confirmDelivery") {
    if (!trip?.id) return;

    setTripActionLoading(true);
    setInspectionError(null);

    try {
      await transitionTrip(trip.id, action);
      await discoverTrip(requestId ?? trip.transportRequestId ?? trip.id);
    } catch (caughtError) {
      const apiError = caughtError as ApiError;
      setInspectionError(apiError.error ?? "Unable to update the trip status.");
    } finally {
      setTripActionLoading(false);
    }
  }

  async function handleCreateDispute() {
    if (!trip) return;

    setDisputeError(null);
    setDisputeSuccess(null);

    if (!disputeDescription.trim()) {
      setDisputeError("Description is required to open a dispute.");
      return;
    }

    setIsSubmittingDispute(true);

    try {
      const response = await createDispute(trip.id, {
        description: disputeDescription.trim(),
        category: disputeCategory,
        priority: disputePriority,
      });

      setDispute(response.data);
      setDisputeSuccess("Dispute opened successfully.");
      setTrip({ ...trip, status: "DISPUTED" });
      setRequest((currentRequest) =>
        currentRequest ? { ...currentRequest, status: "DISPUTED" } : currentRequest,
      );
    } catch (caughtError) {
      const apiError = caughtError as ApiError;
      let message = apiError.error ?? "Failed to open dispute.";
      if (apiError.status === "400") {
        message = "Please provide a valid dispute description and valid category/priority.";
      } else if (apiError.status === "401") {
        message = "Authentication failed. Please log in again.";
      } else if (apiError.status === "403") {
        message = "You do not have permission to open this dispute.";
      } else if (apiError.status === "404") {
        message = "Trip not found or dispute cannot be opened.";
      } else if (apiError.status === "409") {
        message = "A dispute already exists for this trip.";
      }
      setDisputeError(message);
    } finally {
      setIsSubmittingDispute(false);
    }
  }

  async function handleSelectQuote(quoteId: string) {
    if (!requestId) return;

    setSelectQuoteError(null);
    setQuoteSelectionSuccess(null);
    setSelectingQuoteId(quoteId);

    try {
      await selectQuote(quoteId);
      if (requestId) {
        const [nextRequest, nextQuotes] = await Promise.all([
          getTransportRequest(requestId),
          getTransportRequestQuotes(requestId),
        ]);
        setRequest(nextRequest.data ?? null);
        setQuotes(nextQuotes.data ?? []);
        setQuoteConfirmation(null);
        setQuoteSelectionSuccess("Quote accepted. The selected driver is moving forward to the trip flow.");
        setExpandedQuoteId(quoteId);
        await discoverTrip(requestId);
      }
    } catch (caughtError) {
      const apiError = caughtError as ApiError;
      let message = apiError.error ?? "Failed to select quote.";

      if (apiError.status === "400") {
        message = "This quote cannot be selected in the current request state.";
      } else if (apiError.status === "401") {
        message = "Authentication failed. Please log in again.";
      } else if (apiError.status === "403") {
        message = "You do not have permission to select this quote.";
      } else if (apiError.status === "404") {
        message = "Quote not found or the request no longer exists.";
      }

      setSelectQuoteError(message);
    } finally {
      setSelectingQuoteId(null);
    }
  }

  async function handleCancelRequest() {
    if (!requestId || !request) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this transport request?"
    );
    if (!confirmed) return;

    setIsCancelling(true);
    setCancellationError(null);

    try {
      const response = await cancelTransportRequest(requestId);
      setRequest(response.data ?? null);
    } catch (caughtError) {
      const apiError = caughtError as ApiError;
      let message = apiError.error ?? "Failed to cancel request";

      if (apiError.status === "400") {
        message = "Cannot cancel this request at its current status.";
      } else if (apiError.status === "401") {
        message = "Session expired. Please log in again.";
      } else if (apiError.status === "403") {
        message = "You do not have permission to cancel this request.";
      } else if (apiError.status === "404") {
        message = "Request not found.";
      }

      setCancellationError(message);
    } finally {
      setIsCancelling(false);
    }
  }

  function formatDate(dateString: string): string {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  }

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0,
    }).format(value);
  }

  function getStatusBadgeClass(status: string): string {
    return `status-badge status-${status.toLowerCase()}`;
  }

  function renderQuoteStatus(status: string) {
    return formatStatus(status);
  }

  if (!requestId) {
    return (
      <section className="screen-card">
        <h1>Request not found</h1>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="screen-card">
        <div className="quote-market-loading">
          <div className="quote-market-loading-header">
            <span className="skeleton skeleton-line short" />
            <span className="skeleton skeleton-line medium" />
          </div>

          <div className="quote-market-loading-summary">
            <span className="skeleton skeleton-box" />
            <span className="skeleton skeleton-box" />
            <span className="skeleton skeleton-box" />
          </div>

          <div className="quote-market-loading-grid">
            <span className="skeleton skeleton-card" />
            <span className="skeleton skeleton-card" />
            <span className="skeleton skeleton-card" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !request) {
    return (
      <section className="screen-card">
        {error ? (
          <div className="error-box">
            <strong>Error:</strong> {error}
            <div style={{ marginTop: "0.75rem" }}>
              <button type="button" className="primary-button small-button" onClick={() => loadData()}>
                Retry
              </button>
            </div>
          </div>
        ) : (
          <h1>Request not found</h1>
        )}
      </section>
    );
  }

  const selectedQuote = quotes.find((quote) => quote.status === "SELECTED") ?? null;
  const requestVehicleSummary = formatVehicle(request.vehicleDetail);
  const requestDistance = formatDistance(request.distanceMeters);
  const requestDuration = formatDuration(request.estimatedDurationSeconds);
  const requestRouteIsVerified = !getStoredRouteLocationIssue(request)
    && Boolean(request.routePolyline)
    && Number(request.distanceMeters) > 0
    && Number(request.estimatedDurationSeconds) > 0;
  const pickupLocation = formatLocation(request.pickupAddress || request.origin, request.pickupLatitude, request.pickupLongitude);
  const destinationLocation = formatLocation(request.destinationAddress || request.destination, request.destinationLatitude, request.destinationLongitude);

  const canCancel =
    request &&
    CANCELLABLE_STATUSES.includes(request.status);

  return (
    <section className="screen-card">
      <div className="page-header-row">
        <div>
          <p className="eyebrow">Trip details</p>
          <h1>{pickupLocation} → {destinationLocation}</h1>
        </div>
        <Link to="/customer/requests" className="secondary-link-button">
          Back to requests
        </Link>
      </div>

      {cancellationError ? (
        <div className="error-box">{cancellationError}</div>
      ) : null}

      <dl className="detail-list">
        <div>
          <dt>Request ID</dt>
          <dd className="detail-reference">{formatReference("request", request.id)}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>
            <span className={getStatusBadgeClass(request.status)}>
              {formatStatus(request.status)}
            </span>
          </dd>
        </div>
        <div>
          <dt>Created</dt>
          <dd>{formatDate(request.createdAt)}</dd>
        </div>
        <div>
          <dt>Trip date</dt>
          <dd>{formatDateTime(request.travelDateTime)}</dd>
        </div>
        <div>
          <dt>Pickup Location</dt>
          <dd>{pickupLocation}</dd>
        </div>
        <div>
          <dt>Destination Location</dt>
          <dd>{destinationLocation}</dd>
        </div>
        <div>
          <dt>Distance</dt>
          <dd>{requestRouteIsVerified ? requestDistance : "Driving distance unavailable"}</dd>
        </div>
        <div>
          <dt>Estimated Duration</dt>
          <dd>{requestRouteIsVerified ? requestDuration : "Driving duration unavailable"}</dd>
        </div>
        <div>
          <dt>Notes</dt>
          <dd>{request.notes ?? "-"}</dd>
        </div>
        <div>
          <dt>Vehicle</dt>
          <dd>
            {request.vehicleDetail ? (
              <div>
                <div style={{ fontWeight: 600 }}>{request.vehicleDetail.make} {request.vehicleDetail.model}</div>
                <div style={{ color: '#555', marginTop: 4 }}>{request.vehicleDetail.vehicleType ? `${request.vehicleDetail.vehicleType} • ${request.vehicleDetail.year}` : `Model: ${request.vehicleDetail.model} • ${request.vehicleDetail.year}`}</div>
                <div style={{ color: '#666', marginTop: 4 }}>
                  {request.vehicleDetail.engineCC ? `${request.vehicleDetail.engineCC.toLocaleString()} CC` : 'Engine CC: Not provided'}
                  {request.vehicleDetail.color ? ` • ${request.vehicleDetail.color}` : ''}
                  {request.vehicleDetail.capacity ? ` • Capacity: ${request.vehicleDetail.capacity}` : ''}
                </div>
              </div>
            ) : (
              <span>Vehicle details not available</span>
            )}
          </dd>
        </div>
      </dl>

      {selectQuoteError ? (
        <div className="error-box">{selectQuoteError}</div>
      ) : null}

      {tripDiscoveryError ? (
        <div className="error-box">{tripDiscoveryError}</div>
      ) : null}

      {quoteSelectionSuccess ? (
        <div className="success-box">{quoteSelectionSuccess}</div>
      ) : null}

      {quoteConfirmation ? (
        <div className="quote-confirmation-panel">
          <div className="quote-confirmation-header">
            <div>
              <span className="eyebrow">Confirm selection</span>
              <h2>Review your chosen driver</h2>
            </div>
          </div>

          <div className="quote-confirmation-grid">
            <div>
              <span className="quote-market-label">Selected driver</span>
              <strong>{quoteConfirmation.driver?.user?.fullName ?? "Driver"}</strong>
            </div>
            <div>
              <span className="quote-market-label">Vehicle</span>
              <strong>{requestVehicleSummary}</strong>
            </div>
            <div>
              <span className="quote-market-label">Driver transport fee</span>
              <strong>{formatCurrency(quoteConfirmation.amount)}</strong>
            </div>
            <div>
              <span className="quote-market-label">Fuel budget</span>
              <strong>{formatCurrency(Number(quoteConfirmation.fuelBudget ?? 0))}</strong>
            </div>
            <div>
              <span className="quote-market-label">CarGo service fee</span>
              <strong>{formatCurrency((Number(quoteConfirmation.amount) + Number(quoteConfirmation.fuelBudget ?? 0)) * 0.07)}</strong>
            </div>
            <div>
              <span className="quote-market-label">Total customer payment</span>
              <strong>{formatCurrency((Number(quoteConfirmation.amount) + Number(quoteConfirmation.fuelBudget ?? 0)) * 1.07)}</strong>
            </div>
            <div>
              <span className="quote-market-label">Route</span>
              <strong>{requestDistance ?? "Route pending"}</strong>
              {requestDuration ? <small>{requestDuration}</small> : null}
            </div>
          </div>

          <div className="quote-confirmation-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => setQuoteConfirmation(null)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={() => handleSelectQuote(quoteConfirmation.id)}
              disabled={Boolean(selectingQuoteId)}
            >
              {selectingQuoteId === quoteConfirmation.id ? "Confirming..." : "Confirm quote"}
            </button>
          </div>
        </div>
      ) : null}

      {canCancel ? (
        <div className="action-panel">
          <button
            type="button"
            className="danger-button"
            onClick={handleCancelRequest}
            disabled={isCancelling}
          >
            {isCancelling ? "Cancelling..." : "Cancel Request"}
          </button>
        </div>
      ) : null}

      <div className="quote-market-summary">
        <div className="quote-summary-card">
          <span className="eyebrow">Request summary</span>
          <div className="quote-summary-route">
            <strong>{pickupLocation}</strong>
            <span className="route-arrow">↓</span>
            <strong>{destinationLocation}</strong>
          </div>
          <div className="quote-summary-details">
            <div>
              <span className="quote-market-label">Distance</span>
              <strong>{requestRouteIsVerified ? requestDistance : "Driving distance unavailable"}</strong>
            </div>
            <div>
              <span className="quote-market-label">Estimated duration</span>
              <strong>{requestRouteIsVerified ? requestDuration : "Driving duration unavailable"}</strong>
            </div>
            <div>
              <span className="quote-market-label">Vehicle</span>
              <strong>{requestVehicleSummary}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="quote-market-header-row">
        <div>
          <span className="eyebrow">Available transport quotes</span>
          <h2>{quotes.length > 0 ? "Compare driver offers" : "No quotes yet"}</h2>
        </div>
        {selectedQuote ? (
          <span className="quote-badge quote-badge-selected">Accepted</span>
        ) : null}
      </div>

      {quotes.length === 0 ? (
        <div className="empty-state quote-empty-state">
          <p>Drivers have not submitted quotes for this request yet.</p>
          <small>Check back after the request is published to the market.</small>
        </div>
      ) : (
        <div className="quote-market-grid">
          {quotes.map((quote) => {
            const isSelected = quote.status === "SELECTED";
            const isRejected = quote.status === "REJECTED";
            const isPending = quote.status === "PENDING";
            const isSelecting = selectingQuoteId === quote.id;
            const showSelect = isPending && SELECTABLE_STATUSES.includes(request.status);
            const isExpanded = expandedQuoteId === quote.id;

            return (
              <article
                key={quote.id}
                className={`quote-market-card ${isSelected ? "quote-market-card-selected" : ""} ${isRejected ? "quote-market-card-rejected" : ""} ${isPending ? "quote-market-card-pending" : ""}`}
              >
                <div className="quote-market-card-header">
                  <div>
                    <span className="quote-market-label">Driver</span>
                    <h3>{quote.driver?.user?.fullName ?? "Driver"}</h3>
                  </div>
                  <span className={`status-badge status-${quote.status.toLowerCase()}`}>
                    {renderQuoteStatus(quote.status)}
                  </span>
                </div>

                <div className="quote-market-card-body">
                  <div className="quote-market-vehicle">
                    <span className="quote-market-label">Vehicle</span>
                    <strong>{requestVehicleSummary}</strong>
                  </div>

                  <div className="quote-market-price">
                    <span className="quote-market-label">Transport fee</span>
                    <strong>{formatCurrency(quote.amount)}</strong>
                  </div>

                  <div className="quote-market-price">
                    <span className="quote-market-label">Fuel budget</span>
                    <strong>{formatCurrency(Number(quote.fuelBudget ?? 0))}</strong>
                  </div>

                  <div className="quote-market-price">
                    <span className="quote-market-label">CarGo service fee</span>
                    <strong>{formatCurrency(((Number(quote.amount) + Number(quote.fuelBudget ?? 0)) * 0.07))}</strong>
                  </div>

                  <div className="quote-market-price">
                    <span className="quote-market-label">Customer total</span>
                    <strong>{formatCurrency(((Number(quote.amount) + Number(quote.fuelBudget ?? 0)) * 1.07))}</strong>
                  </div>

                  <div className="quote-market-route">
                    <span className="quote-market-label">Route / estimate</span>
                    <strong>{requestDistance ?? "Route pending"}</strong>
                    {requestDuration ? <small>{requestDuration}</small> : null}
                  </div>

                  {isExpanded ? (
                    <div className="quote-market-expanded">
                      {quote.message ? (
                        <div>
                          <span className="quote-market-label">Driver note</span>
                          <p>{quote.message}</p>
                        </div>
                      ) : null}
                      <div>
                        <span className="quote-market-label">Submitted</span>
                        <p>{formatDate(quote.createdAt)}</p>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="quote-market-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setExpandedQuoteId(isExpanded ? null : quote.id)}
                  >
                    {isExpanded ? "Hide details" : "View details"}
                  </button>

                  {showSelect ? (
                    <button
                      type="button"
                      className="primary-button small-button"
                      onClick={() => setQuoteConfirmation(quote)}
                      disabled={Boolean(selectingQuoteId)}
                    >
                      {isSelecting ? "Accepting..." : "Accept quote"}
                    </button>
                  ) : isSelected ? (
                    <span className="quote-badge quote-badge-selected">Accepted</span>
                  ) : isRejected ? (
                    <span className="quote-badge quote-badge-rejected">Rejected</span>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {(trip || request.status === "DRIVER_SELECTED") && (
        <section className="trip-summary-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <h2>Trip</h2>
            {trip?.id ? (
              <Link to={`/customer/trips/${trip.id}`} className="primary-link-button">
                Open trip tracking
              </Link>
            ) : null}
          </div>
          {isDiscoveringTrip ? (
            <p className="status-text">Discovering your trip…</p>
          ) : trip ? (
            <>
              <div className="detail-list">
                <div>
                  <dt>Trip reference</dt>
                  <dd className="detail-reference">{formatReference("trip", trip.id)}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>
                    <span className={getStatusBadgeClass(trip.status)}>{formatStatus(trip.status)}</span>
                  </dd>
                </div>
                <div>
                  <dt>Booking amount</dt>
                  <dd>KSh {trip.bookingAmount}</dd>
                </div>
                <div>
                  <dt>Driver fee</dt>
                  <dd>KSh {trip.driverFee}</dd>
                </div>
                <div>
                  <dt>Fuel budget</dt>
                  <dd>KSh {trip.fuelBudget ?? 0}</dd>
                </div>
                <div>
                  <dt>CarGo fee</dt>
                  <dd>KSh {trip.carGoFee ?? 0}</dd>
                </div>
                <div>
                  <dt>Refund amount</dt>
                  <dd>KSh {trip.refundAmount}</dd>
                </div>
                <div>
                  <dt>Origin</dt>
                  <dd>{formatLocation(trip.transportRequest?.pickupAddress || trip.transportRequest?.origin || request.origin, trip.transportRequest?.pickupLatitude, trip.transportRequest?.pickupLongitude)}</dd>
                </div>
                <div>
                  <dt>Destination</dt>
                  <dd>{formatLocation(trip.transportRequest?.destinationAddress || trip.transportRequest?.destination || request.destination, trip.transportRequest?.destinationLatitude, trip.transportRequest?.destinationLongitude)}</dd>
                </div>
                <div>
                  <dt>Created</dt>
                  <dd>{formatDate(trip.createdAt)}</dd>
                </div>
                <div>
                  <dt>Updated</dt>
                  <dd>{formatDate(trip.updatedAt)}</dd>
                </div>
              </div>

              {trip.status === "TRIP_START_PENDING" ? (
                <div className="payment-card" style={{ marginTop: 20 }}>
                  <h3>Review & Activate Trip</h3>
                  <p style={{ margin: "0 0 1rem", color: "#465467" }}>
                    The driver has completed the pickup inspection and this trip is waiting for your activation.
                  </p>

                  <div style={{ display: "grid", gap: 16 }}>
                    <div style={{ borderRadius: 16, border: "1px solid #dfe6ee", background: "#fff", overflow: "hidden" }}>
                      <div style={{ padding: "12px 16px", borderBottom: "1px solid #eef2f7", background: "#f8fafc" }}>
                        <strong>Pickup inspection details</strong>
                      </div>
                      <div style={{ padding: 16 }}>
                        {inspectionLoading ? (
                          <p className="status-text">Loading inspection details…</p>
                        ) : pickupInspection ? (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
                            <div>
                              <div className="job-detail-label">Odometer</div>
                              <div style={{ fontWeight: 700 }}>{pickupInspection.odometer ?? "Not provided"}</div>
                            </div>
                            <div>
                              <div className="job-detail-label">Fuel level</div>
                              <div style={{ fontWeight: 700 }}>{pickupInspection.fuelLevel ?? "Not provided"}</div>
                            </div>
                            <div>
                              <div className="job-detail-label">Vehicle condition</div>
                              <div style={{ fontWeight: 700 }}>{pickupInspection.vehicleCondition ?? "Not provided"}</div>
                            </div>
                            <div>
                              <div className="job-detail-label">Handover confirmation</div>
                              <div style={{ fontWeight: 700 }}>{pickupInspection.handoverConfirmed ? "Confirmed" : "Not confirmed"}</div>
                            </div>
                            {pickupInspection.damageNotes ? (
                              <div style={{ gridColumn: "1 / -1" }}>
                                <div className="job-detail-label">Damage notes</div>
                                <div>{pickupInspection.damageNotes}</div>
                              </div>
                            ) : null}
                            {pickupInspection.observations ? (
                              <div style={{ gridColumn: "1 / -1" }}>
                                <div className="job-detail-label">Observations</div>
                                <div>{pickupInspection.observations}</div>
                              </div>
                            ) : null}
                            <div style={{ gridColumn: "1 / -1" }}>
                              <div className="job-detail-label">Evidence photos</div>
                              <div style={{ marginTop: 8 }}>
                                <InspectionEvidenceGallery
                                  photoUrls={pickupInspection.photoUrls}
                                  title="Pickup inspection"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div style={{ padding: 16, borderRadius: 16, background: "#f8fafc", border: "1px solid #dfe6ee" }}>
                            Pickup inspection details are not available yet.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {inspectionError ? <div className="error-box" style={{ marginTop: 16 }}>{inspectionError}</div> : null}

                  <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      className="primary-button"
                      onClick={() => handleTripAction("activateTrip")}
                      disabled={tripActionLoading}
                    >
                      {tripActionLoading ? "Activating trip…" : "Activate Trip"}
                    </button>
                  </div>
                </div>
              ) : null}

              {trip.status === "DELIVERY_PENDING" ? (
                <div className="payment-card" style={{ marginTop: 20 }}>
                  <h3>Delivery Review</h3>
                  <p style={{ margin: "0 0 1rem", color: "#465467" }}>
                    The driver has completed the delivery inspection and this trip is waiting for your confirmation.
                  </p>

                  <div style={{ display: "grid", gap: 16 }}>
                    <div style={{ borderRadius: 16, border: "1px solid #dfe6ee", background: "#fff", overflow: "hidden" }}>
                      <div style={{ padding: "12px 16px", borderBottom: "1px solid #eef2f7", background: "#f8fafc" }}>
                        <strong>Delivery inspection details</strong>
                      </div>
                      <div style={{ padding: 16 }}>
                        {inspectionLoading ? (
                          <p className="status-text">Loading delivery evidence…</p>
                        ) : deliveryInspection ? (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
                            <div>
                              <div className="job-detail-label">Odometer</div>
                              <div style={{ fontWeight: 700 }}>{deliveryInspection.odometer ?? "Not provided"}</div>
                            </div>
                            <div>
                              <div className="job-detail-label">Fuel level</div>
                              <div style={{ fontWeight: 700 }}>{deliveryInspection.fuelLevel ?? "Not provided"}</div>
                            </div>
                            <div>
                              <div className="job-detail-label">Vehicle condition</div>
                              <div style={{ fontWeight: 700 }}>{deliveryInspection.vehicleCondition ?? "Not provided"}</div>
                            </div>
                            <div>
                              <div className="job-detail-label">Handover confirmation</div>
                              <div style={{ fontWeight: 700 }}>{deliveryInspection.handoverConfirmed ? "Confirmed" : "Not confirmed"}</div>
                            </div>
                            {deliveryInspection.damageNotes ? (
                              <div style={{ gridColumn: "1 / -1" }}>
                                <div className="job-detail-label">Damage notes</div>
                                <div>{deliveryInspection.damageNotes}</div>
                              </div>
                            ) : null}
                            {deliveryInspection.observations ? (
                              <div style={{ gridColumn: "1 / -1" }}>
                                <div className="job-detail-label">Observations</div>
                                <div>{deliveryInspection.observations}</div>
                              </div>
                            ) : null}
                            <div style={{ gridColumn: "1 / -1" }}>
                              <div className="job-detail-label">Evidence photos</div>
                              <div style={{ marginTop: 8 }}>
                                <InspectionEvidenceGallery
                                  photoUrls={deliveryInspection.photoUrls}
                                  title="Delivery inspection"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div style={{ padding: 16, borderRadius: 16, background: "#f8fafc", border: "1px solid #dfe6ee" }}>
                            Delivery inspection details are not available yet.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {inspectionError ? <div className="error-box" style={{ marginTop: 16 }}>{inspectionError}</div> : null}

                  <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      className="primary-button"
                      onClick={() => handleTripAction("confirmDelivery")}
                      disabled={tripActionLoading}
                    >
                      {tripActionLoading ? "Confirming delivery…" : "Confirm Delivery"}
                    </button>
                  </div>
                </div>
              ) : null}

              {trip.status === "PAYMENT_PENDING" ? (
                <div className="payment-card">
                  <h3>Payment</h3>
                  <div className="detail-list">
                    <div>
                      <dt>Transport request</dt>
                      <dd>{formatReference("request", request.id)}</dd>
                    </div>
                    <div>
                      <dt>Origin</dt>
                      <dd>{formatLocation(trip.transportRequest?.pickupAddress || trip.transportRequest?.origin || request.origin, trip.transportRequest?.pickupLatitude, trip.transportRequest?.pickupLongitude)}</dd>
                    </div>
                    <div>
                      <dt>Destination</dt>
                      <dd>{formatLocation(trip.transportRequest?.destinationAddress || trip.transportRequest?.destination || request.destination, trip.transportRequest?.destinationLatitude, trip.transportRequest?.destinationLongitude)}</dd>
                    </div>
                    <div>
                      <dt>Selected driver</dt>
                      <dd>{formatDisplayName(quotes.find((quote) => quote.status === "SELECTED")?.driver?.user?.fullName, "Driver name not provided")}</dd>
                    </div>
                    <div>
                      <dt>Booking amount</dt>
                      <dd className="payment-amount">KSh {trip.bookingAmount}</dd>
                    </div>
                  </div>

                  {paymentError ? <div className="error-box">Payment unsuccessful. {paymentError}</div> : null}
                  {paymentSuccess ? <div className="success-box">✓ Payment successful. {paymentSuccess}</div> : null}

                  <div className="payment-checkout-shell">
                    <div className="payment-summary-card">
                      <span className="eyebrow">Trip summary</span>
                      <div className="payment-summary-route">
                        <strong>{formatLocation(trip.transportRequest?.pickupAddress || trip.transportRequest?.origin || request.origin, trip.transportRequest?.pickupLatitude, trip.transportRequest?.pickupLongitude)}</strong>
                        <span className="route-arrow">↓</span>
                        <strong>{formatLocation(trip.transportRequest?.destinationAddress || trip.transportRequest?.destination || request.destination, trip.transportRequest?.destinationLatitude, trip.transportRequest?.destinationLongitude)}</strong>
                      </div>
                      <div className="payment-summary-grid">
                        <div>
                          <span className="quote-market-label">Distance</span>
                          <strong>{requestRouteIsVerified ? requestDistance : "Driving distance unavailable"}</strong>
                        </div>
                        <div>
                          <span className="quote-market-label">Duration</span>
                          <strong>{requestRouteIsVerified ? requestDuration : "Driving duration unavailable"}</strong>
                        </div>
                        <div>
                          <span className="quote-market-label">Vehicle</span>
                          <strong>{requestVehicleSummary}</strong>
                        </div>
                        <div>
                          <span className="quote-market-label">Driver</span>
                          <strong>{formatDisplayName(quotes.find((quote) => quote.status === "SELECTED")?.driver?.user?.fullName, "Driver name not provided")}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="payment-method-panel">
                      <div className="payment-method-header">
                        <span className="eyebrow">Payment</span>
                        <span className={`status-badge ${payment?.status ? `status-${String(payment.status).toLowerCase()}` : "status-payment_pending"}`}>
                          {formatStatus(payment?.status ?? "PAYMENT_PENDING")}
                        </span>
                      </div>

                      {payment ? (
                        <div className="payment-status-box">
                          <div className="payment-amount-row">
                            <span>Transport fare</span>
                            <strong>KSh {payment.amount}</strong>
                          </div>
                          <div className="payment-meta-row">
                            <span>Payment reference</span>
                            <strong>{formatReference("payment", payment.id)}</strong>
                          </div>
                          <div className="payment-meta-row">
                            <span>Trip reference</span>
                            <strong>{formatReference("trip", trip.id)}</strong>
                          </div>

                          {payment.status === "PENDING" ? (
                            <>
                              <p className="status-text">Waiting for trusted provider confirmation.</p>

                              {isDevelopmentMode ? (
                                <button
                                  type="button"
                                  className="secondary-button"
                                  onClick={handleSimulateSuccessfulPayment}
                                  disabled={isConfirmingPayment}
                                  style={{ marginTop: "0.75rem" }}
                                >
                                  {isConfirmingPayment ? "Processing simulation…" : "Simulate Successful Payment"}
                                </button>
                              ) : null}
                            </>
                          ) : null}
                        </div>
                      ) : (
                        <div className="payment-method-stack">
                          <div className="payment-amount-row highlight">
                            <span>Fare</span>
                            <strong>KSh {trip.bookingAmount}</strong>
                          </div>
                          <div className="payment-method-cta-row">
                            <span className="quote-market-label">Payment method</span>
                            <span className="payment-choice-pill">M-Pesa</span>
                          </div>
                          <button
                            type="button"
                            className="primary-button payment-primary-button"
                            onClick={() => handleCreatePayment()}
                            disabled={isPaying || isLoadingPayment}
                          >
                            {isPaying ? "Processing payment…" : `Pay KSh ${trip.bookingAmount}`}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {showPaymentMethodSelector && (
                    <PaymentMethodSelector
                      onSelect={(method) => handleCreatePayment(method)}
                      onCancel={() => setShowPaymentMethodSelector(false)}
                      isLoading={isPaying}
                    />
                  )}

                  {isLoadingPayment ? (
                    <p className="status-text">Loading payment details…</p>
                  ) : null}
                </div>
              ) : null}

              {(DISPUTE_ELIGIBLE_STATUSES.includes(trip.status) || trip.status === "DISPUTED") && (
                <div className="dispute-card">
                  <h3>Dispute</h3>

                  {disputeError ? <div className="error-box">{disputeError}</div> : null}
                  {disputeSuccess ? <div className="success-box">{disputeSuccess}</div> : null}

                  {dispute ? (
                    <div className="detail-list dispute-info">
                      <div>
                        <dt>Dispute ID</dt>
                        <dd>{formatReference("dispute", dispute.id)}</dd>
                      </div>
                      <div>
                        <dt>Status</dt>
                        <dd>{formatStatus(dispute.status)}</dd>
                      </div>
                      <div>
                        <dt>Category</dt>
                        <dd>{dispute.category ? formatStatus(dispute.category) : "Not provided"}</dd>
                      </div>
                      <div>
                        <dt>Priority</dt>
                        <dd>{formatStatus(dispute.priority ?? "NORMAL")}</dd>
                      </div>
                      <div>
                        <dt>Description</dt>
                        <dd>{dispute.description ?? "-"}</dd>
                      </div>
                      {dispute.resolutionType ? (
                        <div>
                          <dt>Resolution type</dt>
                          <dd>{formatStatus(dispute.resolutionType)}</dd>
                        </div>
                      ) : null}
                      {dispute.resolutionAmount !== undefined && dispute.resolutionAmount !== null ? (
                        <div>
                          <dt>Resolution amount</dt>
                          <dd>KSh {dispute.resolutionAmount}</dd>
                        </div>
                      ) : null}
                      {dispute.resolutionSummary ? (
                        <div>
                          <dt>Resolution summary</dt>
                          <dd>{dispute.resolutionSummary}</dd>
                        </div>
                      ) : null}
                      {dispute.resolvedAt ? (
                        <div>
                          <dt>Resolved</dt>
                          <dd>{formatDate(dispute.resolvedAt)}</dd>
                        </div>
                      ) : null}
                    </div>
                  ) : trip.status === "DISPUTED" ? (
                    <p className="status-text">
                      A dispute is active for this trip. Contact support for details.
                    </p>
                  ) : (
                    <form
                      className="form-card"
                      onSubmit={(event) => {
                        event.preventDefault();
                        handleCreateDispute();
                      }}
                    >
                      <label>
                        Description
                        <textarea
                          value={disputeDescription}
                          onChange={(event) => setDisputeDescription(event.target.value)}
                          rows={4}
                        />
                      </label>
                      <label>
                        Category
                        <select
                          value={disputeCategory}
                          onChange={(event) => setDisputeCategory(event.target.value as DisputeCategory)}
                        >
                          {DISPUTE_CATEGORIES.map((option) => (
                            <option key={option} value={option}>
                              {option.split("_").join(" ")}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Priority
                        <select
                          value={disputePriority}
                          onChange={(event) => setDisputePriority(event.target.value as DisputePriority)}
                        >
                          {DISPUTE_PRIORITIES.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>
                      <div className="action-panel">
                        <button
                          type="submit"
                          className="primary-button"
                          disabled={isSubmittingDispute}
                        >
                          {isSubmittingDispute ? "Opening dispute…" : "Open dispute"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </>
          ) : (
            <p className="status-text">Booking created; trip details are not available yet.</p>
          )}
        </section>
      )}
    </section>
  );
}
