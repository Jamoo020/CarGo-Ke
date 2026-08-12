import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getTransportRequest,
  getTransportRequestQuotes,
  selectQuote,
  cancelTransportRequest,
  getTrips,
} from "../lib/customer";
import { TransportRequest, TransportRequestQuote, Trip } from "../types/customer";
import { ApiError } from "../types/auth";

const CANCELLABLE_STATUSES = ["REQUESTED", "QUOTING"];
const SELECTABLE_STATUSES = ["REQUESTED", "QUOTING"];

export default function TransportRequestDetailPage() {
  const { requestId } = useParams();
  const [request, setRequest] = useState<TransportRequest | null>(null);
  const [quotes, setQuotes] = useState<TransportRequestQuote[]>([]);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    } catch (caughtError) {
      const apiError = caughtError as ApiError;
      setTripDiscoveryError(apiError.error ?? "Unable to load trip details.");
      setTrip(null);
    } finally {
      setIsDiscoveringTrip(false);
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
          ) : (
            <p className="status-text">Booking created; trip details are not available yet.</p>
          )}
        </section>
      )}
    </section>
  );
}
