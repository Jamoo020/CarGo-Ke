import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTransportRequests } from "../lib/customer";
import { TransportRequest } from "../types/customer";

export default function CustomerRequestsPage() {
  const [requests, setRequests] = useState<TransportRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getTransportRequests()
      .then((response) => {
        if (!isMounted) return;
        setRequests(response.data ?? []);
      })
      .catch(() => {
        if (!isMounted) return;
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

  return (
    <section className="screen-card">
      <div className="page-header-row">
        <div>
          <p className="eyebrow">Trip activity</p>
          <h1>My Transport Requests</h1>
        </div>
        <Link to="/customer/requests/new" className="primary-link-button">New Request</Link>
      </div>

      {isLoading ? (
        <p>Loading requests…</p>
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <p>No transport requests yet.</p>
          <Link to="/customer/requests/new">Create your first request</Link>
        </div>
      ) : (
        <ul className="request-list">
          {requests.map((request) => (
            <li key={request.id} className="request-item">
              <Link to={`/customer/requests/${request.id}`}>
                <strong>{request.origin}</strong>
                <span>→</span>
                <strong>{request.destination}</strong>
              </Link>
              <small>{request.status}</small>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
