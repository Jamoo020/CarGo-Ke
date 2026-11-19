import { Link } from "react-router-dom";

interface TripActionCardProps {
  title: string;
  description: string;
  badge?: string;
  actionLabel?: string;
  onAction?: () => void;
  disabled?: boolean;
  waiting?: boolean;
  linkTo?: string;
}

export default function TripActionCard({
  title,
  description,
  badge,
  actionLabel,
  onAction,
  disabled = false,
  waiting = false,
  linkTo,
}: TripActionCardProps) {
  const actionButton = actionLabel ? (
    linkTo ? (
      <Link to={linkTo} className="primary-button" style={{ textDecoration: "none" }}>
        {actionLabel}
      </Link>
    ) : (
      <button type="button" className="primary-button" onClick={onAction} disabled={disabled}>
        {actionLabel}
      </button>
    )
  ) : null;

  return (
    <div style={{ padding: 16, borderRadius: 16, border: "1px solid #dfe6ee", background: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 }}>
        <strong>{title}</strong>
        {badge ? <span className={`status-badge ${badge}`}>{badge}</span> : null}
      </div>

      <div style={{ color: "#4a5565", marginBottom: 14 }}>{description}</div>

      {waiting ? (
        <div style={{ padding: "10px 12px", borderRadius: 12, background: "#f8fafc", border: "1px solid #dfe6ee", color: "#39475d" }}>
          Waiting for customer activation.
        </div>
      ) : actionButton}
    </div>
  );
}
