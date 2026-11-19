import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listTrips } from "../../lib/admin";
import { formatDateTime, formatLocation, formatReference, formatStatus } from "../../lib/presentation";

export default function TripsPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await listTrips({ status: status || undefined, search: search || undefined });
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
    return () => { mounted = false; };
  }, [status, search]);

  return (
    <section className="screen-card">
      <div className="page-header-row compact">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Trips</h1>
        </div>
      </div>

      <div className="form-grid" style={{marginBottom: "1.5rem"}}>
        <label>
          <span>Search trips</span>
          <input placeholder="ID or participant..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
        <label>
          <span>Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {["BOOKED", "PICKUP_PENDING", "TRIP_ACTIVE", "DELIVERY_PENDING", "COMPLETED", "DISPUTED", "CANCELLED"].map((value) => (
              <option key={value} value={value}>{formatStatus(value)}</option>
            ))}
          </select>
        </label>
      </div>

      {error ? (
        <div className="error-box">{error}</div>
      ) : loading ? (
        <p className="status-text">Loading trips…</p>
      ) : trips.length === 0 ? (
        <div className="empty-state"><p>No trips found.</p></div>
      ) : (
        <ul className="request-list">
          {trips.map((trip) => (
            <li key={trip.id} className="request-item">
              <Link to={`/admin/trips/${trip.id}`} className="request-item-link">
                <div className="request-item-main">
                  <strong>{formatReference("trip", trip.id)}</strong>
                  <div className="request-item-route">
                    <span>{formatLocation(trip.transportRequest?.pickupAddress || trip.transportRequest?.origin, trip.transportRequest?.pickupLatitude, trip.transportRequest?.pickupLongitude)}</span>
                    <span className="route-arrow">→</span>
                    <span>{formatLocation(trip.transportRequest?.destinationAddress || trip.transportRequest?.destination, trip.transportRequest?.destinationLatitude, trip.transportRequest?.destinationLongitude)}</span>
                  </div>
                  <small>{formatDateTime(trip.transportRequest?.travelDateTime ?? trip.createdAt)}</small>
                </div>
                <div className="request-item-status">
                  <span className={`status-badge status-${trip.status?.toLowerCase() || "pending"}`}>{formatStatus(trip.status)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
