import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { approveDriver, getDriver, rejectDriver, reactivateDriver, suspendDriver } from "../../lib/admin";

const DRIVER_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["APPROVED", "REJECTED"],
  APPROVED: ["SUSPENDED"],
  REJECTED: [],
  SUSPENDED: ["APPROVED"],
};

export default function DriverDetailPage() {
  const { driverId } = useParams();
  const [driver, setDriver] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!driverId) {
      setError("Driver ID is required.");
      setLoading(false);
      return;
    }
    const resolvedDriverId = driverId;
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await getDriver(resolvedDriverId);
        if (!mounted) return;
        setDriver(res.data ?? null);
        setError(null);
      } catch (e: any) {
        setError(e?.error ?? "Failed to load driver");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [driverId]);

  async function handleAction(action: "approve" | "reject" | "suspend" | "reactivate") {
    if (!driverId) return;
    if ((action === "reject" || action === "suspend" || action === "reactivate") && !reason.trim()) {
      setError("A reason is required for this action.");
      return;
    }

    const confirmText = action === "approve" ? "Approve this driver?" : `Perform ${action.toUpperCase()} action?`;
    if (!window.confirm(confirmText)) return;

    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      if (action === "approve") {
        await approveDriver(driverId, { reason: reason || undefined });
      } else if (action === "reject") {
        await rejectDriver(driverId, { reason });
      } else if (action === "suspend") {
        await suspendDriver(driverId, { reason });
      } else {
        await reactivateDriver(driverId, { reason });
      }
      const res = await getDriver(driverId);
      setDriver(res.data ?? null);
      setSuccess(`Driver ${action} action processed.`);
    } catch (e: any) {
      setError(e?.error ?? "Failed to update driver status");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p>Loading driver...</p>;
  if (error && !driver) return <p className="error">{error}</p>;
  if (!driver) return <p>Driver not found.</p>;

  const status = driver.verificationStatus ?? "PENDING";
  const validNext = DRIVER_TRANSITIONS[status] ?? [];

  return (
    <div>
      <h2>Driver {driver.user?.fullName ?? driver.user?.email ?? driver.id}</h2>
      <p>Email: {driver.user?.email}</p>
      <p>Verification status: {status}</p>
      <p>Verified: {String(driver.verified)}</p>
      {driver.verificationReason && <p>Reason: {driver.verificationReason}</p>}
      {driver.verificationNotes && <p>Notes: {driver.verificationNotes}</p>}

      <label>
        Reason
        <input value={reason} onChange={(e) => setReason(e.target.value)} />
      </label>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <div>
        {validNext.includes("APPROVED") && (
          <button type="button" onClick={() => handleAction("approve")} disabled={busy}>Approve</button>
        )}
        {validNext.includes("REJECTED") && (
          <button type="button" onClick={() => handleAction("reject")} disabled={busy}>Reject</button>
        )}
        {validNext.includes("SUSPENDED") && (
          <button type="button" onClick={() => handleAction("suspend")} disabled={busy}>Suspend</button>
        )}
        {status === "SUSPENDED" && (
          <button type="button" onClick={() => handleAction("reactivate")} disabled={busy}>Reactivate</button>
        )}
      </div>
    </div>
  );
}
