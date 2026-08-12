import { useEffect, useState } from "react";
import { listMyQuotes, createQuote } from "../lib/driver";
import { TransportRequestQuote } from "../types/customer";

export default function DriverQuotesPage() {
  const [quotes, setQuotes] = useState<TransportRequestQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formRequestId, setFormRequestId] = useState("");
  const [formAmount, setFormAmount] = useState(0);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await listMyQuotes();
        if (!mounted) return;
        setQuotes(res.data ?? []);
        setError(null);
      } catch (e: any) {
        setError(e?.error ?? "Failed to load quotes");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(null);
    try {
      await createQuote(formRequestId.trim(), { amount: formAmount, message: "Driver quote" });
      setSuccess("Quote submitted");
    } catch (err: any) {
      setError(err?.error ?? "Failed to create quote");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h2>My Quotes</h2>
      {loading && <p>Loading quotes...</p>}
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <ul>
        {quotes.map((q) => (
          <li key={q.id}>
            <strong>{q.transportRequestId}</strong> — KSh {q.amount} — {q.status}
            <div>
              Request ID: {q.transportRequestId}
            </div>
          </li>
        ))}
      </ul>

      <h3>Submit a quote</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="driver-quote-request-id">
          Transport Request ID
        </label>
        <input id="driver-quote-request-id" aria-label="Transport Request ID" value={formRequestId} onChange={(e) => setFormRequestId(e.target.value)} />
        <label htmlFor="driver-quote-amount">
          Amount
        </label>
        <input id="driver-quote-amount" aria-label="Amount" type="number" value={formAmount} onChange={(e) => setFormAmount(Number(e.target.value))} />
        <button type="submit" disabled={submitting || !formRequestId || formAmount <= 0}>{submitting ? "Submitting..." : "Submit Quote"}</button>
      </form>
    </div>
  );
}
