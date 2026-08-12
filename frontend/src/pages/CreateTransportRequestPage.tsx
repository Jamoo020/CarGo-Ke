import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTransportRequest } from "../lib/customer";
import { ApiError } from "../types/auth";

export default function CreateTransportRequestPage() {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicleDetailId, setVehicleDetailId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!origin.trim()) {
      setError("Origin is required");
      return;
    }

    if (!destination.trim()) {
      setError("Destination is required");
      return;
    }

    if (!vehicleDetailId.trim()) {
      setError("Vehicle Detail ID is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createTransportRequest({
        origin: origin.trim(),
        destination: destination.trim(),
        vehicleDetailId: vehicleDetailId.trim(),
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

  return (
    <section className="screen-card form-card">
      <div className="page-header-row compact">
        <div>
          <p className="eyebrow">Create trip</p>
          <h1>New Transport Request</h1>
        </div>
      </div>

      {error ? <div className="error-box">{error}</div> : null}

      <form onSubmit={handleSubmit} className="stack-form">
        <label>
          <span>Origin</span>
          <input
            type="text"
            value={origin}
            onChange={(event) => setOrigin(event.target.value)}
            placeholder="e.g., Nairobi CBD"
            disabled={isSubmitting}
          />
        </label>
        <label>
          <span>Destination</span>
          <input
            type="text"
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            placeholder="e.g., Mombasa Port"
            disabled={isSubmitting}
          />
        </label>
        <label>
          <span>Vehicle Detail ID</span>
          <input
            type="text"
            value={vehicleDetailId}
            onChange={(event) => setVehicleDetailId(event.target.value)}
            placeholder="e.g., veh-123"
            disabled={isSubmitting}
          />
        </label>

        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? "Creating Request..." : "Create Request"}
        </button>
      </form>
    </section>
  );
}
