import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Map from "../components/map/Map";
import { confirmTripCompletion, createInspection, getTrip, transitionTrip, uploadTripInspectionPhoto } from "../lib/driver";
import { getApiUrl } from "../lib/api";
import { Trip } from "../types/customer";
import { getStoredRouteLocationIssue } from "../lib/routeLocation";
import {
  formatDateTime,
  formatDisplayName,
  formatDistance as displayDistance,
  formatDuration as displayDuration,
  formatLocation,
  formatReference,
  formatStatus,
  formatVehicle,
} from "../lib/presentation";

const STATUS_META: Record<string, { label: string; tone: string }> = {
  PAYMENT_PENDING: { label: "Payment pending", tone: "status-payment_pending" },
  BOOKED: { label: "Booked", tone: "status-booked" },
  PICKUP_PENDING: { label: "Pickup pending", tone: "status-pickup_pending" },
  PICKUP_INSPECTION: { label: "Pickup inspection", tone: "status-pickup_inspection" },
  TRIP_START_PENDING: { label: "Trip start pending", tone: "status-trip_start_pending" },
  TRIP_ACTIVE: { label: "En route", tone: "status-trip_active" },
  IN_TRANSIT: { label: "In transit", tone: "status-in_transit" },
  DELIVERY_PENDING: { label: "Delivery pending", tone: "status-delivery_pending" },
  DELIVERED: { label: "Delivered", tone: "status-delivered" },
  COMPLETED: { label: "Completed", tone: "status-completed" },
  CANCELLED: { label: "Cancelled", tone: "status-cancelled" },
  DISPUTED: { label: "Disputed", tone: "status-disputed" },
};

const DRIVER_ACTION_SEQUENCE: Array<{ status: string; label: string; action: string }> = [
  { status: "BOOKED", label: "Begin Pickup", action: "beginPickup" },
  { status: "PICKUP_PENDING", label: "Complete Pickup Inspection", action: "completePickupInspection" },
  { status: "PICKUP_INSPECTION", label: "Request Trip Start", action: "requestTripStart" },
  { status: "TRIP_ACTIVE", label: "Begin Transit", action: "beginTransit" },
  { status: "IN_TRANSIT", label: "Mark Delivery Pending", action: "markDeliveryPending" },
];

function formatDistance(distanceMeters?: number | null) {
  return displayDistance(distanceMeters);
}

