import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getDashboardPathForRole } from "../lib/roleAccess";

interface PlaceholderScreenProps {
  title: string;
  message?: string;
}

export default function PlaceholderScreen({ title, message }: PlaceholderScreenProps) {
  const { user, logout } = useAuth();
  const dashboardPath = getDashboardPathForRole(user?.role);

  return (
    <section className="screen-card">
      <h1>{title}</h1>
      <p>
        {user ? `You are signed in as ${user.role}.` : "You are not signed in."}
      </p>
      <p>{message ?? "You do not have permission to access this area."}</p>
      <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", flexWrap: "wrap" }}>
        {user ? (
          <Link to={dashboardPath} className="primary-link-button">Back to Dashboard</Link>
        ) : (
          <Link to="/login" className="primary-link-button">Back to Login</Link>
        )}
        {user ? (
          <button type="button" className="secondary-link-button" onClick={logout}>Logout</button>
        ) : null}
      </div>
    </section>
  );
}
