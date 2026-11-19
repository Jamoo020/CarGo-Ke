import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTripWallet, listTrips, releaseDriverFunds } from "../lib/driver";
import { formatReference, formatStatus } from "../lib/presentation";

interface DriverWalletSummary {
  id?: string;
  tripId?: string;
  driverFee?: number;
  fuelBudget?: number;
  carGoFee?: number;
  driverAmountReleased?: number;
  driverAmountRemaining?: number;
  driverCompensationReleased?: number;
  driverCompensationRemaining?: number;
  releaseAccountingVersion?: number;
  fuelAllocated?: number;
  fuelSpent?: number;
  fuelPending?: number;
  fuelRemaining?: number;
  fuelAccountingStatus?: string;
  customerPaymentAmount?: number;
  refundAmount?: number;
  trip?: {
    status?: string;
    driverCompletionConfirmedAt?: string | null;
    customerCompletionConfirmedAt?: string | null;
    payment?: { status?: string; amount?: number } | null;
    dispute?: { status?: string } | null;
    refunds?: Array<{ id: string }>;
  };
  transactions?: Array<{ id: string; type: string; amount: number; note?: string | null; createdAt?: string }>;
}

export default function DriverWalletPage() {
  const [wallets, setWallets] = useState<DriverWalletSummary[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [releaseLoadingId, setReleaseLoadingId] = useState<string | null>(null);
  const [releaseMessage, setReleaseMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const tripsResponse = await listTrips();
        const tripList = tripsResponse.data ?? [];
        setTrips(tripList);

        const walletResults = await Promise.allSettled(
          tripList.map(async (trip) => {
            const walletResponse = await getTripWallet(trip.id);
            return walletResponse.data ?? null;
          }),
        );

        const walletEntries = walletResults
          .filter((result): result is PromiseFulfilledResult<DriverWalletSummary | null> => result.status === "fulfilled")
          .map((result) => result.value)
          .filter((wallet): wallet is DriverWalletSummary => Boolean(wallet));
        const unexpectedFailure = walletResults.find(
          (result) => result.status === "rejected" && result.reason?.status !== "404",
        );

        setWallets(walletEntries);
        setError(
          unexpectedFailure
            ? "Some trip wallet details could not be loaded. Please retry."
            : null,
        );
      } catch (caughtError: any) {
        setError(caughtError?.error ?? "Failed to load wallet details.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function handleRelease(tripId: string) {
    if (!tripId) return;
    setReleaseMessage(null);
    setReleaseLoadingId(tripId);

    try {
      const response = await releaseDriverFunds(tripId);
      const updated = response.data ?? null;
      if (updated?.tripId) {
        const walletResponse = await getTripWallet(updated.tripId);
        const nextWallet = walletResponse.data ?? null;
        setWallets((current) => {
          const withoutCurrent = current.filter((entry) => entry.tripId !== updated.tripId);
          return nextWallet ? [...withoutCurrent, nextWallet] : withoutCurrent;
        });
      }
      setReleaseMessage("Driver-fee installment credited to the internal driver wallet. No external payout was made.");
    } catch (caughtError: any) {
      setReleaseMessage(caughtError?.error ?? "Unable to release driver funds right now.");
    } finally {
      setReleaseLoadingId(null);
    }
  }

  const totalReleasedCompensation = wallets.reduce(
    (sum, wallet) => sum + (wallet.releaseAccountingVersion === 2 ? wallet.driverCompensationReleased ?? 0 : 0),
    0,
  );
  const pendingCompensation = wallets.reduce(
    (sum, wallet) => sum + (wallet.releaseAccountingVersion === 2 ? wallet.driverCompensationRemaining ?? 0 : 0),
    0,
  );

  return (
    <section className="screen-card">
      <div className="page-header-row compact">
        <div>
          <p className="eyebrow">Driver wallet</p>
          <h1>My Wallet</h1>
        </div>
        <Link to="/driver/trips" className="secondary-link-button">View trips</Link>
      </div>

      {error ? <div className="error-box">{error}</div> : null}
      {releaseMessage ? <div className="success-box">{releaseMessage}</div> : null}

      <div className="detail-list" style={{ marginBottom: 24 }}>
        <div>
          <dt>Driver compensation credited</dt>
          <dd>KSh {totalReleasedCompensation.toFixed(2)}</dd>
        </div>
        <div>
          <dt>Unreleased driver compensation</dt>
          <dd>KSh {pendingCompensation.toFixed(2)}</dd>
        </div>
      </div>
      <p className="status-text" style={{ marginTop: -12, marginBottom: 20 }}>
        Credits shown here are internal wallet entries, not completed bank or mobile-money payouts.
      </p>

      {loading ? (
        <p className="status-text">Loading wallet data…</p>
      ) : wallets.length === 0 ? (
        <div className="empty-state">
          <p>No trip wallet activity yet.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 18 }}>
          {wallets.map((wallet) => {
            const trip = trips.find((item) => item.id === wallet.tripId);
            const legacyAccounting = wallet.releaseAccountingVersion !== 2;
            const driverFeeMinorUnits = Math.round(((wallet.driverFee ?? 0) + Number.EPSILON) * 100);
            const firstReleaseAmount = Math.round(driverFeeMinorUnits * 0.3) / 100;
            const finalReleaseAmount = (driverFeeMinorUnits - Math.round(driverFeeMinorUnits * 0.3)) / 100;
            const firstRelease = wallet.transactions?.find((transaction) => transaction.type === "DRIVER_FIRST_RELEASE");
            const finalRelease = wallet.transactions?.find((transaction) => transaction.type === "DRIVER_FINAL_RELEASE");
            const tripStatus = wallet.trip?.status ?? trip?.status;
            const paymentConfirmed = wallet.trip?.payment?.status === "CONFIRMED";
            const disputeHeld = ["OPEN", "UNDER_REVIEW"].includes(wallet.trip?.dispute?.status ?? "")
              || tripStatus === "DISPUTED";
            const refundHeld = Boolean(wallet.trip?.refunds?.length);
            const canReleaseFirst = !legacyAccounting
              && !firstRelease
              && tripStatus === "TRIP_ACTIVE"
              && paymentConfirmed
              && !disputeHeld
              && !refundHeld;

            return (
              <div key={wallet.id ?? wallet.tripId} className="trip-detail-panel" style={{ padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div>
                    <div className="eyebrow">Trip wallet</div>
                    <strong>{formatReference("trip", trip?.id ?? wallet.tripId)}</strong>
                  </div>
                  {tripStatus ? (
                    <span className={`status-badge status-${String(tripStatus).toLowerCase()}`}>{formatStatus(tripStatus)}</span>
                  ) : null}
                </div>

                <div className="detail-list">
                  <div>
                    <dt>Customer payment</dt>
                    <dd>KSh {Number(wallet.customerPaymentAmount ?? 0).toFixed(2)}</dd>
                  </div>
                  <div>
                    <dt>Payment status</dt>
                    <dd>{formatStatus(wallet.trip?.payment?.status)}</dd>
                  </div>
                  <div>
                    <dt>Driver fee</dt>
                    <dd>KSh {Number(wallet.driverFee ?? 0).toFixed(2)}</dd>
                  </div>
                  <div>
                    <dt>Fuel allocation</dt>
                    <dd>KSh {Number(wallet.fuelAllocated ?? wallet.fuelBudget ?? 0).toFixed(2)}</dd>
                  </div>
                  <div>
                    <dt>CarGo fee</dt>
                    <dd>KSh {Number(wallet.carGoFee ?? 0).toFixed(2)}</dd>
                  </div>
                  <div>
                    <dt>First driver-fee installment (30%)</dt>
                    <dd>KSh {firstReleaseAmount.toFixed(2)} · {firstRelease ? "Credited" : "Pending"}</dd>
                  </div>
                  <div>
                    <dt>Final driver-fee installment (70%)</dt>
                    <dd>KSh {finalReleaseAmount.toFixed(2)} · {finalRelease ? "Credited" : "Pending"}</dd>
                  </div>
                  <div>
                    <dt>Unreleased driver compensation</dt>
                    <dd>{legacyAccounting ? "Unreconciled legacy balance" : `KSh ${Number(wallet.driverCompensationRemaining ?? 0).toFixed(2)}`}</dd>
                  </div>
                  <div>
                    <dt>Fuel status</dt>
                    <dd>{wallet.fuelAccountingStatus === "RESTRICTED" ? "Restricted · unavailable for spending" : "Legacy allocation · unreconciled"}</dd>
                  </div>
                  {wallet.fuelAccountingStatus === "RESTRICTED" ? (
                    <>
                      <div><dt>Fuel spent</dt><dd>KSh {Number(wallet.fuelSpent ?? 0).toFixed(2)}</dd></div>
                      <div><dt>Fuel payment pending</dt><dd>KSh {Number(wallet.fuelPending ?? 0).toFixed(2)}</dd></div>
                      <div><dt>Fuel remaining (restricted)</dt><dd>KSh {Number(wallet.fuelRemaining ?? 0).toFixed(2)}</dd></div>
                    </>
                  ) : null}
                  <div>
                    <dt>Driver completion confirmation</dt>
                    <dd>{wallet.trip?.driverCompletionConfirmedAt ? "Confirmed" : "Awaiting driver"}</dd>
                  </div>
                  <div>
                    <dt>Customer completion confirmation</dt>
                    <dd>{wallet.trip?.customerCompletionConfirmedAt ? "Confirmed" : "Awaiting customer"}</dd>
                  </div>
                  <div>
                    <dt>Dispute / hold</dt>
                    <dd>{disputeHeld ? "Funds held for active dispute" : refundHeld ? "Funds held for pending refund" : "No active dispute or pending refund"}</dd>
                  </div>
                </div>

                {legacyAccounting ? (
                  <div className="error-box" role="status" style={{ marginTop: 14 }}>
                    This wallet contains historical release accounting that may combine fuel and driver compensation. Existing records are preserved and no further automatic release is allowed until reconciliation.
                  </div>
                ) : null}

                {Array.isArray(wallet.transactions) && wallet.transactions.length > 0 ? (
                  <div style={{ marginTop: 16 }}>
                    <div className="eyebrow" style={{ marginBottom: 12 }}>Transaction history</div>
                    <div style={{ display: "grid", gap: 8 }}>
                      {wallet.transactions.map((transaction) => (
                        <div key={transaction.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, background: "#f8fafc", border: "1px solid #dfe6ee", borderRadius: 12, padding: "10px 12px" }}>
                          <div>
                            <strong>
                              {legacyAccounting && ["DRIVER_FIRST_RELEASE", "DRIVER_FINAL_RELEASE"].includes(transaction.type)
                                ? `Legacy recorded release · ${formatStatus(transaction.type)}`
                                : formatStatus(transaction.type)}
                            </strong>
                            <div style={{ color: "#4e5d73", fontSize: 12 }}>{transaction.note ?? "Wallet transaction"}</div>
                          </div>
                          <div style={{ fontWeight: 700 }}>KSh {Number(transaction.amount ?? 0).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {canReleaseFirst && (
                  <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      className="primary-button"
                      onClick={() => handleRelease(wallet.tripId ?? "")}
                      disabled={releaseLoadingId === wallet.tripId}
                    >
                      {releaseLoadingId === wallet.tripId ? "Crediting..." : "Credit first driver installment"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
