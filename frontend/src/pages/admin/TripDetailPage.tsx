import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTrip } from "../../lib/admin";
import { listTripInspections } from "../../lib/driver";
import TripInspectionCard from "../../components/trips/TripInspectionCard";
import { formatDateTime, formatDisplayName, formatLocation, formatReference, formatStatus, formatVehicle } from "../../lib/presentation";

type AdminTripDetail = Awaited<ReturnType<typeof getTrip>>["data"];

export default function TripDetailPage() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState<AdminTripDetail | null>(null);
  const [inspections, setInspections] = useState<any[]>([]);
  const [inspectionsLoading, setInspectionsLoading] = useState(false);
  const [inspectionsError, setInspectionsError] = useState<string | null>(null);
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

        setInspectionsLoading(true);
        setInspectionsError(null);
        try {
          const inspectionResponse = await listTripInspections(resolvedTripId);
          if (mounted) setInspections(inspectionResponse.data ?? []);
        } catch (inspectionLoadError: any) {
          if (mounted) {
            setInspectionsError(inspectionLoadError?.error ?? "Unable to load inspection records.");
            setInspections([]);
          }
        } finally {
          if (mounted) setInspectionsLoading(false);
        }
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

  const wallet = trip.tripWallet;
  const legacyWallet = wallet?.releaseAccountingVersion === 1
    || wallet?.fuelAccountingStatus === "LEGACY_UNRECONCILED";
  const reconciledWallet = wallet?.releaseAccountingVersion === 2
    && wallet.fuelAccountingStatus === "RESTRICTED";

  return (
    <div>
      <h2>{formatReference("trip", trip.id)}</h2>
      <p>Status: {formatStatus(trip.status)}</p>
      <p>Customer: {formatDisplayName(trip.customer?.fullName, "Customer name not provided")}</p>
      <p>Driver: {formatDisplayName(trip.driver?.user?.fullName, "Driver name not provided")}</p>
      <p>Route: {formatLocation(trip.transportRequest?.pickupAddress || trip.transportRequest?.origin, trip.transportRequest?.pickupLatitude, trip.transportRequest?.pickupLongitude)} → {formatLocation(trip.transportRequest?.destinationAddress || trip.transportRequest?.destination, trip.transportRequest?.destinationLatitude, trip.transportRequest?.destinationLongitude)}</p>
      <p>Vehicle: {formatVehicle(trip.transportRequest?.vehicleDetail)}</p>
      <p>Booking amount: KSh {trip.bookingAmount}</p>
      <p>Driver fee: KSh {trip.driverFee}</p>
      {legacyWallet ? (
        <>
          <p>Historical driver amount released: KSh {trip.driverAmountReleased}</p>
          <p>Historical driver amount remaining: KSh {trip.driverAmountRemaining}</p>
          <div className="error-box" role="alert">
            <strong>Legacy wallet — reconciliation required.</strong>{" "}
            The historical released total may include fuel allocation and must not be interpreted as verified driver compensation.
            Historical transactions have not been adjusted.
          </div>
        </>
      ) : reconciledWallet ? (
        <>
          <p>Driver compensation released: KSh {wallet.driverCompensationReleased}</p>
          <p>Driver compensation remaining: KSh {wallet.driverCompensationRemaining}</p>
        </>
      ) : (
        <div className="error-box" role="status">
          Wallet accounting status is unavailable; release totals are not displayed as verified driver compensation.
        </div>
      )}
      <p>Refund amount: KSh {trip.refundAmount}</p>
      <p>Travel date: {formatDateTime(trip.transportRequest?.travelDateTime ?? trip.createdAt)}</p>
      <p>Updated: {formatDateTime(trip.updatedAt)}</p>

      <section style={{ marginTop: 24 }}>
        <h3>Inspection records</h3>
        {inspectionsLoading ? (
          <p role="status">Loading inspection records…</p>
        ) : inspectionsError ? (
          <div className="error-box">{inspectionsError}</div>
        ) : inspections.length > 0 ? (
          <div style={{ display: "grid", gap: 16 }}>
            {inspections.map((inspection) => (
              <TripInspectionCard
                key={inspection.id}
                title={`${inspection.type === "PICKUP" ? "Pickup" : "Delivery"} inspection`}
                inspection={inspection}
              />
            ))}
          </div>
        ) : (
          <p>No inspection records have been submitted for this trip.</p>
        )}
      </section>
    </div>
  );
}
