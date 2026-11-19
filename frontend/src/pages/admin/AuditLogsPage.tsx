import { useEffect, useState } from "react";
import { listAuditLogs } from "../../lib/admin";
import { formatDateTime, formatReference, formatStatus } from "../../lib/presentation";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await listAuditLogs();
        if (!mounted) return;
        setLogs(res.data ?? []);
        setError(null);
      } catch (e: any) {
        setError(e?.error ?? "Failed to load audit logs");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <section className="screen-card">
      <div className="page-header-row compact">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Audit Logs</h1>
        </div>
      </div>

      {error ? (
        <div className="error-box">{error}</div>
      ) : loading ? (
        <p className="status-text">Loading audit logs…</p>
      ) : logs.length === 0 ? (
        <div className="empty-state"><p>No audit logs available.</p></div>
      ) : (
        <ul className="request-list">
          {logs.map((log) => (
            <li key={log.id} className="request-item">
              <div className="request-item-main">
                <strong style={{color: "var(--navy-900)"}}>{formatStatus(log.action)}</strong>
                <div className="request-item-details">
                  <span>{formatStatus(log.entity)} {formatReference("record", log.entityId)}</span>
                  <span>•</span>
                  <span>{formatDateTime(log.createdAt)}</span>
                </div>
                {log.reason && <div style={{fontSize: "0.85rem", color: "var(--slate-500)", marginTop: "0.35rem"}}>Reason: {log.reason}</div>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
