import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listPayments } from "../../lib/admin";
import { formatReference, formatStatus } from "../../lib/presentation";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await listPayments({ status: status || undefined, search: search || undefined });
        if (!mounted) return;
        setPayments(res.data ?? []);
        setError(null);
      } catch (e: any) {
        setError(e?.error ?? "Failed to load payments");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [status, search]);

  return (
    <section className="screen-card">
      <div className="page-header-row compact">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Payments</h1>
        </div>
      </div>

      <div className="form-grid" style={{marginBottom: "1.5rem"}}>
        <label>
          <span>Search payment or trip</span>
          <input placeholder="ID or reference..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
        <label>
          <span>Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            <option value="PENDING">{formatStatus("PENDING")}</option>
            <option value="CONFIRMED">{formatStatus("CONFIRMED")}</option>
            <option value="FAILED">{formatStatus("FAILED")}</option>
          </select>
        </label>
      </div>

      {error ? (
        <div className="error-box">{error}</div>
      ) : loading ? (
        <p className="status-text">Loading payments…</p>
      ) : payments.length === 0 ? (
        <div className="empty-state"><p>No payments found.</p></div>
      ) : (
        <ul className="request-list">
          {payments.map((payment) => (
            <li key={payment.id} className="request-item">
              <Link to={`/admin/payments/${payment.id}`} className="request-item-link">
                <div className="request-item-main">
                  <strong>{formatReference("payment", payment.id)}</strong>
                  <div className="request-item-details">
                    <span>KSh {payment.amount}</span>
                    <span>•</span>
                    <span>{formatReference("trip", payment.tripId)}</span>
                  </div>
                </div>
                <div className="request-item-status">
                  <span className={`status-badge status-${payment.status?.toLowerCase() || "pending"}`}>{formatStatus(payment.status)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
