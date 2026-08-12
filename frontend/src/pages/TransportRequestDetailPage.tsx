import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getTransportRequest,
  getTransportRequestQuotes,
  selectQuote,
  cancelTransportRequest,
  getTrips,
  createPayment,
  getTripPayment,
  createDispute,
} from "../lib/customer";
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
  const [isSubmittingDispute, setIsSubmittingDispute] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const [disputeError, setDisputeError] = useState<string | null>(null);
  const [disputeSuccess, setDisputeSuccess] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancellationError, setCancellationError] = useState<string | null>(null);
  const [selectingQuoteId, setSelectingQuoteId] = useState<string | null>(null);
  const [selectQuoteError, setSelectQuoteError] = useState<string | null>(null);
  const [isDiscoveringTrip, setIsDiscoveringTrip] = useState(false);
  const [tripDiscoveryError, setTripDiscoveryError] = useState<string | null>(null);

  useEffect(() => {
    if (!requestId) return;

    let isMounted = true;

    async function loadData() {
      try {
        const [requestResponse, quoteResponse] = await Promise.all([
          getTransportRequest(requestId!),
          getTransportRequestQuotes(requestId!),
        ]);

        if (!isMounted) return;
        const loadedRequest = requestResponse.data ?? null;
        setRequest(loadedRequest);
        setQuotes(quoteResponse.data ?? []);
        setError(null);
        setTrip(null);
        setPayment(null);
        setDispute(null);
        setDisputeError(null);
        setDisputeSuccess(null);

        if (loadedRequest?.status === "DRIVER_SELECTED") {
          await discoverTrip(requestId!);
        }
      } catch (caughtError) {
        if (!isMounted) return;
        const apiError = caughtError as ApiError;
        setError(apiError.error ?? "Failed to load request");
        setRequest(null);
        setQuotes([]);
        setTrip(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

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

  async function handleCreatePayment() {
    if (!trip) return;

    setPaymentError(null);
    setPaymentSuccess(null);
    setIsPaying(true);

    try {
      const paymentResponse = await createPayment(trip.id, {});
      setPayment(paymentResponse.data);
      setPaymentSuccess("Payment initiated. Please complete the payment with your provider.");
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

    const confirmed = window.confirm(
      "Select this quote and confirm the booking?"
    );
    if (!confirmed) return;

    setSelectQuoteError(null);
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

  function getStatusBadgeClass(status: string): string {
    return `status-badge status-${status.toLowerCase()}`;
  }

  function renderQuoteStatus(status: string) {
    return status === "SELECTED" || status === "REJECTED" || status === "PENDING"
      ? status
      : status;
  }

  const canCancel =
    request &&
    CANCELLABLE_STATUSES.includes(request.status);

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
        <p className="status-text">Loading request…</p>
      </section>
    );
  }

  if (error || !request) {
    return (
      <section className="screen-card">
        {error ? (
          <div className="error-box">{error}</div>
        ) : (
          <h1>Request not found</h1>
        )}
      </section>
    );
  }

  return (
    <section className="screen-card">
      <div className="page-header-row">
        <div>
          <p className="eyebrow">Trip details</p>
          <h1>{request.origin} → {request.destination}</h1>
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
          <dd>{request.id}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>
            <span className={getStatusBadgeClass(request.status)}>
              {request.status}
            </span>
          </dd>
        </div>
        <div>
          <dt>Created</dt>
          <dd>{formatDate(request.createdAt)}</dd>
        </div>
        <div>
          <dt>Vehicle</dt>
          <dd>{request.vehicleDetailId}</dd>
        </div>
      </dl>

      {selectQuoteError ? (
        <div className="error-box">{selectQuoteError}</div>
      ) : null}

      {tripDiscoveryError ? (
        <div className="error-box">{tripDiscoveryError}</div>
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

      <h2>Quotes</h2>
      {quotes.length === 0 ? (
        <p className="status-text">No quotes yet.</p>
      ) : (
        <ul className="quote-list">
          {quotes.map((quote) => {
            const isSelected = quote.status === "SELECTED";
            const isRejected = quote.status === "REJECTED";
            const isPending = quote.status === "PENDING";
            const isSelecting = selectingQuoteId === quote.id;
            const showSelect = isPending && SELECTABLE_STATUSES.includes(request.status);

            return (
              <li
                key={quote.id}
                className={`quote-item quote-status-${quote.status.toLowerCase()}`}
              >
                <div>
                  <strong>{quote.driver?.user?.fullName ?? "Driver"}</strong>
                  {quote.message ? <small>{quote.message}</small> : null}
                  <div className="quote-meta">
                    <span className={`status-badge status-${quote.status.toLowerCase()}`}>
                      {renderQuoteStatus(quote.status)}
                    </span>
                    <span>{formatDate(quote.createdAt)}</span>
                  </div>
                </div>
                <div className="quote-actions">
                  <span>KSh {quote.amount}</span>
                  {showSelect ? (
                    <button
                      type="button"
                      className="primary-button small-button"
                      onClick={() => handleSelectQuote(quote.id)}
                      disabled={Boolean(selectingQuoteId)}
                    >
                      {isSelecting ? "Selecting..." : "Select Quote"}
                    </button>
                  ) : null}
                  {isSelected ? (
                    <span className="quote-badge quote-badge-selected">Selected</span>
                  ) : null}
                  {isRejected ? (
                    <span className="quote-badge quote-badge-rejected">Rejected</span>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {(trip || request.status === "DRIVER_SELECTED") && (
        <section className="trip-summary-card">
          <h2>Trip</h2>
          {isDiscoveringTrip ? (
            <p className="status-text">Discovering your trip…</p>
          ) : trip ? (
            <>
              <div className="detail-list">
                <div>
                  <dt>Trip ID</dt>
                  <dd>{trip.id}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>
                    <span className={getStatusBadgeClass(trip.status)}>{trip.status}</span>
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
                  <dd>{trip.transportRequest?.origin ?? request.origin}</dd>
                </div>
                <div>
                  <dt>Destination</dt>
                  <dd>{trip.transportRequest?.destination ?? request.destination}</dd>
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

              {trip.status === "PAYMENT_PENDING" ? (
                <div className="payment-card">
                  <h3>Payment</h3>
                  <div className="detail-list">
                    <div>
                      <dt>Transport request</dt>
                      <dd>{request.id}</dd>
                    </div>
                    <div>
                      <dt>Origin</dt>
                      <dd>{trip.transportRequest?.origin ?? request.origin}</dd>
                    </div>
                    <div>
                      <dt>Destination</dt>
                      <dd>{trip.transportRequest?.destination ?? request.destination}</dd>
                    </div>
                    <div>
                      <dt>Selected driver</dt>
                      <dd>{quotes.find((quote) => quote.status === "SELECTED")?.driver?.user?.fullName ?? trip.driverId}</dd>
                    </div>
                    <div>
                      <dt>Booking amount</dt>
                      <dd className="payment-amount">KSh {trip.bookingAmount}</dd>
                    </div>
                  </div>

                  {paymentError ? <div className="error-box">{paymentError}</div> : null}
                  {paymentSuccess ? <div className="success-box">{paymentSuccess}</div> : null}

                  {payment ? (
                    <div className="detail-list payment-info">
                      <div>
                        <dt>Payment ID</dt>
                        <dd>{payment.id}</dd>
                      </div>
                      <div>
                        <dt>Payment status</dt>
                        <dd>{payment.status}</dd>
                      </div>
                      <div>
                        <dt>Amount</dt>
                        <dd>KSh {payment.amount}</dd>
                      </div>
                      <div>
                        <dt>Created</dt>
                        <dd>{formatDate(payment.createdAt)}</dd>
                      </div>
                    </div>
                  ) : (
                    <div className="action-panel">
                      <button
                        type="button"
                        className="primary-button"
                        onClick={handleCreatePayment}
                        disabled={isPaying || isLoadingPayment}
                      >
                        {isPaying ? "Processing payment…" : "Pay Now"}
                      </button>
                    </div>
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
                        <dd>{dispute.id}</dd>
                      </div>
                      <div>
                        <dt>Status</dt>
                        <dd>{dispute.status}</dd>
                      </div>
                      <div>
                        <dt>Category</dt>
                        <dd>{dispute.category ?? "N/A"}</dd>
                      </div>
                      <div>
                        <dt>Priority</dt>
                        <dd>{dispute.priority ?? "NORMAL"}</dd>
                      </div>
                      <div>
                        <dt>Description</dt>
                        <dd>{dispute.description ?? "-"}</dd>
                      </div>
                      {dispute.resolutionType ? (
                        <div>
                          <dt>Resolution type</dt>
                          <dd>{dispute.resolutionType}</dd>
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
