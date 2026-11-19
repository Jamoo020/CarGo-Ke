import { useEffect, useMemo, useState } from "react";
import { listAvailableRequests, listMyQuotes, createQuote } from "../lib/driver";
import { useAuth } from "../hooks/useAuth";
import { TransportRequest, TransportRequestQuote } from "../types/customer";
import {
  formatDateTime,
  formatDistance as formatDistanceValue,
  formatDuration as formatDurationValue,
  formatLocation,
  formatReference,
  formatStatus,
  formatVehicle,
} from "../lib/presentation";
import { getStoredRouteLocationIssue } from "../lib/routeLocation";

function formatDistance(distanceMeters?: number | null) {
  return formatDistanceValue(distanceMeters);
}

function formatDuration(estimatedDurationSeconds?: number | null) {
  return formatDurationValue(estimatedDurationSeconds);
}

function formatRouteStatus(status?: string | null) {
  return status ? formatStatus(status) : "Available";
}

function isVerifiedRoute(request: TransportRequest) {
  return !getStoredRouteLocationIssue(request)
    && Boolean(request.routePolyline)
    && Number(request.distanceMeters) > 0
    && Number(request.estimatedDurationSeconds) > 0;
}

export default function DriverQuotesPage({ showPendingBanner = false }: { showPendingBanner?: boolean }) {
  const [requests, setRequests] = useState<TransportRequest[]>([]);
  const [quotes, setQuotes] = useState<TransportRequestQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formRequestId, setFormRequestId] = useState("");
  const [formAmount, setFormAmount] = useState(0);
  const [formFuelBudget, setFormFuelBudget] = useState(0);
  const [success, setSuccess] = useState<string | null>(null);
  const { user } = useAuth();
  const [canQuote, setCanQuote] = useState<boolean>(true);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const quoteMap = useMemo(() => new Map(quotes.map((quote) => [quote.transportRequestId, quote])), [quotes]);
  const selectedRequest = requests.find((request) => request.id === selectedRequestId) ?? requests[0] ?? null;

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const requestsRes = await listAvailableRequests();
        if (!mounted) return;
        const nextRequests = requestsRes.data ?? [];
        setRequests(nextRequests);
        setSelectedRequestId((current) => current && nextRequests.some((request) => request.id === current) ? current : nextRequests[0]?.id ?? null);

        try {
          const quotesRes = await listMyQuotes();
          if (!mounted) return;
          setQuotes(quotesRes.data ?? []);
          setCanQuote(true);
        } catch (qe: any) {
          if (qe?.status === "403" || /not eligible|not authorized|forbidden/i.test(qe?.error ?? "")) {
            setQuotes([]);
            setCanQuote(false);
          } else {
            throw qe;
          }
        }

        setError(null);
      } catch (e: any) {
        setError(e?.error ?? "Failed to load requests");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (selectedRequestId && !requests.some((request) => request.id === selectedRequestId)) {
      setSelectedRequestId(requests[0]?.id ?? null);
    }
  }, [requests, selectedRequestId]);

  useEffect(() => {
    if (selectedRequest) {
      setFormRequestId(selectedRequest.id);
      setFormAmount(0);
      setFormFuelBudget(0);
    }
  }, [selectedRequest]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(null);
    try {
      if (!selectedRequest) {
        throw { error: "No request selected", status: "400" };
      }

      if (!canQuote) {
        throw { error: "Driver not eligible to submit quotations", status: "403" };
      }

      const existingQuote = quoteMap.get(selectedRequest.id);
      if (existingQuote) {
        setSuccess(`Quote already submitted for ${formatReference("request", selectedRequest.id)}`);
        return;
      }

      if (formAmount <= 0) {
        throw { error: "Transport fee must be greater than zero", status: "400" };
      }

      if (formFuelBudget < 0) {
        throw { error: "Fuel budget cannot be negative", status: "400" };
      }

      await createQuote(selectedRequest.id, {
        amount: formAmount,
        fuelBudget: formFuelBudget,
        message: "Driver quote",
      });
      setSuccess(`Quote submitted for ${formatReference("request", selectedRequest.id)}`);

      const [requestsRes, quotesRes] = await Promise.all([listAvailableRequests(), listMyQuotes()]);
      setRequests(requestsRes.data ?? []);
      setQuotes(quotesRes.data ?? []);
      setFormAmount(0);
      setFormFuelBudget(0);
    } catch (err: any) {
      setError(err?.error ?? "Failed to create quote");
    } finally {
      setSubmitting(false);
    }
  }

  const selectedQuote = selectedRequest ? quoteMap.get(selectedRequest.id) : undefined;

  return (
    <div className="driver-marketplace-shell">
      <div className="stats-grid marketplace-kpis">
        <div className="stat-card">
          <span className="stat-label">Open jobs</span>
          <strong>{requests.length}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">My quotes</span>
          <strong>{quotes.length}</strong>
        </div>
        <div className="stat-card success">
          <span className="stat-label">Eligibility</span>
          <strong>{canQuote ? "Approved" : "Pending"}</strong>
        </div>
      </div>

      {showPendingBanner && user?.role === "DRIVER" && !canQuote && (
        <div className="info-panel">
          <div className="panel-header">
            <span className="badge badge-info">Eligibility</span>
          </div>
          <p>
            Your driver account may be pending verification. You can view available transport jobs, but you may not submit quotes until your account is approved by an admin.
          </p>
        </div>
      )}

      {loading && (
        <div className="job-market-loading">
          <div className="job-market-loading-header">
            <span className="skeleton skeleton-line" />
            <span className="skeleton skeleton-line medium" />
          </div>
          <div className="job-market-loading-summary">
            <span className="skeleton skeleton-box" />
            <span className="skeleton skeleton-box" />
            <span className="skeleton skeleton-box" />
          </div>
          <div className="job-market-loading-grid">
            <span className="skeleton skeleton-card" />
            <span className="skeleton skeleton-card" />
          </div>
        </div>
      )}

      {!loading && error && <div className="error-box">{error}</div>}

      {!loading && !error && requests.length === 0 && (
        <div className="empty-state">
          <p>No available transport jobs right now.</p>
        </div>
      )}

      {!loading && !error && requests.length > 0 && (
        <div className="job-market-grid">
          <div className="job-card-list">
            {requests.map((request) => {
              const requestQuote = quoteMap.get(request.id);
              const isSelected = selectedRequest?.id === request.id;
              const pickupLabel = formatLocation(request.pickupAddress || request.origin, request.pickupLatitude, request.pickupLongitude);
              const destinationLabel = formatLocation(request.destinationAddress || request.destination, request.destinationLatitude, request.destinationLongitude);

              return (
                <article
                  key={request.id}
                  className={`job-card ${isSelected ? "selected" : ""}`}
                  aria-label={`Request ${formatReference("request", request.id)}`}
                >
                  <div className="job-card-header">
                    <div className="job-route-stack">
                      <strong>{pickupLabel}</strong>
                      <span className="route-divider">↓</span>
                      <strong>{destinationLabel}</strong>
                    </div>
                    <span className={`status-badge ${request.status ? `status-${String(request.status).toLowerCase()}` : "status-requested"}`}>
                      {formatRouteStatus(request.status)}
                    </span>
                  </div>

                  <div className="job-meta-row">
                    <span>{isVerifiedRoute(request) ? formatDistance(request.distanceMeters) : "Driving distance unavailable"}</span>
                    <span>•</span>
                    <span>{isVerifiedRoute(request) ? formatDuration(request.estimatedDurationSeconds) : "Driving duration unavailable"}</span>
                  </div>

                  <div className="job-detail-pair">
                    <span className="job-detail-label">Vehicle</span>
                    <strong>
                      {formatVehicle(request.vehicleDetail)}
                    </strong>
                    {request.vehicleDetail?.vehicleType && <small>{request.vehicleDetail.vehicleType}</small>}
                  </div>

                  {request.vehicleDetail && (
                    <div className="job-detail-pair compact">
                      <span className="job-detail-label">Requirements</span>
                      <div className="job-detail-stack">
                        {request.vehicleDetail.year ? <span>{request.vehicleDetail.year}</span> : null}
                        {request.vehicleDetail.color ? <span>{request.vehicleDetail.color}</span> : null}
                        {request.vehicleDetail.capacity ? <span>Capacity {request.vehicleDetail.capacity}</span> : null}
                        {request.notes ? <span>{request.notes}</span> : null}
                      </div>
                    </div>
                  )}

                  <div className="job-card-actions">
                    <button type="button" className="secondary-button small-button" onClick={() => setSelectedRequestId(request.id)}>
                      View request
                    </button>

                    <button
                      type="button"
                      className="primary-button small-button"
                      disabled={!canQuote || !!requestQuote || submitting}
                      onClick={() => {
                        setSelectedRequestId(request.id);
                        setSuccess(null);
                        setError(null);
                      }}
                    >
                      {requestQuote ? "Quote submitted" : "Submit Quote"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {selectedRequest && (
            <aside className="job-detail-panel">
              <div className="job-detail-header">
                <div>
                  <p className="eyebrow compact">Request overview</p>
                  <h2>{formatReference("request", selectedRequest.id)}</h2>
                </div>
                <span className={`status-badge ${selectedRequest.status ? `status-${String(selectedRequest.status).toLowerCase()}` : "status-requested"}`}>
                  {formatRouteStatus(selectedRequest.status)}
                </span>
              </div>

              <div className="job-detail-route">
                <div>
                  <span className="job-detail-label">Pickup</span>
                  <strong>{formatLocation(selectedRequest.pickupAddress || selectedRequest.origin, selectedRequest.pickupLatitude, selectedRequest.pickupLongitude)}</strong>
                </div>
                <div className="route-divider vertical">↓</div>
                <div>
                  <span className="job-detail-label">Destination</span>
                  <strong>{formatLocation(selectedRequest.destinationAddress || selectedRequest.destination, selectedRequest.destinationLatitude, selectedRequest.destinationLongitude)}</strong>
                </div>
              </div>

              <div className="job-detail-grid">
                <div>
                  <span className="job-detail-label">Distance</span>
                  <strong>{isVerifiedRoute(selectedRequest) ? formatDistance(selectedRequest.distanceMeters) : "Driving distance unavailable"}</strong>
                </div>
                <div>
                  <span className="job-detail-label">Estimated duration</span>
                  <strong>{isVerifiedRoute(selectedRequest) ? formatDuration(selectedRequest.estimatedDurationSeconds) : "Driving duration unavailable"}</strong>
                </div>
                <div>
                  <span className="job-detail-label">Travel date</span>
                  <strong>{formatDateTime(selectedRequest.travelDateTime)}</strong>
                </div>
              </div>

              <div className="job-detail-grid single">
                <div>
                  <span className="job-detail-label">Vehicle</span>
                  <strong>
                    {formatVehicle(selectedRequest.vehicleDetail)}
                  </strong>
                  <small>
                    {selectedRequest.vehicleDetail?.vehicleType ? `${selectedRequest.vehicleDetail.vehicleType}` : ""}
                    {selectedRequest.vehicleDetail?.year ? ` • ${selectedRequest.vehicleDetail.year}` : ""}
                    {selectedRequest.vehicleDetail?.color ? ` • ${selectedRequest.vehicleDetail.color}` : ""}
                    {selectedRequest.vehicleDetail?.capacity ? ` • Capacity ${selectedRequest.vehicleDetail.capacity}` : ""}
                  </small>
                </div>
                <div>
                  <span className="job-detail-label">Customer request</span>
                  <strong>{selectedRequest.notes || "No additional requirements provided."}</strong>
                </div>
              </div>

              {selectedQuote && (
                <div className="quote-existing-panel">
                  <span className="badge badge-success">Quote submitted</span>
                  <p>
                    Your quote is currently <strong>{formatStatus(selectedQuote.status)}</strong> for this request.
                  </p>
                </div>
              )}

              {success && <div className="success-box">{success}</div>}

              {!canQuote && (
                <div className="error-box">You cannot submit quotes until your driver account is approved by an admin.</div>
              )}

              <form className="job-quote-form" onSubmit={handleSubmit}>
                <label htmlFor="driver-quote-request-id">Transport Request ID</label>
                <input id="driver-quote-request-id" value={formatReference("request", formRequestId)} readOnly />

                <label htmlFor="driver-quote-amount">Quote amount</label>
                <input
                  id="driver-quote-amount"
                  aria-label="Amount"
                  type="number"
                  min="1"
                  step="1"
                  value={formAmount}
                  onChange={(e) => setFormAmount(Number(e.target.value))}
                  disabled={!canQuote || !!selectedQuote || submitting}
                />

                <label htmlFor="driver-fuel-budget">Fuel Budget</label>
                <input
                  id="driver-fuel-budget"
                  aria-label="Fuel Budget"
                  type="number"
                  min="0"
                  step="1"
                  value={formFuelBudget}
                  onChange={(e) => setFormFuelBudget(Number(e.target.value))}
                  disabled={!canQuote || !!selectedQuote || submitting}
                />
                <small style={{ marginTop: -8, color: '#4e5d73', display: 'block' }}>
                  Amount reserved for trip fuel. This is separate from your transport fee.
                </small>

                <button type="submit" className="primary-button" disabled={!canQuote || !!selectedQuote || submitting || formAmount <= 0 || formFuelBudget < 0}>
                  {submitting ? "Submitting..." : selectedQuote ? "Quote submitted" : "Submit Quote"}
                </button>
              </form>
            </aside>
          )}
        </div>
      )}
    </div>
  );
}
