import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTrip, transitionTrip } from "../lib/driver";
import { Trip, TransportRequestQuote } from "../types/customer";

export default function DriverTripDetailPage() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (!tripId) return;
    const id = tripId;
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await getTrip(id);
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
    return () => {
      mounted = false;
    };
  }, [tripId]);

  async function doAction(action: string) {
    if (!tripId) return;
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await transitionTrip(tripId, action);
      setTrip(res.data ?? null);
    } catch (e: any) {
      setActionError(e?.error ?? "Action failed");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <p>Loading trip...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!trip) return <p>Trip not found.</p>;

  // derive allowed driver actions from trip status (subset of server-side rules)
  const allowedActions: { label: string; action: string }[] = [];
  if (trip.status === "BOOKED") allowedActions.push({ label: "Begin Pickup", action: "beginPickup" });
  if (trip.status === "PICKUP_PENDING") allowedActions.push({ label: "Complete Pickup Inspection", action: "completePickupInspection" });
  if (trip.status === "PICKUP_INSPECTION") allowedActions.push({ label: "Request Trip Start", action: "requestTripStart" });
  if (trip.status === "TRIP_ACTIVE") allowedActions.push({ label: "Begin Transit", action: "beginTransit" });
  if (trip.status === "IN_TRANSIT") allowedActions.push({ label: "Mark Delivery Pending", action: "markDeliveryPending" });
  if (["PAYMENT_PENDING","BOOKED","PICKUP_PENDING","PICKUP_INSPECTION","TRIP_START_PENDING","TRIP_ACTIVE","IN_TRANSIT","DELIVERY_PENDING"].includes(trip.status)) {
    allowedActions.push({ label: "Cancel Trip", action: "cancelTrip" });
  }

  return (
    <div>
      <h2>Trip {trip.id}</h2>
      <p>{trip.transportRequest?.origin} → {trip.transportRequest?.destination}</p>
      <p>Status: {trip.status}</p>
      <p>Driver Fee: KSh {trip.driverFee}</p>

      {actionError && <p className="error">{actionError}</p>}

      <div>
        {allowedActions.map((a) => (
          <button key={a.action} onClick={() => doAction(a.action)} disabled={actionLoading}>{actionLoading ? "Working..." : a.label}</button>
        ))}
      </div>
    </div>
  );
}