function formatDuration(estimatedDurationSeconds?: number | null) {
  return displayDuration(estimatedDurationSeconds);
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

export default function DriverTripDetailPage() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [inspectionSubmitting, setInspectionSubmitting] = useState(false);
  const [inspectionError, setInspectionError] = useState<string | null>(null);
  const [inspectionPhotoUploads, setInspectionPhotoUploads] = useState<Array<{ file: File; preview: string; uploading: boolean; url?: string; error?: string }>>([]);
  const [inspectionForm, setInspectionForm] = useState({
    odometer: "",
    fuelLevel: "",
    vehicleCondition: "",
    damageNotes: "",
    observations: "",
    handoverConfirmed: false,
  });
  const [calculatedRoute, setCalculatedRoute] = useState<{ distanceMeters: number; durationSeconds: number; polyline: Array<{ lat: number; lng: number }> } | null>(null);

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

  async function confirmCompletion() {
    if (!tripId) return;
    setActionLoading(true);
    setActionError(null);
    try {
      const response = await confirmTripCompletion(tripId);
      setTrip(response.data);
    } catch (error: any) {
      setActionError(error?.error ?? "Unable to confirm trip completion.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handlePhotoFileInput(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.currentTarget.files;
    if (!files) return;

    const selectedFiles = Array.from(files);
    const newUploads = selectedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: true,
    }));

    setInspectionPhotoUploads((current) => [...current, ...newUploads]);
    event.currentTarget.value = "";

    if (!tripId) return;

    await Promise.all(selectedFiles.map(async (file) => {
      try {
        const result = await uploadTripInspectionPhoto(tripId, file);
        const uploadedPhoto = result.data?.[0];
        if (!uploadedPhoto?.url) {
          throw new Error("Invalid upload response");
        }

        setInspectionPhotoUploads((current) =>
          current.map((photo) =>
            photo.file === file
              ? { ...photo, uploading: false, url: uploadedPhoto.url, error: undefined }
              : photo,
          ),
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : typeof error === "object" && error !== null && "error" in error && typeof error.error === "string"
              ? error.error
              : "Upload failed";
        setInspectionPhotoUploads((current) =>
          current.map((photo) =>
            photo.file === file ? { ...photo, uploading: false, error: errorMessage } : photo,
          ),
        );
      }
    }));
  }

  async function uploadInspectionPhoto(tripId: string, photoIndex: number) {
    const photo = inspectionPhotoUploads[photoIndex];
    if (!photo || photo.uploading) return;

    setInspectionPhotoUploads((current) => {
      const updated = [...current];
      updated[photoIndex] = { ...updated[photoIndex], uploading: true, error: undefined };
      return updated;
    });

    try {
      const formData = new FormData();
      formData.append("files", photo.file);

      const response = await fetch(getApiUrl(`/api/trips/${tripId}/inspections/photos`), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("cargo_kenya_token") ?? ""}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const result = await response.json();
      const uploadedPhoto = result.data && result.data[0];

      if (!uploadedPhoto || !uploadedPhoto.url) {
        throw new Error("Invalid upload response");
      }

      setInspectionPhotoUploads((current) => {
        const updated = [...current];
        updated[photoIndex] = {
          ...updated[photoIndex],
          uploading: false,
          url: uploadedPhoto.url,
        };
        return updated;
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Upload failed";
      setInspectionPhotoUploads((current) => {
        const updated = [...current];
        updated[photoIndex] = {
          ...updated[photoIndex],
          uploading: false,
          error: errorMessage,
        };
        return updated;
      });
    }
  }

  function removeInspectionPhoto(photoIndex: number) {
    setInspectionPhotoUploads((current) => {
      const updated = [...current];
      const photo = updated[photoIndex];
      if (photo.preview) {
        URL.revokeObjectURL(photo.preview);
      }
      updated.splice(photoIndex, 1);
      return updated;
    });
  }

  async function handleInspectionSubmit() {
    if (!tripId || !trip) return;

    const activeType = trip.status === "PICKUP_PENDING" ? "PICKUP" : trip.status === "DELIVERY_PENDING" ? "DELIVERY" : null;
    if (!activeType) return;

    // Validate odometer
    const odometer = Number(inspectionForm.odometer);
    if (!Number.isFinite(odometer) || odometer < 0) {
      setInspectionError("Odometer is required and must be a non-negative number.");
      return;
    }

    // Validate vehicle condition
    if (inspectionForm.vehicleCondition.trim().length === 0) {
      setInspectionError("Vehicle condition is required.");
      return;
    }

    // Validate fuel level if provided
    const fuelLevel =
      inspectionForm.fuelLevel.trim() === "" ? undefined : Number(inspectionForm.fuelLevel);
    if (fuelLevel !== undefined && (!Number.isFinite(fuelLevel) || fuelLevel < 0)) {
      setInspectionError("Fuel level must be a non-negative number when provided.");
      return;
    }

    // Collect uploaded photo URLs
    const photoUrls = inspectionPhotoUploads
      .filter((photo) => photo.url && !photo.error)
      .map((photo) => photo.url!);

    if (photoUrls.length === 0) {
      setInspectionError("At least one photo must be successfully uploaded.");
      return;
    }

    // Check for pending uploads
    if (inspectionPhotoUploads.some((photo) => photo.uploading)) {
      setInspectionError("Please wait for all photos to finish uploading.");
      return;
    }

    // Check for upload errors
    const failedPhotos = inspectionPhotoUploads.filter((photo) => photo.error);
    if (failedPhotos.length > 0) {
      setInspectionError(
        `${failedPhotos.length} photo(s) failed to upload. Please fix errors or retry.`
      );
      return;
    }

    setInspectionSubmitting(true);
    setInspectionError(null);

    try {
      await createInspection(tripId, {
        type: activeType,
        photoUrls,
        odometer,
        fuelLevel,
        vehicleCondition: inspectionForm.vehicleCondition.trim(),
        damageNotes: inspectionForm.damageNotes.trim() || undefined,
        observations: inspectionForm.observations.trim() || undefined,
        handoverConfirmed: inspectionForm.handoverConfirmed,
      });

      const refreshed = await getTrip(tripId);
      setTrip(refreshed.data ?? null);

      // Clean up preview URLs
      inspectionPhotoUploads.forEach((photo) => {
        URL.revokeObjectURL(photo.preview);
      });

      setInspectionPhotoUploads([]);
      setInspectionForm({
        odometer: "",
        fuelLevel: "",
        vehicleCondition: "",
        damageNotes: "",
        observations: "",
        handoverConfirmed: false,
      });
    } catch (e: any) {
      setInspectionError(e?.error ?? "Unable to submit inspection.");
    } finally {
      setInspectionSubmitting(false);
    }
  }

  const nextDriverAction = useMemo(() => {
    if (!trip) return null;
    return DRIVER_ACTION_SEQUENCE.find((entry) => entry.status === trip.status) ?? null;
  }, [trip]);

  const currentLifecycleCard = useMemo(() => {
    if (!trip) return null;

    if (trip.status === "PICKUP_PENDING") {
      return {
        title: "Pickup Inspection Required",
        description: "Record the vehicle condition and evidence before the trip can move to the customer review step.",
        badge: "status-pickup_pending",
      };
    }

    if (trip.status === "PICKUP_INSPECTION") {
      return {
        title: "Request Trip Start",
        description: "The pickup inspection is complete. Submit the trip start request so the customer can review and activate the trip.",
        badge: "status-pickup_inspection",
      };
    }

    if (trip.status === "TRIP_START_PENDING") {
      return {
        title: "Waiting for Customer Activation",
        description: "The pickup inspection is complete and the customer must review the details and activate the trip before it can begin.",
        badge: "status-trip_start_pending",
      };
    }

    if (trip.status === "TRIP_ACTIVE") {
      return {
        title: "Begin Transit",
        description: "The trip is active and ready to move toward the destination.",
        badge: "status-trip_active",
      };
    }

    if (trip.status === "IN_TRANSIT") {
      return {
        title: "Mark Delivery Pending",
        description: "The trip is in progress. Mark delivery pending when you reach the destination and are ready for the handover inspection.",
        badge: "status-in_transit",
      };
    }

    if (trip.status === "DELIVERY_PENDING") {
      return {
        title: "Delivery Inspection Required",
        description: "Record the final handover condition and evidence before the customer confirms the delivery.",
        badge: "status-delivery_pending",
      };
    }

    return null;
  }, [trip]);

  const routeStatusMeta = useMemo(() => {
    if (!trip) return { label: "Trip status", tone: "status-info" };
    const key = String(trip.status ?? "");
    return STATUS_META[key] ?? {
      label: formatStatus(key),
      tone: `status-${key.toLowerCase() || "info"}`,
    };
  }, [trip]);

  const inspectionType = trip?.status === "PICKUP_PENDING" ? "PICKUP" : trip?.status === "DELIVERY_PENDING" ? "DELIVERY" : null;
  const isInspectionRequired = inspectionType !== null;

  if (loading) {
    return (
      <section className="screen-card">
        <div className="trip-shell-loading">
          <span className="skeleton skeleton-box trip-shell-map" />
          <span className="skeleton skeleton-box trip-shell-card" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="screen-card">
        <div className="error-box">{error}</div>
      </section>
    );
  }

  if (!trip) {
    return (
      <section className="screen-card">
        <div className="empty-state">
          <p>Trip not found.</p>
        </div>
      </section>
    );
  }

  const inspectionValid =
    isInspectionRequired &&
    inspectionPhotoUploads.some((photo) => photo.url && !photo.error) &&
    inspectionForm.odometer.trim().length > 0 &&
    Number(inspectionForm.odometer) >= 0 &&
    inspectionForm.vehicleCondition.trim().length > 0 &&
    (inspectionForm.fuelLevel.trim() === "" || Number(inspectionForm.fuelLevel) >= 0) &&
    !inspectionPhotoUploads.some((photo) => photo.uploading || photo.error);

  const pickupLat = trip.transportRequest?.pickupLatitude;
  const pickupLng = trip.transportRequest?.pickupLongitude;
  const destLat = trip.transportRequest?.destinationLatitude;
  const destLng = trip.transportRequest?.destinationLongitude;
  const routePolyline = decodePolylineOrEmpty(trip.transportRequest?.routePolyline);
  const locationIssue = getStoredRouteLocationIssue(trip.transportRequest);
  const storedRouteIsVerified = !locationIssue
    && routePolyline.length > 1
    && Number(trip.transportRequest?.distanceMeters) > 0
    && Number(trip.transportRequest?.estimatedDurationSeconds) > 0;
  const route = !locationIssue && !storedRouteIsVerified
    && typeof pickupLat === "number" && typeof pickupLng === "number"
    && typeof destLat === "number" && typeof destLng === "number"
    ? { origin: { lat: pickupLat, lng: pickupLng }, destination: { lat: destLat, lng: destLng } }
    : null;

  const markers: Array<{ lat: number; lng: number; title?: string; label?: string }> = [];
  if (pickupLat !== undefined && pickupLat !== null && pickupLng !== undefined && pickupLng !== null) {
    markers.push({ lat: pickupLat, lng: pickupLng, title: "Pickup", label: "A" });
  }
  if (destLat !== undefined && destLat !== null && destLng !== undefined && destLng !== null) {
    markers.push({ lat: destLat, lng: destLng, title: "Destination", label: "B" });
  }

  const vehicleSummary = formatVehicle(trip.transportRequest?.vehicleDetail);
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
  const customerName = formatDisplayName(trip.customer?.fullName, "Customer name not provided");
  const completedTrip = trip.status === "COMPLETED";

  return (
    <section className="screen-card driver-trip-shell">
      <div className="driver-trip-header">
        <div>
          <p className="eyebrow">{formatReference("trip", trip.id)} · Active trip</p>
          <h1>{pickupAddress} → {destinationAddress}</h1>
          <p>{formatDateTime(trip.transportRequest?.travelDateTime ?? trip.createdAt)}</p>
        </div>
        <span className={`status-badge ${routeStatusMeta.tone}`}>{routeStatusMeta.label}</span>
      </div>

      {locationIssue ? <div className="error-box" role="alert">{locationIssue}</div> : null}
      <div className="driver-trip-map-stage">
        {!locationIssue ? (
          <Map
            center={typeof pickupLat === "number" && typeof pickupLng === "number" ? { lat: pickupLat, lng: pickupLng } : undefined}
            zoom={12}
            markers={markers}
            polyline={storedRouteIsVerified ? routePolyline : calculatedRoute?.polyline}
            route={route}
            onRouteResult={(result) => setCalculatedRoute(result)}
            style={{ width: "100%", height: "100%", borderRadius: "24px" }}
            className="driver-trip-map"
          />
        ) : (
          <div className="empty-state"><p>Map hidden until the trip locations are corrected.</p></div>
        )}

        <div className="driver-trip-float-card">
          <div className="driver-trip-card-top">
            <div>
              <span className="job-detail-label">Customer</span>
              <strong>{customerName}</strong>
            </div>
            <span className={`status-badge ${routeStatusMeta.tone}`}>{routeStatusMeta.label}</span>
          </div>

          <div className="driver-trip-route">
            <div>
              <span className="job-detail-label">Pickup</span>
              <strong>{pickupAddress}</strong>
            </div>
            <span className="route-divider">↓</span>
            <div>
              <span className="job-detail-label">Destination</span>
              <strong>{destinationAddress}</strong>
            </div>
          </div>

          <div className="driver-trip-grid">
            <div>
              <span className="job-detail-label">Vehicle</span>
              <strong>{vehicleSummary}</strong>
            </div>
            <div>
              <span className="job-detail-label">Distance</span>
              <strong>{storedRouteIsVerified ? formatDistance(trip.transportRequest?.distanceMeters) : calculatedRoute ? formatDistance(calculatedRoute.distanceMeters) : "Driving distance unavailable"}</strong>
            </div>
            <div>
              <span className="job-detail-label">Duration</span>
              <strong>{storedRouteIsVerified ? formatDuration(trip.transportRequest?.estimatedDurationSeconds) : calculatedRoute ? formatDuration(calculatedRoute.durationSeconds) : "Driving duration unavailable"}</strong>
            </div>
          </div>

              {!completedTrip && nextDriverAction && trip.status !== "PICKUP_PENDING" && trip.status !== "TRIP_START_PENDING" && (
            <button
              type="button"
              className="primary-button driver-primary-button"
              onClick={() => doAction(nextDriverAction.action)}
              disabled={actionLoading}
            >
              {actionLoading ? "Submitting action..." : nextDriverAction.label}
            </button>
          )}

          {trip.status === "TRIP_START_PENDING" && (
            <div className="driver-trip-complete-panel" style={{ marginTop: 12 }}>
              <span className="badge badge-warning">Waiting</span>
              <p>Pickup inspection is complete. The customer must review and activate the trip before it can begin.</p>
            </div>
          )}

          {completedTrip && (
            <div className="driver-trip-complete-panel">
              <span className="badge badge-success">Trip complete</span>
              <p>Trip status is {routeStatusMeta.label}. No further driver action is required.</p>
            </div>
          )}
        </div>
      </div>

      {currentLifecycleCard && (
        <div className="trip-detail-panel" style={{ marginTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <span className="eyebrow">Lifecycle action</span>
            <span className={`status-badge ${currentLifecycleCard.badge}`}>{currentLifecycleCard.title}</span>
          </div>
          <p style={{ color: "#465467", margin: 0, marginBottom: 16 }}>{currentLifecycleCard.description}</p>

          {trip.status === "PICKUP_INSPECTION" && (
            <button
              type="button"
              className="primary-button driver-primary-button"
              onClick={() => doAction("requestTripStart")}
              disabled={actionLoading}
            >
              {actionLoading ? "Requesting trip start..." : "Request Trip Start"}
            </button>
          )}

          {trip.status === "TRIP_ACTIVE" && (
            <button
              type="button"
              className="primary-button driver-primary-button"
              onClick={() => doAction("beginTransit")}
              disabled={actionLoading}
            >
              {actionLoading ? "Starting transit..." : "Begin Transit"}
            </button>
          )}

          {trip.status === "IN_TRANSIT" && (
            <button
              type="button"
              className="primary-button driver-primary-button"
              onClick={() => doAction("markDeliveryPending")}
              disabled={actionLoading}
            >
              {actionLoading ? "Marking delivery pending..." : "Mark Delivery Pending"}
            </button>
          )}
        </div>
      )}

      {trip.status === "DELIVERED" || trip.status === "COMPLETED" ? (
        <div className="trip-detail-panel" style={{ marginTop: 24 }}>
          <span className="eyebrow">Independent completion confirmations</span>
          <p style={{ color: "#465467" }}>
            Final driver compensation is credited only after you and the authorized customer confirm completion separately.
          </p>
          <div className="detail-list">
            <div>
              <dt>Driver confirmation</dt>
              <dd>{trip.driverCompletionConfirmedAt ? "Recorded" : "Awaiting your confirmation"}</dd>
            </div>
            <div>
              <dt>Customer confirmation</dt>
              <dd>{trip.customerCompletionConfirmedAt ? "Recorded" : "Awaiting the authorized customer"}</dd>
            </div>
          </div>
          {trip.status === "DELIVERED" && !trip.driverCompletionConfirmedAt ? (
            <button
              type="button"
              className="primary-button driver-primary-button"
              onClick={confirmCompletion}
              disabled={actionLoading}
            >
              {actionLoading ? "Recording confirmation..." : "Confirm trip completion"}
            </button>
          ) : null}
        </div>
      ) : null}

      {isInspectionRequired && (
        <div className="trip-detail-panel" style={{ marginTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <span className="eyebrow">{inspectionType === "PICKUP" ? "Pickup inspection" : "Delivery inspection"}</span>
            <span className={`status-badge ${inspectionType === "PICKUP" ? "status-pickup_pending" : "status-delivery_pending"}`}>
              {inspectionType}
            </span>
          </div>

          {trip.status === "PICKUP_PENDING" && (
            <div style={{ marginBottom: 16, padding: "12px 14px", borderRadius: 12, background: "#fff5ec", border: "1px solid #ffd7ad", color: "#8b4a0d" }}>
              Pickup inspection required before the trip can be reviewed by the customer.
            </div>
          )}

          {trip.status === "DELIVERY_PENDING" && (
            <div style={{ marginBottom: 16, padding: "12px 14px", borderRadius: 12, background: "#ecf8ff", border: "1px solid #badfff", color: "#0b5d8a" }}>
              Delivery inspection required. After submission, the customer will confirm the handover.
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <div>
              <label className="job-detail-label" style={{ display: "block", marginBottom: 8 }}>Inspection type</label>
              <input value={inspectionType ?? ""} readOnly style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #d7dfe7", background: "#f4f7fa" }} />
            </div>

            <div>
              <label className="job-detail-label" style={{ display: "block", marginBottom: 8 }}>Odometer (required)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={inspectionForm.odometer}
                onChange={(event) => setInspectionForm((current) => ({ ...current, odometer: event.target.value }))}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #d7dfe7" }}
              />
            </div>

            <div>
              <label className="job-detail-label" style={{ display: "block", marginBottom: 8 }}>Fuel level</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={inspectionForm.fuelLevel}
                onChange={(event) => setInspectionForm((current) => ({ ...current, fuelLevel: event.target.value }))}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #d7dfe7" }}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label className="job-detail-label" style={{ display: "block", marginBottom: 8 }}>Vehicle condition (required)</label>
              <input
                value={inspectionForm.vehicleCondition}
                onChange={(event) => setInspectionForm((current) => ({ ...current, vehicleCondition: event.target.value }))}
                placeholder="Good / minor scratches / damage observed"
                style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #d7dfe7" }}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label className="job-detail-label" style={{ display: "block", marginBottom: 8 }}>Inspection photos (required)</label>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <label style={{ flex: 1 }}>
                  <button
                    type="button"
                    className="secondary-button"
                    style={{ width: "100%", padding: "10px 12px" }}
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/jpeg,image/png,image/webp";
                      input.multiple = true;
                      input.onchange = (e) => {
                        handlePhotoFileInput(e as any);
                      };
                      input.click();
                    }}
                  >
                    📱 Choose from device
                  </button>
                </label>
                <label style={{ flex: 1 }}>
                  <button
                    type="button"
                    className="secondary-button"
                    style={{ width: "100%", padding: "10px 12px" }}
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/jpeg,image/png,image/webp";
                      input.capture = "environment";
                      input.onchange = (e) => {
                        handlePhotoFileInput(e as any);
                      };
                      input.click();
                    }}
                  >
                    📸 Take photo
                  </button>
                </label>
              </div>

              {inspectionPhotoUploads.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 8 }}>
                    {inspectionPhotoUploads.map((photo, index) => (
                      <div
                        key={index}
                        style={{
                          position: "relative",
                          borderRadius: 8,
                          overflow: "hidden",
                          border: "1px solid #d7dfe7",
                          aspectRatio: "1",
                        }}
                      >
                        <img
                          src={photo.preview}
                          alt={`Preview ${index + 1}`}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                        {photo.uploading && (
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              background: "rgba(0,0,0,0.5)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: "12px",
                            }}
                          >
                            Uploading...
                          </div>
                        )}
                        {photo.url && !photo.error && (
                          <div
                            style={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                              background: "#10b981",
                              color: "white",
                              borderRadius: 4,
                              padding: "2px 6px",
                              fontSize: "10px",
                            }}
                          >
                            ✓
                          </div>
                        )}
                        {photo.error && (
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              background: "rgba(239,68,68,0.8)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: "12px",
                              textAlign: "center",
                              padding: 4,
                            }}
                          >
                            Error
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeInspectionPhoto(index)}
                          style={{
                            position: "absolute",
                            top: 4,
                            left: 4,
                            background: "rgba(0,0,0,0.6)",
                            color: "white",
                            border: "none",
                            borderRadius: 4,
                            padding: "2px 6px",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                          disabled={photo.uploading}
                        >
                          ✕
                        </button>
                        {!photo.uploading && !photo.url && (
                          <button
                            type="button"
                            onClick={() => uploadInspectionPhoto(tripId!, index)}
                            style={{
                              position: "absolute",
                              bottom: 4,
                              left: 4,
                              right: 4,
                              background: "#3b82f6",
                              color: "white",
                              border: "none",
                              borderRadius: 4,
                              padding: "4px",
                              fontSize: "10px",
                              cursor: "pointer",
                            }}
                          >
                            Upload
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 8, fontSize: "12px", color: "#6b7280" }}>
                    {inspectionPhotoUploads.filter((p) => p.url && !p.error).length} of {inspectionPhotoUploads.length} uploaded
                  </div>
                </div>
              )}

              {inspectionPhotoUploads.length === 0 && (
                <div style={{ padding: 12, borderRadius: 10, background: "#f8fafc", color: "#526071", border: "1px solid #e7edf5" }}>
                  No photos selected yet. Choose or take at least one photo.
                </div>
              )}
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label className="job-detail-label" style={{ display: "block", marginBottom: 8 }}>Damage notes</label>
              <textarea
                value={inspectionForm.damageNotes}
                onChange={(event) => setInspectionForm((current) => ({ ...current, damageNotes: event.target.value }))}
                placeholder="Describe damage or note none"
                rows={3}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #d7dfe7", resize: "vertical" }}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label className="job-detail-label" style={{ display: "block", marginBottom: 8 }}>Observations</label>
              <textarea
                value={inspectionForm.observations}
                onChange={(event) => setInspectionForm((current) => ({ ...current, observations: event.target.value }))}
                placeholder="Optional case notes or trip observations"
                rows={3}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #d7dfe7", resize: "vertical" }}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={inspectionForm.handoverConfirmed}
                  onChange={(event) => setInspectionForm((current) => ({ ...current, handoverConfirmed: event.target.checked }))}
                />
                Handover confirmed
              </label>
            </div>
          </div>

          {inspectionError && <div className="error-box" style={{ marginTop: 16 }}>{inspectionError}</div>}

          <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
            {!inspectionValid && (
              <p role="status" style={{ margin: "0 auto 0 0", alignSelf: "center", color: "#526071" }}>
                {inspectionPhotoUploads.some((photo) => photo.uploading)
                  ? "Uploading inspection photos…"
                  : inspectionPhotoUploads.some((photo) => photo.error)
                    ? "A photo upload failed. Use its Upload button to retry."
                    : inspectionPhotoUploads.length === 0
                      ? "Choose at least one photo; selected photos upload automatically."
                      : inspectionForm.odometer.trim().length === 0
                        ? "Enter the odometer reading to enable submission."
                        : inspectionForm.vehicleCondition.trim().length === 0
                          ? "Enter the vehicle condition to enable submission."
                          : "Enter a valid fuel level or leave it blank."}
              </p>
            )}
            <button
              type="button"
              className="primary-button driver-primary-button"
              disabled={inspectionSubmitting || !inspectionValid}
              onClick={handleInspectionSubmit}
            >
              {inspectionSubmitting ? "Submitting inspection…" : inspectionType === "PICKUP" ? "Submit pickup inspection" : "Submit delivery inspection"}
            </button>
          </div>
        </div>
      )}

      {trip.status === "DELIVERY_PENDING" && (
        <div className="trip-detail-panel" style={{ marginTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <span className="eyebrow">Customer confirmation</span>
            <span className="status-badge status-delivery_pending">Waiting for customer confirmation</span>
          </div>
          <p style={{ margin: "10px 0 0", color: "#465467" }}>The delivery inspection has been submitted. The customer must review the evidence and confirm delivery.</p>
        </div>
      )}

      <div className="driver-trip-meta-stack">
        <div className="trip-detail-panel">
          <span className="eyebrow">Trip status</span>
          <div className="driver-status-flow">
            {Object.values(STATUS_META).map((item) => (
              <span key={item.label} className={`status-badge ${item.tone} ${routeStatusMeta.label === item.label ? "current" : ""}`}>
                {item.label}
              </span>
            ))}
          </div>
        </div>

        <div className="trip-detail-panel">
          <span className="eyebrow">Trip details</span>
          <div className="driver-trip-detail-grid">
            <div>
              <span className="job-detail-label">Pickup</span>
              <strong>{pickupAddress}</strong>
            </div>
            <div>
              <span className="job-detail-label">Destination</span>
              <strong>{destinationAddress}</strong>
            </div>
            <div>
              <span className="job-detail-label">Distance</span>
              <strong>{formatDistance(trip.transportRequest?.distanceMeters)}</strong>
            </div>
            <div>
              <span className="job-detail-label">Estimated duration</span>
              <strong>{formatDuration(trip.transportRequest?.estimatedDurationSeconds)}</strong>
            </div>
            <div>
              <span className="job-detail-label">Vehicle</span>
              <strong>{vehicleSummary}</strong>
            </div>
            <div>
              <span className="job-detail-label">Customer</span>
              <strong>{customerName}</strong>
            </div>
          </div>
        </div>
      </div>

      {actionError && <div className="error-box">{actionError}</div>}
    </section>
  );
}
