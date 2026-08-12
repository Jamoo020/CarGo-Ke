import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listPayments } from "../../lib/admin";

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

  if (loading) return <p>Loading payments...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h2>Payments</h2>
      <div>
        <input placeholder="Search payment or trip ID" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All status</option>
          <option value="PENDING">PENDING</option>
          <option value="CONFIRMED">CONFIRMED</option>
          <option value="FAILED">FAILED</option>
        </select>
      </div>
      {payments.length === 0 ? <p>No payments found.</p> : (
        <ul>
          {payments.map((payment) => (
            <li key={payment.id}>
              <Link to={`/admin/payments/${payment.id}`}>{payment.id}</Link> — {payment.status} — KSh {payment.amount} — Trip {payment.tripId}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
