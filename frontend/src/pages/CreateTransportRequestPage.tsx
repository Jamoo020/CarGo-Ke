import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTransportRequest } from "../lib/customer";

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

      navigate(`/customer/requests/${response.data.id}`, { replace: true });
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Unable to create request";
      setError(message);
    } finally {
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
          <input value={origin} onChange={(event) => setOrigin(event.target.value)} />
        </label>
        <label>
          <span>Destination</span>
          <input value={destination} onChange={(event) => setDestination(event.target.value)} />
        </label>
        <label>
          <span>Vehicle Detail ID</span>
          <input value={vehicleDetailId} onChange={(event) => setVehicleDetailId(event.target.value)} />
        </label>

        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Request"}
        </button>
      </form>
    </section>
  );
}
