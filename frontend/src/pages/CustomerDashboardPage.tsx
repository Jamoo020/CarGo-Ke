import { Link } from "react-router-dom";

export default function CustomerDashboardPage() {
  return (
    <section className="screen-card dashboard-card">
      <div className="page-header-row">
        <div>
          <p className="eyebrow">Customer Portal</p>
          <h1>Customer Dashboard</h1>
        </div>
        <Link to="/customer/requests/new" className="primary-link-button">New Request</Link>
      </div>

      <div className="dashboard-grid">
        <div className="info-panel">
          <h2>Transport requests</h2>
          <p>Review open bookings, compare quotes, and keep your trip activity moving.</p>
          <Link to="/customer/requests">View my requests</Link>
        </div>
        <div className="info-panel">
          <h2>Quick actions</h2>
          <ul className="stack-list">
            <li>Create a new ride request</li>
            <li>Check quote status</li>
            <li>Track trip updates</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
