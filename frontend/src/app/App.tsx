import { Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./providers/AuthProvider";
import AppRoutes from "./routes";
import RoleNavigation from "../components/navigation/RoleNavigation";

function AppShell() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">CarGo Kenya</div>
        <nav className="topbar-nav" aria-label="Main navigation">
          {!isAuthenticated ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <>
              <span className="user-pill">{user?.email ?? "Authenticated"}</span>
              <RoleNavigation />
              <button type="button" className="link-button" onClick={logout}>Logout</button>
            </>
          )}
        </nav>
      </header>
      <main className="page-shell">
        <AppRoutes />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
