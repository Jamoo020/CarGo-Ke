import InspectionEvidenceGallery from "./InspectionEvidenceGallery";
import { formatStatus } from "../../lib/presentation";

interface TripInspectionCardProps {
  title: string;
  inspection?: {
    id?: string;
    type?: string;
    odometer?: number | string | null;
    fuelLevel?: number | string | null;
    vehicleCondition?: string | null;
    damageNotes?: string | null;
    observations?: string | null;
    handoverConfirmed?: boolean | null;
    photoUrls?: string[] | null;
    createdAt?: string | null;
  } | null;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
}

export default function TripInspectionCard({
  title,
  inspection,
  loading = false,
  error,
  emptyMessage = "Inspection details are not available yet.",
}: TripInspectionCardProps) {
  if (loading) {
    return (
      <div style={{ padding: 16, borderRadius: 16, background: "#f8fafc", border: "1px solid #dfe6ee" }}>
        Loading inspection details…
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-box" style={{ marginTop: 8 }}>
        {error}
      </div>
    );
  }

  if (!inspection) {
    return (
      <div style={{ padding: 16, borderRadius: 16, background: "#f8fafc", border: "1px solid #dfe6ee" }}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div style={{ borderRadius: 16, border: "1px solid #dfe6ee", background: "#fff", overflow: "hidden" }}>
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #eef2f7", background: "#f8fafc" }}>
        <strong>{title}</strong>
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
          <div>
            <div className="job-detail-label">Inspection type</div>
            <div style={{ fontWeight: 700 }}>{formatStatus(inspection.type)}</div>
          </div>
          <div>
            <div className="job-detail-label">Odometer</div>
            <div style={{ fontWeight: 700 }}>{inspection.odometer ?? "Not provided"}</div>
          </div>
          <div>
            <div className="job-detail-label">Fuel level</div>
            <div style={{ fontWeight: 700 }}>{inspection.fuelLevel ?? "Not provided"}</div>
          </div>
          <div>
            <div className="job-detail-label">Handover confirmed</div>
            <div style={{ fontWeight: 700 }}>{inspection.handoverConfirmed ? "Yes" : "No"}</div>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <div className="job-detail-label">Vehicle condition</div>
          <div>{inspection.vehicleCondition ?? "Not provided"}</div>
        </div>

        {inspection.damageNotes ? (
          <div style={{ marginTop: 16 }}>
            <div className="job-detail-label">Damage notes</div>
            <div>{inspection.damageNotes}</div>
          </div>
        ) : null}

        {inspection.observations ? (
          <div style={{ marginTop: 16 }}>
            <div className="job-detail-label">Observations</div>
            <div>{inspection.observations}</div>
          </div>
        ) : null}

        <div style={{ marginTop: 16 }}>
          <div className="job-detail-label">Evidence</div>
          <InspectionEvidenceGallery photoUrls={inspection.photoUrls ?? []} title={title} />
        </div>
      </div>
    </div>
  );
}
