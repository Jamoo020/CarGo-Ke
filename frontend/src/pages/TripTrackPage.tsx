import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Map from "../components/map/Map";
import TripStatusTimeline from "../components/trips/TripStatusTimeline";
import TripInspectionCard from "../components/trips/TripInspectionCard";
import {
  formatDateTime,
  formatDistance,
  formatDuration,
  formatLocation,
  formatReference,
  formatStatus,
  formatVehicle,
} from "../lib/presentation";
import TripActionCard from "../components/trips/TripActionCard";
import {
  subscribeTripTracking,
  unsubscribeTripTracking,
  onDriverLocationUpdate,
  DriverLocation,
} from "../lib/socket";
import { getTrips, getTrip, getTripPayment, confirmPayment, confirmTripCompletion } from "../lib/customer";
import { listTripInspections, transitionTrip } from "../lib/driver";
import { Trip } from "../types/customer";
import { getStoredRouteLocationIssue } from "../lib/routeLocation";

const TERMINAL_TRIP_STATUSES = new Set(["DELIVERED", "COMPLETED", "CANCELLED", "DISPUTED"]);

export default function TripTrackPage() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [driverLocation, setDriverLocation] = useState<DriverLocation | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: -1.2921, lng: 36.8219 });
  const [pickUpInspection, setPickUpInspection] = useState<any | null>(null);
  const [deliveryInspection, setDeliveryInspection] = useState<any | null>(null);
  const [pickupInspectionLoading, setPickupInspectionLoading] = useState(false);
  const [deliveryInspectionLoading, setDeliveryInspectionLoading] = useState(false);
  const [pickupInspectionError, setPickupInspectionError] = useState<string | null>(null);
  const [deliveryInspectionError, setDeliveryInspectionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [calculatedRoute, setCalculatedRoute] = useState<{ distanceMeters: number; durationSeconds: number; polyline: Array<{ lat: number; lng: number }> } | null>(null);

  useEffect(() => {
    if (!tripId) return;

    async function loadTrip() {
      try {
        setLoading(true);
        const response = await getTrips();
        const foundTrip = response.data?.find((t: Trip) => t.id === tripId);

        if (!foundTrip) {
          setError("Trip not found");
          setLoading(false);
          return;
        }

        setTrip(foundTrip);
        const request = foundTrip.transportRequest;
        if (!getStoredRouteLocationIssue(request)
          && typeof request?.pickupLatitude === "number"
          && typeof request?.pickupLongitude === "number") {
          setMapCenter({ lat: request.pickupLatitude, lng: request.pickupLongitude });
        }
        setCalculatedRoute(null);
        setError(null);
      } catch (err: any) {
        setError(err?.error ?? "Failed to load trip");
      } finally {
        setLoading(false);
      }
    }

    loadTrip();
  }, [tripId]);

  useEffect(() => {
    if (!tripId || !trip) return;

    const currentTripId = tripId;

    async function loadInspectionData() {
      setPickupInspectionLoading(true);
      setDeliveryInspectionLoading(true);
      setPickupInspectionError(null);
      setDeliveryInspectionError(null);
      try {
        const response = await listTripInspections(currentTripId);
        const inspections = response.data ?? [];
        setPickUpInspection(inspections.find((inspection: any) => inspection.type === "PICKUP") ?? null);
        setDeliveryInspection(inspections.find((inspection: any) => inspection.type === "DELIVERY") ?? null);
      } catch (err: any) {
        const message = err?.error ?? "Unable to load inspection records.";
        setPickupInspectionError(message);
        setDeliveryInspectionError(message);
        setPickUpInspection(null);
        setDeliveryInspection(null);
      } finally {
        setPickupInspectionLoading(false);
        setDeliveryInspectionLoading(false);
      }
    }

    loadInspectionData();
  }, [tripId, trip]);

  useEffect(() => {
    if (!tripId) return;

    const unsubscribe = onDriverLocationUpdate(tripId, (location: DriverLocation) => {
      setDriverLocation(location);
    });

    subscribeTripTracking(tripId);

    return () => {
      unsubscribe();
      unsubscribeTripTracking(tripId);
    };
  }, [tripId]);

  const tripStatusMeta = useMemo(() => {
    const key = String(trip?.status ?? "");
    return { label: formatStatus(key), tone: `status-${key.toLowerCase() || "info"}` };
  }, [trip?.status]);

  async function handleTripAction(action: string) {
    if (!tripId) return;
    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      const result = await transitionTrip(tripId, action);
      const refreshed = result.data ?? null;
      const nextTrip = refreshed && refreshed.id ? refreshed : await getTrip(tripId).then((r) => r.data);
      setTrip(nextTrip);
      setActionSuccess("Trip state updated successfully.");
    } catch (err: any) {
      setActionError(err?.error ?? "Unable to update trip.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCompletionConfirmation() {
    if (!tripId) return;
    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      const result = await confirmTripCompletion(tripId);
      setTrip(result.data);
      setActionSuccess(
        result.data.status === "COMPLETED"
          ? "Both completion confirmations are recorded. The trip is complete."
          : "Your completion confirmation is recorded. The driver confirmation is still required.",
      );
    } catch (err: any) {
      setActionError(err?.error ?? "Unable to confirm trip completion.");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="screen-card trip-track-shell">
        <div className="trip-track-loading">
          <span className="skeleton skeleton-box trip-map-skeleton" />
        </div>
      </section>
    );
  }

  if (error || !trip) {
    return (
      <section className="screen-card">
        {error ? (
          <div className="error-box">{error}</div>
        ) : (
          <h1>Trip not found</h1>
        )}
      </section>
    );
  }

  const pickupLat = trip.transportRequest?.pickupLatitude;
  const pickupLng = trip.transportRequest?.pickupLongitude;
  const destLat = trip.transportRequest?.destinationLatitude;
  const destLng = trip.transportRequest?.destinationLongitude;
  const routePolylinePoints = decodePolylineOrEmpty(trip.transportRequest?.routePolyline);
  const locationIssue = getStoredRouteLocationIssue(trip.transportRequest);
  const storedRouteIsVerified = !locationIssue
    && routePolylinePoints.length > 1
    && Number(trip.transportRequest?.distanceMeters) > 0
    && Number(trip.transportRequest?.estimatedDurationSeconds) > 0;
  const route = !locationIssue && !storedRouteIsVerified
    && typeof pickupLat === "number" && typeof pickupLng === "number"
    && typeof destLat === "number" && typeof destLng === "number"
    ? { origin: { lat: pickupLat, lng: pickupLng }, destination: { lat: destLat, lng: destLng } }
    : null;

  const markers: Array<{ lat: number; lng: number; title: string; label: string }> = [];
  if (pickupLat !== undefined && pickupLat !== null && pickupLng !== undefined && pickupLng !== null) {
    markers.push({ lat: pickupLat, lng: pickupLng, title: "Pickup Location", label: "A" });
  }

  if (driverLocation) {
    markers.push({ lat: driverLocation.latitude, lng: driverLocation.longitude, title: "Driver Location", label: "•" });
  }

  if (destLat !== undefined && destLat !== null && destLng !== undefined && destLng !== null) {
    markers.push({ lat: destLat, lng: destLng, title: "Destination", label: "B" });
  }

  const driverVehicleSummary = formatVehicle(trip.transportRequest?.vehicleDetail);
  const pickupAddress = formatLocation(
    trip.transportRequest?.pickupAddress || trip.transportRequest?.origin,
    trip.transportRequest?.pickupLatitude,
    trip.transportRequest?.pickupLongitude,
  );
  const destinationAddress = formatLocation(
    trip.transportRequest?.destinationAddress || trip.transportRequest?.destination,
    trip.transportRequest?.destinationLatitude,
    trip.transportRequest?.destinationLongitude,
  );
  const routeDistance = storedRouteIsVerified
    ? formatDistance(trip.transportRequest?.distanceMeters)
    : calculatedRoute ? formatDistance(calculatedRoute.distanceMeters) : "Driving distance unavailable";
  const routeDuration = storedRouteIsVerified
    ? formatDuration(trip.transportRequest?.estimatedDurationSeconds)
    : calculatedRoute ? formatDuration(calculatedRoute.durationSeconds) : "Driving duration unavailable";
  const tripReference = formatReference("trip", trip.id);
  const assignedDriverName = trip.driver?.user?.fullName?.trim() || "Driver name not provided";
  const isCompleted = trip.status === "COMPLETED" || trip.status === "DELIVERED";
  const hasArchivedInspections =
    (pickUpInspection && trip.status !== "TRIP_START_PENDING") ||
    (deliveryInspection && trip.status !== "DELIVERY_PENDING");

  return (
    <section className="screen-card trip-track-shell">
      <div className="trip-track-topbar">
        <div>
          <p className="eyebrow">{tripReference}</p>
          <h1>{pickupAddress} → {destinationAddress}</h1>
          <p>{formatDateTime(trip.transportRequest?.travelDateTime ?? trip.createdAt)}</p>
        </div>
        <Link to="/customer/requests" className="secondary-link-button">
          Back to requests
        </Link>
      </div>

      {locationIssue ? (
        <div className="error-box" role="alert">{locationIssue}</div>
      ) : null}
      <div className="trip-map-stage">
        {!locationIssue ? (
          <Map
            center={mapCenter}
            zoom={14}
            markers={markers}
            polyline={storedRouteIsVerified ? routePolylinePoints : calculatedRoute?.polyline}
            route={route}
            onRouteResult={(result) => setCalculatedRoute(result)}
            style={{ width: "100%", height: "100%", borderRadius: "28px" }}
            className="trip-map"
          />
        ) : (
          <div className="empty-state"><p>Map hidden until the trip locations are corrected.</p></div>
        )}

        <div className="trip-map-chip">
          <span className={`status-badge ${tripStatusMeta.tone}`}>{tripStatusMeta.label}</span>
        </div>

        <div className="trip-floating-card">
          <div className="trip-floating-header">
            <div className="driver-badge">🚗</div>
            <div>
              <span className="trip-card-label">Driver</span>
              <h2>{assignedDriverName}</h2>
            </div>
          </div>

          <div className="trip-driver-meta">
            <span className="trip-meta-status">{tripStatusMeta.label}</span>
            {trip.status === "PAYMENT_PENDING" ? (
              <span className="trip-meta-status trip-meta-status-warning">Payment pending</span>
            ) : null}
          </div>

          <div className="trip-route-summary">
            <div>
              <span className="trip-card-label">Pickup</span>
              <strong>{pickupAddress}</strong>
            </div>
            <div className="route-arrow-stack">↓</div>
            <div>
              <span className="trip-card-label">Destination</span>
              <strong>{destinationAddress}</strong>
            </div>
          </div>

          <div className="trip-info-grid">
            <div>
              <span className="trip-card-label">Vehicle</span>
              <strong>{driverVehicleSummary}</strong>
            </div>
            <div>
              <span className="trip-card-label">Distance</span>
              <strong>{routeDistance}</strong>
            </div>
            <div>
              <span className="trip-card-label">Duration</span>
              <strong>{routeDuration}</strong>
            </div>
          </div>

          {driverLocation && (
            <div className="trip-driver-location">
              <span className="trip-card-label">Driver location</span>
              <strong>{formatLocation(null, driverLocation.latitude, driverLocation.longitude)}</strong>
            </div>
          )}

          <div className="trip-card-actions">
            <Link to="/customer/requests" className="secondary-link-button">View requests</Link>
            {isCompleted ? (
              <span className="trip-complete-badge">Trip complete</span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="trip-details-stack">
        <div className="trip-detail-panel">
          <span className="eyebrow">Trip overview</span>
          <div className="trip-detail-grid">
            <div>
              <span className="trip-card-label">Status</span>
              <strong>{tripStatusMeta.label}</strong>
            </div>
            <div>
              <span className="trip-card-label">Trip ID</span>
              <strong>{tripReference}</strong>
            </div>
            <div>
              <span className="trip-card-label">Pickup</span>
              <strong>{pickupAddress}</strong>
            </div>
            <div>
              <span className="trip-card-label">Destination</span>
              <strong>{destinationAddress}</strong>
            </div>
            <div>
              <span className="trip-card-label">Distance</span>
              <strong>{routeDistance}</strong>
            </div>
            <div>
              <span className="trip-card-label">Estimated duration</span>
              <strong>{routeDuration}</strong>
            </div>
            <div>
              <span className="trip-card-label">Travel date</span>
              <strong>{formatDateTime(trip.transportRequest?.travelDateTime ?? trip.createdAt)}</strong>
            </div>
          </div>
        </div>

        {(hasArchivedInspections || TERMINAL_TRIP_STATUSES.has(trip.status)) && (
          <div className="trip-detail-panel" style={{ marginTop: 24 }}>
            <span className="eyebrow">Inspection records</span>
            {pickupInspectionLoading || deliveryInspectionLoading ? (
              <p role="status" style={{ marginTop: 12 }}>Loading inspection records…</p>
            ) : pickupInspectionError || deliveryInspectionError ? (
              <div className="error-box" style={{ marginTop: 12 }}>
                {pickupInspectionError ?? deliveryInspectionError}
              </div>
            ) : pickUpInspection || deliveryInspection ? (
              <div style={{ display: "grid", gap: 16, marginTop: 12 }}>
                {pickUpInspection && trip.status !== "TRIP_START_PENDING" && (
                  <TripInspectionCard title="Pickup inspection" inspection={pickUpInspection} />
                )}
                {deliveryInspection && trip.status !== "DELIVERY_PENDING" && (
                  <TripInspectionCard title="Delivery inspection" inspection={deliveryInspection} />
                )}
              </div>
            ) : (
              <p style={{ marginTop: 12 }}>No inspection records were submitted for this trip.</p>
            )}
          </div>
        )}

        {trip.status === "TRIP_START_PENDING" && (
          <div className="trip-detail-panel" style={{ marginTop: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span className="eyebrow">Review & Activate Trip</span>
              <span className="status-badge status-trip_start_pending">Waiting for activation</span>
            </div>

            <p style={{ margin: "0 0 16px", color: "#465467" }}>
              The driver has completed the pickup inspection and this trip is waiting for your review and activation before travel can begin.
            </p>

            {pickupInspectionLoading ? (
              <div style={{ padding: 16, borderRadius: 16, background: "#f8fafc", border: "1px solid #dfe6ee" }}>
                Loading pickup inspection details…
              </div>
            ) : (
              <TripInspectionCard
                title="Pickup inspection review"
                inspection={pickUpInspection}
                loading={false}
                error={pickupInspectionError}
                emptyMessage="Pickup inspection details are not available yet."
              />
            )}

            <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                className="primary-button"
                disabled={actionLoading}
                onClick={() => handleTripAction("activateTrip")}
              >
                {actionLoading ? "Activating trip..." : "Activate Trip"}
              </button>
            </div>
          </div>
        )}

        {trip.status === "DELIVERY_PENDING" && (
          <div className="trip-detail-panel" style={{ marginTop: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span className="eyebrow">Delivery Review</span>
              <span className="status-badge status-delivery_pending">Delivery pending</span>
            </div>

            <p style={{ margin: "0 0 16px", color: "#465467" }}>
              The driver has submitted the delivery inspection. Review the final handover details and confirm delivery.
            </p>

            {deliveryInspectionLoading ? (
              <div style={{ padding: 16, borderRadius: 16, background: "#f8fafc", border: "1px solid #dfe6ee" }}>
                Loading delivery inspection details…
              </div>
            ) : (
              <TripInspectionCard
                title="Delivery inspection review"
                inspection={deliveryInspection}
                loading={false}
                error={deliveryInspectionError}
                emptyMessage="Delivery inspection details are not available yet."
              />
            )}

            <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                className="primary-button"
                disabled={actionLoading}
                onClick={() => handleTripAction("confirmDelivery")}
              >
                {actionLoading ? "Confirming delivery..." : "Confirm Delivery"}
              </button>
            </div>
          </div>
        )}

        {trip.status === "DELIVERED" || trip.status === "COMPLETED" ? (
          <div className="trip-detail-panel" style={{ marginTop: 24 }}>
            <span className="eyebrow">Independent completion confirmations</span>
            <p style={{ color: "#465467" }}>
              Final driver compensation is credited only after the assigned driver and an authorized customer each confirm completion.
            </p>
            <div className="detail-list">
              <div>
                <dt>Customer confirmation</dt>
                <dd>{trip.customerCompletionConfirmedAt ? "Recorded" : "Awaiting your confirmation"}</dd>
              </div>
              <div>
                <dt>Driver confirmation</dt>
                <dd>{trip.driverCompletionConfirmedAt ? "Recorded" : "Awaiting the assigned driver"}</dd>
              </div>
            </div>
            {trip.status === "DELIVERED" && !trip.customerCompletionConfirmedAt ? (
              <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className="primary-button"
                  disabled={actionLoading}
                  onClick={handleCompletionConfirmation}
                >
                  {actionLoading ? "Recording confirmation..." : "Confirm trip completion"}
                </button>
              </div>
            ) : null}
          </div>
        ) : null}

        {actionError && (
          <div className="error-box" style={{ marginTop: 24 }}>{actionError}</div>
        )}

        {actionSuccess && (
          <div className="success-box" style={{ marginTop: 24 }}>{actionSuccess}</div>
        )}

        {driverLocation && (
          <div className="trip-detail-panel">
            <span className="eyebrow">Driver updates</span>
            <div className="trip-detail-grid single-column">
              <div>
                <span className="trip-card-label">Latest location</span>
                <strong>{formatLocation(null, driverLocation.latitude, driverLocation.longitude)}</strong>
              </div>
              <div>
                <span className="trip-card-label">Updated</span>
                <strong>{new Date(driverLocation.timestamp).toLocaleTimeString()}</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function decodePolylineOrEmpty(polyline?: string | null): Array<{ lat: number; lng: number }> {
  if (!polyline || !polyline.trim()) return [];

  try {
    const points: Array<{ lat: number; lng: number }> = [];
    let lat = 0;
    let lng = 0;

    for (let i = 0; i < polyline.length; ) {
      let result = 0;
      let shift = 0;
      let byte = 0;

      do {
        byte = polyline.charCodeAt(i++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      lat += (result & 1 ? ~(result >> 1) : result >> 1);

      result = 0;
      shift = 0;

      do {
        byte = polyline.charCodeAt(i++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      lng += (result & 1 ? ~(result >> 1) : result >> 1);

      points.push({ lat: lat / 1e5, lng: lng / 1e5 });
    }

    return points;
  } catch {
    return [];
  }
}
