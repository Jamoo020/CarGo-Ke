import { formatStatus } from "../../lib/presentation";

interface TripStatusTimelineProps {
  currentStatus?: string | null;
}

const STATUS_SEQUENCE = [
  "REQUESTED",
  "QUOTING",
  "DRIVER_SELECTED",
  "PAYMENT_PENDING",
  "BOOKED",
  "PICKUP_PENDING",
  "PICKUP_INSPECTION",
  "TRIP_START_PENDING",
  "TRIP_ACTIVE",
  "IN_TRANSIT",
  "DELIVERY_PENDING",
  "DELIVERED",
  "COMPLETED",
  "CANCELLED",
  "DISPUTED",
];

export default function TripStatusTimeline({ currentStatus }: TripStatusTimelineProps) {
  const activeIndex = currentStatus ? STATUS_SEQUENCE.indexOf(currentStatus) : -1;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
      {STATUS_SEQUENCE.map((status, index) => {
        const isActive = index === activeIndex;
        const isPassed = activeIndex >= 0 && index < activeIndex;

        return (
          <span
            key={status}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "6px 10px",
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.04em",
              background: isActive ? "#e9e7ff" : isPassed ? "#e7f7eb" : "#eef2f7",
              color: isActive ? "#2d2d8d" : isPassed ? "#1d6f4e" : "#4a5565",
              border: isActive ? "1px solid #c9c8ff" : isPassed ? "1px solid #bfe7ca" : "1px solid #dfe6ee",
            }}
          >
            {formatStatus(status)}
          </span>
        );
      })}
    </div>
  );
}
