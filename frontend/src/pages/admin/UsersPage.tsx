import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listUsers } from "../../lib/admin";
import { UserRole, AccountStatus } from "../../types/auth";
import { formatStatus } from "../../lib/presentation";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string | "">("");
  const [status, setStatus] = useState<string | "">("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await listUsers({ search: search || undefined, role: role || undefined, accountStatus: status || undefined });
        if (!mounted) return;
        setUsers(res.data ?? []);
        setError(null);
      } catch (e: any) {
        setError(e?.error ?? "Failed to load users");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [search, role, status]);

  return (
    <section className="screen-card">
      <div className="page-header-row compact">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Users</h1>
        </div>
      </div>

      <div className="form-grid" style={{marginBottom: "1.5rem"}}>
        <label>
          <span>Search users</span>
          <input placeholder="Email or name..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
        <label>
          <span>Role</span>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">All roles</option>
            <option value="CUSTOMER">Customer</option>
            <option value="DRIVER">Driver</option>
            <option value="AUTHORIZED_REPRESENTATIVE">Authorized Rep</option>
            <option value="ADMIN">Admin</option>
          </select>
        </label>
        <label>
          <span>Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            <option value="ACTIVE">{formatStatus("ACTIVE")}</option>
            <option value="SUSPENDED">{formatStatus("SUSPENDED")}</option>
            <option value="DEACTIVATED">{formatStatus("DEACTIVATED")}</option>
          </select>
        </label>
      </div>

      {error ? (
        <div className="error-box">{error}</div>
      ) : loading ? (
        <p className="status-text">Loading users…</p>
      ) : users.length === 0 ? (
        <div className="empty-state"><p>No users found.</p></div>
      ) : (
        <ul className="request-list">
          {users.map((u) => (
            <li key={u.id} className="request-item">
              <Link to={`/admin/users/${u.id}`} className="request-item-link">
                <div className="request-item-main">
                  <strong>{u.email}</strong>
                  <div className="request-item-details">
                    <span>{u.fullName ?? "—"}</span>
                    <span>•</span>
                    <span>{formatStatus(u.role)}</span>
                  </div>
                </div>
                <div className="request-item-status">
                  <span className={`status-badge status-${u.accountStatus?.toLowerCase() || "active"}`}>{formatStatus(u.accountStatus)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
