import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listDrivers } from "../../lib/admin";
import { formatDisplayName, formatStatus } from "../../lib/presentation";

export default function DriversPage() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await listDrivers({ status: status || undefined });
        if (!mounted) return;
        setDrivers(res.data ?? []);
        setError(null);
      } catch (e: any) {
        setError(e?.error ?? "Failed to load drivers");
      } finally { if (mounted) setLoading(false); }
    }
    load();
    return () => { mounted = false; };
  }, [status]);

  return (
    <section className="screen-card">
      <div className="page-header-row compact">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Drivers</h1>
        </div>
      </div>

      <div className="form-grid" style={{marginBottom: "1.5rem", gridTemplateColumns: "1fr auto"}}>
        <label>
          <span>Verification status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="PENDING">{formatStatus("PENDING")}</option>
            <option value="APPROVED">{formatStatus("APPROVED")}</option>
            <option value="REJECTED">{formatStatus("REJECTED")}</option>
            <option value="SUSPENDED">{formatStatus("SUSPENDED")}</option>
          </select>
        </label>
      </div>

      {error ? (
        <div className="error-box">{error}</div>
      ) : loading ? (
        <p className="status-text">Loading drivers…</p>
      ) : drivers.length === 0 ? (
        <div className="empty-state"><p>No drivers found.</p></div>
      ) : (
        <ul className="request-list">
          {drivers.map((d) => (
            <li key={d.id} className="request-item">
              <Link to={`/admin/drivers/${d.id}`} className="request-item-link">
                <div className="request-item-main">
                  <strong>{formatDisplayName(d.user?.fullName, "Driver name not provided")}</strong>
                  <div className="request-item-details">
                    <span>{d.verified ? "✓ Verified" : "○ Not verified"}</span>
                  </div>
                </div>
                <div className="request-item-status">
                  <span className={`status-badge status-${d.verificationStatus?.toLowerCase() || "pending"}`}>{formatStatus(d.verificationStatus)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
