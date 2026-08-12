import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listTrips } from "../lib/driver";
import { Trip } from "../types/customer";

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

  if (loading) return <p>Loading trips...</p>;

  if (trips.length === 0) return <p>No assigned trips.</p>;

  return (
    <div>
      <h2>Assigned Trips</h2>
      {error && <p className="error">{error}</p>}
      <ul>
        {trips.map((t) => (
          <li key={t.id}>
            <Link to={`/driver/trips/${t.id}`}>{t.id}</Link> — {t.transportRequest?.origin} → {t.transportRequest?.destination} — {t.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
