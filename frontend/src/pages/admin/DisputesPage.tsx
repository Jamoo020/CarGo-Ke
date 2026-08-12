import { useState } from "react";
import { getDispute, updateDispute } from "../../lib/admin";

export default function DisputesPage() {
  const [disputeIdInput, setDisputeIdInput] = useState("");
  const [selected, setSelected] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [resolutionType, setResolutionType] = useState("");
  const [resolutionAmount, setResolutionAmount] = useState("");
  const [resolutionSummary, setResolutionSummary] = useState("");
  const [status, setStatus] = useState("");

  async function handleLoadDispute() {
    if (!disputeIdInput.trim()) {
      setError("Enter a dispute ID to load the record.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await getDispute(disputeIdInput.trim());
      const dispute = res.data ?? null;
      setSelected(dispute);
      setStatus(dispute?.status ?? "");
      setResolutionType(dispute?.resolutionType ?? "");
      setResolutionAmount(dispute?.resolutionAmount != null ? String(dispute.resolutionAmount) : "");
      setResolutionSummary(dispute?.resolutionSummary ?? "");
    } catch (e: any) {
      setError(e?.error ?? "Failed to load dispute");
      setSelected(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    if (resolutionType === "PARTIAL_REFUND" && (!resolutionAmount || Number(resolutionAmount) <= 0)) {
      setError("A positive resolutionAmount is required for PARTIAL_REFUND.");
      return;
    }
    if ((resolutionType === "FULL_REFUND" || resolutionType === "PARTIAL_REFUND") && !window.confirm("This will trigger a refund flow. Continue?")) {
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const body: any = {
        status: status || undefined,
        resolutionType: resolutionType || undefined,
        resolutionSummary: resolutionSummary || undefined,
      };
      if (resolutionAmount && (resolutionType === "PARTIAL_REFUND" || resolutionType === "FULL_REFUND")) {
        body.resolutionAmount = Number(resolutionAmount);
      }
      const res = await updateDispute(selected.id, body);
      const dispute = res.data ?? null;
      setSelected(dispute);
      setStatus(dispute?.status ?? "");
      setResolutionType(dispute?.resolutionType ?? "");
      setResolutionAmount(dispute?.resolutionAmount != null ? String(dispute.resolutionAmount) : "");
      setResolutionSummary(dispute?.resolutionSummary ?? "");
    } catch (e: any) {
      setError(e?.error ?? "Failed to resolve dispute");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h2>Disputes</h2>
      <div>
        <label>Dispute ID</label>
        <input value={disputeIdInput} onChange={(e) => setDisputeIdInput(e.target.value)} placeholder="Enter dispute ID" />
        <button type="button" onClick={handleLoadDispute} disabled={loading}>{loading ? "Loading..." : "Load dispute"}</button>
      </div>
      {error && <p className="error">{error}</p>}
      {selected && (
        <form onSubmit={handleSubmit}>
          <h3>Dispute {selected.id}</h3>
          <p>Trip: {selected.tripId}</p>
          <p>Description: {selected.description ?? "-"}</p>
          <div>
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="OPEN">OPEN</option>
              <option value="UNDER_REVIEW">UNDER_REVIEW</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>
          <div>
            <label>Resolution type</label>
            <select value={resolutionType} onChange={(e) => setResolutionType(e.target.value)}>
              <option value="">None</option>
              <option value="FULL_REFUND">FULL_REFUND</option>
              <option value="PARTIAL_REFUND">PARTIAL_REFUND</option>
              <option value="DRIVER_PENALTY">DRIVER_PENALTY</option>
              <option value="NO_ACTION">NO_ACTION</option>
            </select>
          </div>
          {(resolutionType === "PARTIAL_REFUND" || resolutionType === "FULL_REFUND") && (
            <div>
              <label>Resolution amount</label>
              <input type="number" min="0" step="0.01" value={resolutionAmount} onChange={(e) => setResolutionAmount(e.target.value)} />
            </div>
          )}
          <div>
            <label>Resolution summary</label>
            <textarea value={resolutionSummary} onChange={(e) => setResolutionSummary(e.target.value)} />
          </div>
          <button type="submit" disabled={saving}>{saving ? "Saving..." : "Update dispute"}</button>
        </form>
      )}
    </div>
  );
}
