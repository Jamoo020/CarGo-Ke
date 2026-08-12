import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTransportRequests } from "../lib/customer";
import { TransportRequest } from "../types/customer";
import { ApiError } from "../types/auth";

export default function CustomerRequestsPage() {
  const [requests, setRequests] = useState<TransportRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    getTransportRequests()
      .then((response) => {
        if (!isMounted) return;
        setRequests(response.data ?? []);
        setError(null);
      })
      .catch((caughtError) => {
        if (!isMounted) return;
        const apiError = caughtError as ApiError;
        setError(apiError.error ?? "Failed to load requests");
        setRequests([]);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  function formatDate(dateString: string): string {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  }

  return (
    <section className="screen-card">
      <div className="page-header-row">
        <div>
          <p className="eyebrow">Trip activity</p>
          <h1>My Transport Requests</h1>
        </div>
        <Link to="/customer/requests/new" className="primary-link-button">New Request</Link>
      </div>

      {error ? (
        <div className="error-box">
          <strong>Error:</strong> {error}
        </div>
      ) : null}

      {isLoading ? (
        <p className="status-text">Loading requests…</p>
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <p>No transport requests yet.</p>
          <Link to="/customer/requests/new">Create your first request</Link>
        </div>
      ) : (
        <ul className="request-list">
          {requests.map((request) => (
            <li key={request.id} className="request-item">
              <Link to={`/customer/requests/${request.id}`} className="request-item-link">
                <div className="request-item-main">
                  <div className="request-item-route">
                    <strong>{request.origin}</strong>
                    <span className="route-arrow">→</span>
                    <strong>{request.destination}</strong>
                  </div>
                  <div className="request-item-details">
                    <span className="request-id">ID: {request.id}</span>
                    {request.createdAt && (
                      <span className="request-date">{formatDate(request.createdAt)}</span>
                    )}
                  </div>
                </div>
                <div className="request-item-status">
                  <span className={`status-badge status-${request.status.toLowerCase()}`}>
                    {request.status}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
