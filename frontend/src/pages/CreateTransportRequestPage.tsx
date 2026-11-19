import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTransportRequest } from "../lib/customer";
import { ApiError } from "../types/auth";
import LocationPicker, { Location } from "../components/map/LocationPicker";
import Map from "../components/map/Map";
import { getRouteLocationIssue } from "../lib/routeLocation";
import { MAP_PROVIDER } from "../lib/mapProvider";

const steps = [
  { key: "route", label: "Route" },
  { key: "vehicle", label: "Vehicle" },
  { key: "schedule", label: "Schedule" },
  { key: "review", label: "Review" },
] as const;

const vehicleChoices = [
  { key: "Sedan", icon: "🚗", description: "Daily cargo and passenger transport" },
  { key: "SUV", icon: "🚙", description: "More space for family or mixed loads" },
  { key: "Van", icon: "🚐", description: "Group movement and higher-capacity cargo" },
  { key: "Truck", icon: "🚚", description: "Heavy-duty transport and larger loads" },
] as const;

export default function CreateTransportRequestPage() {
  const navigate = useNavigate();
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<Location | null>(null);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [color, setColor] = useState("");
  const [engineCC, setEngineCC] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [travelDateTime, setTravelDateTime] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [routeResult, setRouteResult] = useState<{ distanceMeters: number; durationSeconds: number; polyline: Array<{ lat: number; lng: number }>; encodedPolyline: string } | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);
  const route = useMemo(() => pickupLocation && destinationLocation && !pickupLocation.isApproximate && !destinationLocation.isApproximate
    && !getRouteLocationIssue(pickupLocation, destinationLocation)
    ? {
      origin: { lat: pickupLocation.latitude, lng: pickupLocation.longitude },
      destination: { lat: destinationLocation.latitude, lng: destinationLocation.longitude },
    }
    : null, [pickupLocation, destinationLocation]);

  useEffect(() => {
    setRouteResult(null);
    setRouteError(null);
  }, [route?.origin.lat, route?.origin.lng, route?.destination.lat, route?.destination.lng]);

  const mapMarkers = useMemo(() => {
    const markers: Array<{ lat: number; lng: number; title: string; label: string }> = [];

    if (pickupLocation) {
      markers.push({ lat: pickupLocation.latitude, lng: pickupLocation.longitude, title: "Pickup", label: "A" });
    }

    if (destinationLocation) {
      markers.push({ lat: destinationLocation.latitude, lng: destinationLocation.longitude, title: "Destination", label: "B" });
    }

    return markers;
  }, [pickupLocation, destinationLocation]);

  function isStepComplete(stepIndex: number) {
    if (stepIndex === 0) {
      return Boolean(pickupLocation && destinationLocation);
    }

    if (stepIndex === 1) {
      return Boolean(make.trim() && model.trim() && registrationNumber.trim() && year.trim());
    }

    if (stepIndex === 2) {
      return true;
    }

    return true;
  }

  function goNext() {
    setError(null);

    if (currentStep === 0 && (!pickupLocation || !destinationLocation)) {
      setError("Pickup and destination are required before continuing.");
      return;
    }
    if (currentStep === 0 && pickupLocation && destinationLocation) {
      const locationIssue = getRouteLocationIssue(pickupLocation, destinationLocation);
      if (locationIssue) {
        setError(locationIssue);
        return;
      }
    }

    if (currentStep === 1 && (!make.trim() || !model.trim() || !registrationNumber.trim() || !year.trim())) {
      setError("Vehicle make, model, registration number, and year are required.");
      return;
    }

    setCurrentStep((previous) => Math.min(previous + 1, steps.length - 1));
  }

  function goBack() {
    setError(null);
    setCurrentStep((previous) => Math.max(previous - 1, 0));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!pickupLocation) {
      setError("Pickup location is required");
      return;
    }

    if (!destinationLocation) {
      setError("Destination location is required");
      return;
    }
    if (pickupLocation.isApproximate || destinationLocation.isApproximate) {
      setError("Approximate locations are not precise enough for a transport request. Select a confirmed location.");
      return;
    }
    const locationIssue = getRouteLocationIssue(pickupLocation, destinationLocation);
    if (locationIssue) {
      setError(locationIssue);
      return;
    }

    if (!make.trim()) {
      setError("Vehicle make is required");
      return;
    }

    if (!model.trim()) {
      setError("Vehicle model is required");
      return;
    }

    if (!registrationNumber.trim()) {
      setError("Vehicle registration number is required");
      return;
    }

    if (!year.trim() || Number.isNaN(Number(year))) {
      setError("Vehicle year is required");
      return;
    }
    const ny = Number(year);
    const thisYear = new Date().getFullYear();
    if (ny > thisYear) {
      setError("Vehicle year cannot be in the future");
      return;
    }

    if (engineCC.trim()) {
      const cc = Number(engineCC);
      if (Number.isNaN(cc) || cc <= 0) {
        setError("Engine capacity (CC) must be a positive number");
        return;
      }
    }

    if (capacity.trim()) {
      const cap = Number(capacity);
      if (!Number.isInteger(cap) || cap <= 0) {
        setError("Capacity must be a positive integer");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const realRouteData = MAP_PROVIDER === "google" && routeResult
        ? {
          distanceMeters: routeResult.distanceMeters,
          estimatedDurationSeconds: routeResult.durationSeconds,
          routePolyline: routeResult.encodedPolyline,
        }
        : {};
      const response = await createTransportRequest({
        origin: pickupLocation.address,
        destination: destinationLocation.address,
        pickupAddress: pickupLocation.address,
        pickupLatitude: pickupLocation.latitude,
        pickupLongitude: pickupLocation.longitude,
        destinationAddress: destinationLocation.address,
        destinationLatitude: destinationLocation.latitude,
        destinationLongitude: destinationLocation.longitude,
        ...realRouteData,
        make: make.trim(),
        model: model.trim(),
        year: Number(year),
        registrationNumber: registrationNumber.trim(),
        color: color.trim() || undefined,
        engineCC: engineCC.trim() ? Number(engineCC) : undefined,
        vehicleType: vehicleType.trim() || undefined,
        capacity: capacity.trim() ? Number(capacity) : undefined,
        travelDateTime: travelDateTime.trim() ? new Date(travelDateTime).toISOString() : undefined,
        notes: notes.trim() || undefined,
      });

      if (!response.data?.id) {
        setError("Request created but no ID returned");
        setIsSubmitting(false);
        return;
      }

      navigate(`/customer/requests/${response.data.id}`, { replace: true });
    } catch (caughtError) {
      const apiError = caughtError as ApiError;
      let message = apiError.error ?? "Unable to create request";

      if (apiError.status === "400") {
        message = "Invalid request data. Please check your entries.";
      } else if (apiError.status === "401") {
        message = "Session expired. Please log in again.";
      } else if (apiError.status === "403") {
        message = "You do not have permission to create this request.";
      } else if (apiError.status === "404") {
        message = "Vehicle or resource not found.";
      }

      setError(message);
      setIsSubmitting(false);
    }
  }

  const renderStep = () => {
    if (currentStep === 0) {
      return (
        <div className="cgk-step-body">
          <div className="cgk-step-heading">
            <span className="cgk-step-kicker">Route</span>
            <h2>Where are you moving something?</h2>
          </div>

          <div className="cgk-route-grid">
            <LocationPicker
              label="Pickup"
              placeholder="Search pickup location..."
              onSelect={setPickupLocation}
              initialValue={pickupLocation || undefined}
              disabled={isSubmitting}
            />

            <LocationPicker
              label="Destination"
              placeholder="Search destination location..."
              onSelect={setDestinationLocation}
              initialValue={destinationLocation || undefined}
              disabled={isSubmitting}
            />
          </div>

          <div className="cgk-map-shell">
            <div className="cgk-map-header">
              <div>
                <span className="cgk-step-kicker">Map preview</span>
                {pickupLocation && destinationLocation ? (
                  <h3>{pickupLocation.address} → {destinationLocation.address}</h3>
                ) : (
                  <h3>Choose a pickup and destination</h3>
                )}
              </div>
            </div>

            <Map
              center={{ lat: -1.2921, lng: 36.8219 }}
              zoom={11}
              markers={mapMarkers}
              route={route}
              onRouteResult={(result, routeErrorMessage) => {
                setRouteResult(MAP_PROVIDER === "google" ? result : null);
                setRouteError(
                  MAP_PROVIDER === "development" ? null : routeErrorMessage ?? null,
                );
              }}
              style={{ width: "100%", height: "310px", borderRadius: "16px" }}
            />

            {pickupLocation && destinationLocation ? (
              <div className="cgk-route-note">
                <span>
                  {MAP_PROVIDER === "development"
                    ? "Free development mode: no driving route or road metrics are calculated"
                    : routeResult
                      ? "Driving route calculated"
                      : pickupLocation.isApproximate || destinationLocation.isApproximate
                        ? "Approximate locations cannot be used for booking"
                        : getRouteLocationIssue(pickupLocation, destinationLocation)
                          || routeError
                          || "Driving route not calculated"}
                </span>
                <strong>{pickupLocation.address}</strong>
                <span className="cgk-route-arrow">↓</span>
                <strong>{destinationLocation.address}</strong>
                {MAP_PROVIDER === "google" && routeResult ? (
                  <span>{(routeResult.distanceMeters / 1000).toFixed(1)} km · {Math.round(routeResult.durationSeconds / 60)} min</span>
                ) : null}
              </div>
            ) : (
              <div className="cgk-route-note cgk-route-note--muted">
                <span>Map preview will update as soon as both locations are selected.</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (currentStep === 1) {
      return (
        <div className="cgk-step-body">
          <div className="cgk-step-heading">
            <span className="cgk-step-kicker">Vehicle</span>
            <h2>Tell us about the vehicle</h2>
          </div>

          <div className="cgk-vehicle-grid" role="list" aria-label="Vehicle choices">
            {vehicleChoices.map((choice) => {
              const selected = vehicleType === choice.key;

              return (
                <button
                  key={choice.key}
                  type="button"
                  className={`cgk-vehicle-card ${selected ? "selected" : ""}`}
                  onClick={() => setVehicleType(choice.key)}
                  aria-pressed={selected}
                >
                  <span className="cgk-vehicle-icon">{choice.icon}</span>
                  <span className="cgk-vehicle-name">{choice.key}</span>
                  <small>{choice.description}</small>
                </button>
              );
            })}
          </div>

          <div className="cgk-form-grid">
            <label>
              <span>Vehicle make</span>
              <input
                type="text"
                value={make}
                onChange={(event) => setMake(event.target.value)}
                placeholder="e.g., Toyota"
                disabled={isSubmitting}
              />
            </label>
            <label>
              <span>Vehicle model</span>
              <input
                type="text"
                value={model}
                onChange={(event) => setModel(event.target.value)}
                placeholder="e.g., Hilux"
                disabled={isSubmitting}
              />
            </label>
            <label>
              <span>Vehicle year</span>
              <input
                type="number"
                min="1990"
                step="1"
                value={year}
                onChange={(event) => setYear(event.target.value)}
                placeholder="e.g., 2022"
                disabled={isSubmitting}
              />
            </label>
            <label>
              <span>Registration number</span>
              <input
                type="text"
                value={registrationNumber}
                onChange={(event) => setRegistrationNumber(event.target.value)}
                placeholder="e.g., KAB 123A"
                disabled={isSubmitting}
              />
            </label>
            <label>
              <span>Color (optional)</span>
              <input
                type="text"
                value={color}
                onChange={(event) => setColor(event.target.value)}
                placeholder="e.g., White"
                disabled={isSubmitting}
              />
            </label>
            <label>
              <span>Vehicle type (optional)</span>
              <input
                type="text"
                value={vehicleType}
                onChange={(event) => setVehicleType(event.target.value)}
                placeholder="e.g., Passenger Van"
                disabled={isSubmitting}
              />
            </label>
            <label>
              <span>Engine capacity (CC) (optional)</span>
              <input
                type="number"
                min="1"
                step="1"
                value={engineCC}
                onChange={(event) => setEngineCC(event.target.value)}
                placeholder="e.g., 2800"
                disabled={isSubmitting}
              />
            </label>
            <label>
              <span>Capacity (optional)</span>
              <input
                type="number"
                min="1"
                step="1"
                value={capacity}
                onChange={(event) => setCapacity(event.target.value)}
                placeholder="e.g., 14"
                disabled={isSubmitting}
              />
            </label>
          </div>
        </div>
      );
    }

    if (currentStep === 2) {
      return (
        <div className="cgk-step-body">
          <div className="cgk-step-heading">
            <span className="cgk-step-kicker">Schedule</span>
            <h2>When do you need this trip?</h2>
          </div>

          <div className="cgk-form-grid cgk-form-grid--single">
            <label>
              <span>Travel date and time</span>
              <input
                type="datetime-local"
                value={travelDateTime}
                onChange={(event) => setTravelDateTime(event.target.value)}
                disabled={isSubmitting}
              />
            </label>
            <label>
              <span>Notes</span>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Any details drivers should know (no personal contacts)"
                disabled={isSubmitting}
                rows={5}
              />
            </label>
          </div>
        </div>
      );
    }

    return (
      <div className="cgk-step-body">
        <div className="cgk-step-heading">
          <span className="cgk-step-kicker">Review</span>
          <h2>Confirm your transport request</h2>
        </div>

        <div className="cgk-summary-box">
          <div className="cgk-summary-section">
            <h3>Route</h3>
            <div className="cgk-review-route">
              <span>{pickupLocation?.address || "Pickup not selected"}</span>
              <span className="cgk-route-arrow">↓</span>
              <span>{destinationLocation?.address || "Destination not selected"}</span>
            </div>
          </div>

          <div className="cgk-summary-section">
            <h3>Vehicle</h3>
            <div className="cgk-review-list">
              <span>{make || "Make not provided"} {model || "Model not provided"}</span>
              <span>{year ? `Year ${year}` : "Year not provided"}</span>
              <span>{registrationNumber || "Registration not provided"}</span>
              {vehicleType ? <span>{vehicleType}</span> : null}
            </div>
          </div>

          <div className="cgk-summary-section">
            <h3>Schedule</h3>
            <div className="cgk-review-list">
              <span>{travelDateTime ? new Date(travelDateTime).toLocaleString() : "No travel date selected"}</span>
              {notes ? <span>{notes}</span> : <span>No notes</span>}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        .cgk-booking-shell {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .cgk-booking-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .cgk-booking-header h1 {
          margin: 0;
          font-size: clamp(2rem, 3.3vw, 2.8rem);
          letter-spacing: -0.05em;
          line-height: 1.08;
        }

        .cgk-progress {
          display: flex;
          gap: 0.65rem;
          flex-wrap: wrap;
          margin-top: 0.5rem;
        }

        .cgk-step-pill {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 0.8rem;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.22);
          background: #f8fafc;
          color: #475569;
          font-size: 0.78rem;
          font-weight: 700;
          min-width: 94px;
          justify-content: center;
        }

        .cgk-step-pill.active {
          background: rgba(17, 24, 39, 0.96);
          border-color: rgba(17, 24, 39, 0.96);
          color: #fff;
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.14);
        }

        .cgk-step-pill.complete {
          background: rgba(34, 197, 94, 0.12);
          border-color: rgba(34, 197, 94, 0.18);
          color: #166534;
        }

        .cgk-step-label {
          display: inline-block;
        }

        .cgk-booking-card {
          background: rgba(255, 255, 255, 0.82);
          border: 1px solid rgba(148, 163, 184, 0.18);
          border-radius: 24px;
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.06);
          padding: 1.3rem;
        }

        .cgk-step-body {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .cgk-step-heading {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .cgk-step-kicker {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-weight: 800;
          color: #664300;
        }

        .cgk-step-heading h2 {
          margin: 0;
          font-size: clamp(1.5rem, 2.4vw, 2.1rem);
          letter-spacing: -0.04em;
          color: #0f172a;
        }

        .cgk-route-grid,
        .cgk-form-grid {
          display: grid;
          gap: 1rem;
        }

        .cgk-route-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .cgk-form-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .cgk-form-grid--single {
          grid-template-columns: 1fr;
        }

        .cgk-form-grid label,
        .cgk-route-grid label {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          color: #334155;
          font-weight: 600;
        }

        .cgk-form-grid input,
        .cgk-form-grid textarea,
        .cgk-route-grid input {
          width: 100%;
          border: 1px solid rgba(148, 163, 184, 0.5);
          border-radius: 14px;
          background: #fff;
          min-height: 48px;
          padding: 0.85rem 0.95rem;
          color: #0f172a;
          font: inherit;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .cgk-form-grid textarea {
          min-height: 110px;
          resize: vertical;
        }

        .cgk-form-grid input:focus,
        .cgk-form-grid textarea:focus,
        .cgk-route-grid input:focus {
          outline: none;
          border-color: #e5a92f;
          box-shadow: 0 0 0 3px rgba(255, 194, 71, 0.3);
        }

        .cgk-map-shell {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          padding: 1rem;
          border-radius: 18px;
          border: 1px solid rgba(148, 163, 184, 0.2);
          background: rgba(248, 250, 252, 0.7);
        }

        .cgk-map-header {
          display: flex;
          justify-content: space-between;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .cgk-map-header h3 {
          margin: 0.15rem 0 0;
          font-size: 1rem;
          color: #0f172a;
        }

        .cgk-route-note {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          flex-wrap: wrap;
          border-radius: 14px;
          background: rgba(16, 27, 45, 0.96);
          color: #fff;
          padding: 0.85rem 0.95rem;
          font-size: 0.9rem;
        }

        .cgk-route-note--muted {
          background: rgba(15, 23, 42, 0.04);
          color: #475569;
          border: 1px solid rgba(148, 163, 184, 0.18);
        }

        .cgk-route-arrow {
          color: #94a3b8;
          font-weight: 800;
        }

        .cgk-vehicle-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0.9rem;
        }

        .cgk-vehicle-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.45rem;
          min-height: 120px;
          padding: 1rem 0.9rem;
          border-radius: 18px;
          border: 1px solid rgba(148, 163, 184, 0.25);
          background: #f8fafc;
          color: #0f172a;
          text-align: left;
          cursor: pointer;
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .cgk-vehicle-card:hover,
        .cgk-vehicle-card:focus-visible {
          transform: translateY(-1px);
          border-color: rgba(255, 194, 71, 0.72);
          box-shadow: 0 14px 28px rgba(15, 23, 42, 0.06);
        }

        .cgk-vehicle-card.selected {
          background: rgba(255, 194, 71, 0.14);
          border-color: rgba(255, 194, 71, 0.88);
          box-shadow: inset 0 0 0 1px rgba(255, 194, 71, 0.28);
        }

        .cgk-vehicle-icon {
          font-size: 1.8rem;
          line-height: 1;
        }

        .cgk-vehicle-name {
          font-size: 1.1rem;
          font-weight: 800;
        }

        .cgk-vehicle-card small {
          color: #475569;
          line-height: 1.4;
        }

        .cgk-summary-box {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1rem;
          border: 1px solid rgba(148, 163, 184, 0.2);
          background: rgba(248, 250, 252, 0.7);
          border-radius: 18px;
        }

        .cgk-summary-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding-bottom: 0.85rem;
          border-bottom: 1px solid rgba(148, 163, 184, 0.18);
        }

        .cgk-summary-section:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .cgk-summary-section h3 {
          margin: 0;
          font-size: 0.8rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #475569;
        }

        .cgk-review-route,
        .cgk-review-list {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          color: #0f172a;
          font-weight: 600;
        }

        .cgk-action-row {
          display: flex;
          justify-content: space-between;
          gap: 0.8rem;
          flex-wrap: wrap;
          padding-top: 0.4rem;
        }

        .cgk-action-row button,
        .cgk-action-row a {
          appearance: none;
          border: none;
          border-radius: 14px;
          min-height: 48px;
          padding: 0.8rem 1.1rem;
          font: inherit;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
        }

        .cgk-secondary-button {
          background: #f8fafc;
          color: #0f172a;
          border: 1px solid rgba(148, 163, 184, 0.2);
        }

        .cgk-primary-button {
          background: linear-gradient(135deg, #ffc247 0%, #e5a92f 100%);
          color: #101b2d;
          box-shadow: 0 16px 32px rgba(229, 169, 47, 0.22);
        }

        .cgk-action-row button:disabled {
          opacity: 0.7;
          cursor: wait;
        }

        .cgk-action-row button:hover:not(:disabled),
        .cgk-action-row a:hover {
          transform: translateY(-1px);
        }

        .cgk-error {
          border: 1px solid rgba(220, 38, 38, 0.15);
          background: rgba(254, 226, 226, 0.8);
          color: #991b1b;
          border-radius: 12px;
          padding: 0.8rem 0.9rem;
          font-weight: 600;
        }

        @media (max-width: 820px) {
          .cgk-route-grid,
          .cgk-form-grid,
          .cgk-vehicle-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .screen-card {
            padding: 1rem;
            border-radius: 18px;
          }

          .cgk-booking-card {
            padding: 1rem;
          }

          .cgk-booking-header {
            flex-direction: column;
          }

          .cgk-progress {
            width: 100%;
          }

          .cgk-step-pill {
            flex: 1 1 calc(50% - 0.5rem);
            min-width: 0;
          }

          .cgk-action-row {
            flex-direction: column-reverse;
          }

          .cgk-action-row button,
          .cgk-action-row a {
            width: 100%;
          }
        }
      `}</style>

      <section className="screen-card cgk-booking-shell">
        <div className="cgk-booking-header">
          <div>
            <p className="eyebrow">Create trip</p>
            <h1>New Transport Request</h1>
          </div>
        </div>

        <div className="cgk-progress" aria-label="Booking progress">
          {steps.map((step, index) => (
            <div
              key={step.key}
              className={`cgk-step-pill ${currentStep === index ? "active" : ""} ${index < currentStep ? "complete" : ""}`}
              aria-current={currentStep === index ? "step" : undefined}
            >
              <span>{index + 1}</span>
              <span className="cgk-step-label">{step.label}</span>
            </div>
          ))}
        </div>

        {error ? <div className="cgk-error">{error}</div> : null}

        <form onSubmit={handleSubmit} className="cgk-booking-card">
          {renderStep()}

          <div className="cgk-action-row">
            <button
              type="button"
              className="cgk-secondary-button"
              onClick={goBack}
              disabled={currentStep === 0 || isSubmitting}
            >
              Back
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                className="cgk-primary-button"
                onClick={goNext}
                disabled={isSubmitting}
              >
                Continue
              </button>
            ) : (
              <button type="submit" className="cgk-primary-button" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Transport Request"}
              </button>
            )}
          </div>
        </form>
      </section>
    </>
  );
}
