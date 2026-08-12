import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listTrips, getTrip } from "../lib/driver";
import { listMyQuotes } from "../lib/driver";

export default function DriverDashboardPage() {
  const [tripsCount, setTripsCount] = useState<number | null>(null);
  const [quotesCount, setQuotesCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const tripsResp = await listTrips();
        const quotesResp = await listMyQuotes();
        if (!mounted) return;
        setTripsCount(tripsResp.data.length);
        setQuotesCount(quotesResp.data.length);
        setError(null);
      } catch (e: any) {
        setError(e?.error ?? "Failed to load dashboard");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <p>Loading driver dashboard...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Driver Dashboard</h2>
      <ul>
        <li>Assigned trips: {tripsCount}</li>
        <li>My quotes: {quotesCount}</li>
      </ul>

      <p>
        <Link to="/driver/trips">View assigned trips</Link>
      </p>
      <p>
        <Link to="/driver/requests">My quotes & available requests</Link>
      </p>
    </div>
  );
}
