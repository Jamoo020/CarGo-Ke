import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPayment } from "../../lib/admin";

export default function PaymentDetailPage() {
  const { paymentId } = useParams();
  const [payment, setPayment] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentId) {
      setError("Payment ID is required.");
      setLoading(false);
      return;
    }
    const resolvedPaymentId = paymentId;
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await getPayment(resolvedPaymentId);
        if (!mounted) return;
        setPayment(res.data ?? null);
        setError(null);
      } catch (e: any) {
        setError(e?.error ?? "Failed to load payment");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [paymentId]);

  if (loading) return <p>Loading payment...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!payment) return <p>Payment not found.</p>;

  return (
    <div>
      <h2>Payment {payment.id}</h2>
      <p>Trip: {payment.tripId}</p>
      <p>Customer: {payment.customerId}</p>
      <p>Status: {payment.status}</p>
      <p>Amount: KSh {payment.amount}</p>
      <p>Provider reference: {payment.providerReference ?? "-"}</p>
      <p>Provider callback reference: {payment.providerCallbackReference ?? "-"}</p>
      <p>Created: {new Date(payment.createdAt).toLocaleString()}</p>
      <p>Updated: {new Date(payment.updatedAt).toLocaleString()}</p>
    </div>
  );
}
