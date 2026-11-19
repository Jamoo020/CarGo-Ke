import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listDrivers, listPayments, listTrips, listUsers } from "../lib/admin";
import { formatDateTime, formatDisplayName, formatDistance, formatLocation, formatReference, formatStatus } from "../lib/presentation";

const ACTIVE_TRIP_STATUSES = [
  "BOOKED",
  "PICKUP_PENDING",
  "PICKUP_INSPECTION",
  "TRIP_START_PENDING",
  "TRIP_ACTIVE",
  "IN_TRANSIT",
  "DELIVERY_PENDING",
  "DELIVERED",
  "COMPLETED",
];

const PAYMENT_ALERT_STATUSES = ["PENDING", "FAILED"];

function formatCurrency(value: number | string | null | undefined) {
  const numericValue = Number(value ?? 0);
  if (!Number.isFinite(numericValue)) return "KSh 0";

  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(numericValue);
}

function formatDate(value: string | undefined | null) {
  if (!value) return "—";

  try {
    return new Date(value).toLocaleDateString("en-KE", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

function getStatusClass(status: string | undefined | null) {
  return `status-badge status-${String(status ?? "pending").toLowerCase()}`;
}

export default function AdminDashboardPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        setLoading(true);
        setError(null);

        const [tripsResponse, driversResponse, paymentsResponse, usersResponse] = await Promise.all([
          listTrips(),
          listDrivers(),
          listPayments(),
          listUsers(),
        ]);

        if (!isMounted) return;

        setTrips(tripsResponse?.data ?? []);
        setDrivers(driversResponse?.data ?? []);
        setPayments(paymentsResponse?.data ?? []);
        setUsers(usersResponse?.data ?? []);
      } catch (caughtError: any) {
        if (!isMounted) return;
        setError(caughtError?.error ?? "Unable to load dashboard data.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const activeTrips = useMemo(
    () => trips.filter((trip) => ACTIVE_TRIP_STATUSES.includes(String(trip.status ?? ""))),
    [trips],
  );

  const pendingDrivers = useMemo(
    () => drivers.filter((driver) => String(driver.verificationStatus ?? "PENDING") === "PENDING"),
    [drivers],
  );

  const paymentAlerts = useMemo(
    () =>
      payments.filter((payment) => PAYMENT_ALERT_STATUSES.includes(String(payment.status ?? ""))).slice(0, 4),
    [payments],
  );

  const operationalAlerts = useMemo(() => {
    const alerts: Array<{ id: string; title: string; detail: string; kind: "warning" | "danger" | "info" }> = [];

    trips
      .filter((trip) => ["DISPUTED", "CANCELLED"].includes(String(trip.status ?? "")))
      .forEach((trip) => {
        alerts.push({
          id: `trip-${trip.id}`,
          title: `Trip ${formatStatus(trip.status)}`,
          detail: `${formatLocation(trip.transportRequest?.pickupAddress || trip.transportRequest?.origin, trip.transportRequest?.pickupLatitude, trip.transportRequest?.pickupLongitude)} → ${formatLocation(trip.transportRequest?.destinationAddress || trip.transportRequest?.destination, trip.transportRequest?.destinationLatitude, trip.transportRequest?.destinationLongitude)}`,
          kind: trip.status === "DISPUTED" ? "warning" : "danger",
        });
      });

    drivers
      .filter((driver) => String(driver.verificationStatus ?? "") === "SUSPENDED")
      .forEach((driver) => {
        alerts.push({
          id: `driver-${driver.id}`,
          title: "Driver suspended",
          detail: formatDisplayName(driver.user?.fullName, "Driver name not provided"),
          kind: "danger",
        });
      });

    payments
      .filter((payment) => String(payment.status ?? "") === "FAILED")
      .forEach((payment) => {
        alerts.push({
          id: `payment-${payment.id}`,
          title: "Payment failed",
          detail: `${formatReference("payment", payment.id)} • ${formatCurrency(payment.amount)}`,
          kind: "danger",
        });
      });

    return alerts.slice(0, 6);
  }, [drivers, payments, trips]);

  const platformUsers = users.length;

  return (
    <section className="screen-card admin-ops-shell">
      <div className="page-header-row admin-header-row">
        <div>
          <p className="eyebrow">Operations center</p>
          <h1>CARGo Kenya Operations</h1>
        </div>
        <div className="admin-header-actions">
          <Link to="/admin/trips" className="secondary-link-button">View trips</Link>
          <Link to="/admin/payments" className="secondary-link-button">View payments</Link>
        </div>
      </div>

      {error ? (
        <div className="error-box">{error}</div>
      ) : null}

      <div className="admin-overview-grid">
        <div className="admin-metric-card">
          <span className="admin-metric-label">Platform users</span>
          <strong>{loading ? "—" : platformUsers}</strong>
        </div>
        <div className="admin-metric-card">
          <span className="admin-metric-label">Active trips</span>
          <strong>{loading ? "—" : activeTrips.length}</strong>
        </div>
        <div className="admin-metric-card">
          <span className="admin-metric-label">Pending drivers</span>
          <strong>{loading ? "—" : pendingDrivers.length}</strong>
        </div>
        <div className="admin-metric-card accent">
          <span className="admin-metric-label">Payment activity</span>
          <strong>{loading ? "—" : payments.length}</strong>
        </div>
      </div>

      <div className="admin-operations-grid">
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <p className="eyebrow">Marketplace overview</p>
              <h2>Active transport activity</h2>
            </div>
          </div>

          {loading ? (
            <p className="status-text">Loading live operations…</p>
          ) : activeTrips.length === 0 ? (
            <div className="empty-state compact">
              <p>No active trips in the marketplace.</p>
            </div>
          ) : (
            <div className="admin-route-list">
              {activeTrips.slice(0, 5).map((trip) => (
                <article key={trip.id} className="admin-route-card">
                  <div className="admin-route-card-top">
                    <strong>{formatReference("trip", trip.id)}</strong>
                    <span className={getStatusClass(trip.status)}>{formatStatus(trip.status)}</span>
                  </div>
                  <div className="admin-route-line">
                    <span>{formatLocation(trip.transportRequest?.pickupAddress || trip.transportRequest?.origin, trip.transportRequest?.pickupLatitude, trip.transportRequest?.pickupLongitude)}</span>
                    <span className="route-arrow">↓</span>
                    <span>{formatLocation(trip.transportRequest?.destinationAddress || trip.transportRequest?.destination, trip.transportRequest?.destinationLatitude, trip.transportRequest?.destinationLongitude)}</span>
                  </div>
                  <div className="admin-route-meta-grid">
                    <div>
                      <span>Distance</span>
                      <strong>{formatDistance(trip.transportRequest?.distanceMeters)}</strong>
                    </div>
                    <div>
                      <span>Driver</span>
                      <strong>{formatDisplayName(trip.driver?.user?.fullName, "Driver name not provided")}</strong>
                    </div>
                    <div>
                      <span>Customer</span>
                      <strong>{formatDisplayName(trip.customer?.fullName, "Customer name not provided")}</strong>
                    </div>
                    <div>
                      <span>Travel date</span>
                      <strong>{formatDateTime(trip.transportRequest?.travelDateTime ?? trip.createdAt)}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <p className="eyebrow">Approvals</p>
              <h2>Pending drivers</h2>
            </div>
          </div>

          {loading ? (
            <p className="status-text">Loading driver approvals…</p>
          ) : pendingDrivers.length === 0 ? (
            <div className="empty-state compact">
              <p>No drivers awaiting approval.</p>
            </div>
          ) : (
            <div className="admin-list-stack">
              {pendingDrivers.slice(0, 4).map((driver) => (
                <div key={driver.id} className="admin-list-item">
                  <div>
                    <strong>{driver.user?.fullName ?? driver.user?.email ?? driver.id}</strong>
                    <small>{driver.user?.email ?? "Driver profile"}</small>
                  </div>
                  <span className={getStatusClass(driver.verificationStatus ?? "PENDING")}>{formatStatus(driver.verificationStatus ?? "PENDING")}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <p className="eyebrow">Payments</p>
              <h2>Payment activity</h2>
            </div>
          </div>

          {loading ? (
            <p className="status-text">Loading payments…</p>
          ) : payments.length === 0 ? (
            <div className="empty-state compact">
              <p>No payment activity found.</p>
            </div>
          ) : (
            <div className="admin-list-stack">
              {paymentAlerts.length === 0 ? (
                <div className="empty-state compact">
                  <p>No recent payment issues.</p>
                </div>
              ) : (
                paymentAlerts.map((payment) => (
                  <div key={payment.id} className="admin-list-item">
                    <div>
                      <strong>{formatReference("payment", payment.id)}</strong>
                      <small>{formatReference("trip", payment.tripId)}</small>
                    </div>
                    <div className="admin-payment-meta">
                      <span className={getStatusClass(payment.status)}>{formatStatus(payment.status)}</span>
                      <strong>{formatCurrency(payment.amount)}</strong>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <p className="eyebrow">Operations watch</p>
              <h2>Operational alerts</h2>
            </div>
          </div>

          {loading ? (
            <p className="status-text">Checking alerts…</p>
          ) : operationalAlerts.length === 0 ? (
            <div className="empty-state compact">
              <p>No active operational alerts.</p>
            </div>
          ) : (
            <div className="admin-alert-list">
              {operationalAlerts.map((alert) => (
                <div key={alert.id} className={`admin-alert-item ${alert.kind}`}>
                  <div className="admin-alert-dot" />
                  <div>
                    <strong>{alert.title}</strong>
                    <small>{alert.detail}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="admin-action-shell">
        <div className="admin-panel-header compact-header">
          <div>
            <p className="eyebrow">Quick actions</p>
            <h2>Operations shortcuts</h2>
          </div>
        </div>

        <div className="admin-action-grid">
          <Link to="/admin/users" className="admin-action-link">Manage users</Link>
          <Link to="/admin/drivers" className="admin-action-link">Manage drivers</Link>
          <Link to="/admin/trips" className="admin-action-link">View trips</Link>
          <Link to="/admin/payments" className="admin-action-link">View payments</Link>
          <Link to="/admin/disputes" className="admin-action-link">Review disputes</Link>
          <Link to="/admin/config" className="admin-action-link">Platform settings</Link>
        </div>
      </div>
    </section>
  );
}
