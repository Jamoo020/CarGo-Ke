import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listDrivers } from "../../lib/admin";

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

  if (loading) return <p>Loading drivers...</p>;
  if (error) return <p className="error">{error}</p>;
  if (drivers.length === 0) return <p>No drivers found.</p>;

  return (
    <div>
      <h2>Drivers</h2>
      <div>
        <label>Filter by verification status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="PENDING">PENDING</option>
          <option value="APPROVED">APPROVED</option>
          <option value="REJECTED">REJECTED</option>
          <option value="SUSPENDED">SUSPENDED</option>
        </select>
      </div>
      <ul>
        {drivers.map((d) => (
          <li key={d.id}>
            <Link to={`/admin/drivers/${d.id}`}>{d.user?.fullName ?? d.user?.email ?? d.id}</Link> — {d.verificationStatus} — verified: {String(d.verified)}
          </li>
        ))}
      </ul>
    </div>
  );
}
