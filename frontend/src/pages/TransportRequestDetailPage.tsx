import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTransportRequest, getTransportRequestQuotes, selectQuote } from "../lib/customer";
import { TransportRequest, TransportRequestQuote } from "../types/customer";

export default function TransportRequestDetailPage() {
  const { requestId } = useParams();
  const [request, setRequest] = useState<TransportRequest | null>(null);
  const [quotes, setQuotes] = useState<TransportRequestQuote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!requestId) return;

    let isMounted = true;

    Promise.all([
      getTransportRequest(requestId),
      getTransportRequestQuotes(requestId),
    ])
      .then(([requestResponse, quoteResponse]) => {
        if (!isMounted) return;
        setRequest(requestResponse.data ?? null);
        setQuotes(quoteResponse.data ?? []);
      })
      .catch(() => {
        if (!isMounted) return;
        setRequest(null);
        setQuotes([]);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [requestId]);

  async function handleSelectQuote(quoteId: string) {
    try {
      await selectQuote(quoteId);
      if (requestId) {
        const nextRequest = await getTransportRequest(requestId);
        setRequest(nextRequest.data ?? null);
        const nextQuotes = await getTransportRequestQuotes(requestId);
        setQuotes(nextQuotes.data ?? []);
      }
    } catch {
      // no-op for now; this is a foundation slice
    }
  }

  if (!requestId) {
    return <section className="screen-card"><h1>Request not found</h1></section>;
  }

  if (isLoading) {
    return <section className="screen-card"><h1>Loading request…</h1></section>;
  }

  if (!request) {
    return <section className="screen-card"><h1>Request not found</h1></section>;
  }

  return (
    <section className="screen-card">
      <div className="page-header-row">
        <div>
          <p className="eyebrow">Trip details</p>
          <h1>{request.origin} → {request.destination}</h1>
        </div>
        <Link to="/customer/requests" className="secondary-link-button">Back to requests</Link>
      </div>

      <dl className="detail-list">
        <div>
          <dt>Status</dt>
          <dd>{request.status}</dd>
        </div>
        <div>
          <dt>Vehicle</dt>
          <dd>{request.vehicleDetailId}</dd>
        </div>
      </dl>

      <h2>Quotes</h2>
      {quotes.length === 0 ? (
        <p>No quotes yet.</p>
      ) : (
        <ul className="quote-list">
          {quotes.map((quote) => (
            <li key={quote.id} className="quote-item">
              <div>
                <strong>{quote.driver?.user?.fullName ?? "Driver"}</strong>
                <small>{quote.message}</small>
              </div>
              <div className="quote-actions">
                <span>KSh {quote.amount}</span>
                <button type="button" className="primary-button small-button" onClick={() => handleSelectQuote(quote.id)}>
                  Select Quote
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
