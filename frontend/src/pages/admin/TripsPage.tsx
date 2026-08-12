import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listTrips } from "../../lib/admin";

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

  if (loading) return <p>Loading trips...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h2>Trips</h2>
      <div>
        <input placeholder="Search trip ID or participant" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="BOOKED">BOOKED</option>
          <option value="PICKUP_PENDING">PICKUP_PENDING</option>
          <option value="TRIP_ACTIVE">TRIP_ACTIVE</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="DISPUTED">DISPUTED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>
      {trips.length === 0 ? <p>No trips found.</p> : (
        <ul>
          {trips.map((trip) => (
            <li key={trip.id}>
              <Link to={`/admin/trips/${trip.id}`}>{trip.id}</Link> — {trip.status} — {trip.transportRequest?.origin ?? "unknown"} → {trip.transportRequest?.destination ?? "unknown"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
