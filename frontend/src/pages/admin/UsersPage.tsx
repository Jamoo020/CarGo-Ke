import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listUsers } from "../../lib/admin";
import { UserRole, AccountStatus } from "../../types/auth";

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

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="error">{error}</p>;

  if (users.length === 0) return <p>No users found.</p>;

  return (
    <div>
      <h2>Users</h2>
      <div>
        <input placeholder="Search by email or name" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All roles</option>
          <option value="CUSTOMER">Customer</option>
          <option value="DRIVER">Driver</option>
          <option value="AUTHORIZED_REPRESENTATIVE">Authorized Representative</option>
          <option value="ADMIN">Admin</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="SUSPENDED">SUSPENDED</option>
          <option value="DEACTIVATED">DEACTIVATED</option>
        </select>
      </div>

      <ul>
        {users.map((u) => (
          <li key={u.id}>
            <Link to={`/admin/users/${u.id}`}>{u.email}</Link> — {u.fullName ?? ""} — {u.role} — {u.accountStatus}
          </li>
        ))}
      </ul>
    </div>
  );
}
