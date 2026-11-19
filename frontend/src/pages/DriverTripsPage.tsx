import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listTrips } from "../lib/driver";
import { Trip } from "../types/customer";
import { formatDateTime, formatLocation, formatReference, formatStatus } from "../lib/presentation";

export default function DriverTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await listTrips();
        if (!mounted) return;
        setTrips(res.data ?? []);
        setError(null);
      } catch (e: any) {
        setError(e?.error ?? "Failed to load trips");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="screen-card">
      <div className="page-header-row compact">
        <div>
          <p className="eyebrow">Driver Portal</p>
          <h1>Assigned Trips</h1>
        </div>
      </div>

      {error ? (
        <div className="error-box">{error}</div>
      ) : loading ? (
        <p className="status-text">Loading trips…</p>
      ) : trips.length === 0 ? (
        <div className="empty-state"><p>No assigned trips yet.</p></div>
      ) : (
        <ul className="request-list">
          {trips.map((t) => (
            <li key={t.id} className="request-item">
              <Link to={`/driver/trips/${t.id}`} className="request-item-link">
                <div className="request-item-main">
                  <strong>{formatReference("trip", t.id)}</strong>
                  <div className="request-item-route">
                    <span>{formatLocation(t.transportRequest?.pickupAddress || t.transportRequest?.origin, t.transportRequest?.pickupLatitude, t.transportRequest?.pickupLongitude)}</span>
                    <span className="route-arrow">→</span>
                    <span>{formatLocation(t.transportRequest?.destinationAddress || t.transportRequest?.destination, t.transportRequest?.destinationLatitude, t.transportRequest?.destinationLongitude)}</span>
                  </div>
                  <small>{formatDateTime(t.transportRequest?.travelDateTime ?? t.createdAt)}</small>
                </div>
                <div className="request-item-status">
                  <span className={`status-badge status-${t.status?.toLowerCase() || "pending"}`}>{formatStatus(t.status)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
