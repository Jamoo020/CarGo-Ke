import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTrip } from "../../lib/admin";

export default function TripDetailPage() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tripId) {
      setError("Trip ID is required.");
      setLoading(false);
      return;
    }
    const resolvedTripId = tripId;
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await getTrip(resolvedTripId);
        if (!mounted) return;
        setTrip(res.data ?? null);
        setError(null);
      } catch (e: any) {
        setError(e?.error ?? "Failed to load trip");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [tripId]);

  if (loading) return <p>Loading trip...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!trip) return <p>Trip not found.</p>;

  return (
    <div>
      <h2>Trip {trip.id}</h2>
      <p>Status: {trip.status}</p>
      <p>Customer: {trip.customerId}</p>
      <p>Driver: {trip.driverId}</p>
      <p>Route: {trip.transportRequest?.origin ?? "-"} → {trip.transportRequest?.destination ?? "-"}</p>
      <p>Booking amount: KSh {trip.bookingAmount}</p>
      <p>Driver fee: KSh {trip.driverFee}</p>
      <p>Driver amount released: KSh {trip.driverAmountReleased}</p>
      <p>Driver amount remaining: KSh {trip.driverAmountRemaining}</p>
      <p>Refund amount: KSh {trip.refundAmount}</p>
      <p>Created: {new Date(trip.createdAt).toLocaleString()}</p>
      <p>Updated: {new Date(trip.updatedAt).toLocaleString()}</p>
    </div>
  );
}
