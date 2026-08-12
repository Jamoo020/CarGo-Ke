import { Link } from "react-router-dom";

export default function AdminDashboardPage() {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <ul>
        <li><Link to="/admin/users">Users</Link></li>
        <li><Link to="/admin/drivers">Drivers</Link></li>
        <li><Link to="/admin/trips">Trips</Link></li>
        <li><Link to="/admin/payments">Payments</Link></li>
        <li><Link to="/admin/disputes">Disputes</Link></li>
        <li><Link to="/admin/config">Configuration</Link></li>
        <li><Link to="/admin/audit-logs">Audit Logs</Link></li>
      </ul>
      <p>Use the links above to navigate admin areas. No dashboard metrics are shown.</p>
    </div>
  );
}
