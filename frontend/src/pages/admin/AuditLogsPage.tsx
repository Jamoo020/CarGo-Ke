import { useEffect, useState } from "react";
import { listAuditLogs } from "../../lib/admin";

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

  if (loading) return <p>Loading audit logs...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h2>Audit Logs</h2>
      {logs.length === 0 ? <p>No audit logs available.</p> : (
        <ul>
          {logs.map((log) => (
            <li key={log.id}>
              <strong>{log.action}</strong> — {log.entity} {log.entityId} — {new Date(log.createdAt).toLocaleString()}
              {log.reason && <div>Reason: {log.reason}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
