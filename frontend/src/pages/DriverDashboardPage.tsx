import { Link } from "react-router-dom";
import DriverQuotesPage from "./DriverQuotesPage";

export default function DriverDashboardPage() {
  return (
    <section className="screen-card dashboard-card marketplace-shell">
      <div className="page-header-row marketplace-header-row">
        <div>
          <p className="eyebrow">Driver Marketplace</p>
          <h1>Available transport jobs</h1>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link to="/driver/trips" className="primary-link-button">My Trips</Link>
          <Link to="/driver/wallet" className="secondary-link-button">Wallet</Link>
        </div>
      </div>

      <DriverQuotesPage showPendingBanner={true} />
    </section>
  );
}
