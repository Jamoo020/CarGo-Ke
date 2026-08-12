import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUser, updateUserStatus } from "../../lib/admin";

export default function UserDetailPage() {
  const { userId } = useParams();
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!userId) {
      setError("User ID is required.");
      setLoading(false);
      return;
    }
    const resolvedUserId = userId;
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await getUser(resolvedUserId);
        if (!mounted) return;
        setUser(res.data);
        setStatus(res.data.accountStatus ?? "");
      } catch (e: any) {
        setError(e?.error ?? "Failed to load user");
      } finally { if (mounted) setLoading(false); }
    }
    load();
    return () => { mounted = false; };
  }, [userId]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    if (!["ACTIVE","SUSPENDED","DEACTIVATED"].includes(status)) {
      setError("Unsupported status");
      return;
    }
    if (!confirm(`Change account status to ${status}?`)) return;
    setUpdating(true);
    try {
      await updateUserStatus(userId, { accountStatus: status, reason: reason || undefined });
      const res = await getUser(userId);
      setUser(res.data);
      setError(null);
    } catch (e: any) {
      setError(e?.error ?? "Failed to update status");
    } finally { setUpdating(false); }
  }

  if (loading) return <p>Loading user...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div>
      <h2>User {user.email}</h2>
      <p>Name: {user.fullName}</p>
      <p>Role: {user.role}</p>
      <p>Account status: {user.accountStatus}</p>

      <h3>Update account status</h3>
      <form onSubmit={handleUpdate}>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="ACTIVE">ACTIVE</option>
          <option value="SUSPENDED">SUSPENDED</option>
          <option value="DEACTIVATED">DEACTIVATED</option>
        </select>
        <div>
          <label>Reason (optional)</label>
          <input value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>
        <button type="submit" disabled={updating}>{updating ? "Updating..." : "Update Status"}</button>
      </form>
    </div>
  );
}
