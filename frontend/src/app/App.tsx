import { Link, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./providers/AuthProvider";
import AppRoutes from "./routes";
import RoleNavigation from "../components/navigation/RoleNavigation";

function AppShell() {
  const { user, isAuthenticated, logout } = useAuth();
  const { pathname } = useLocation();
  const isPublicWebsitePage = [
    "/",
    "/about",
    "/services",
    "/routes",
    "/how-it-works",
    "/transporters",
    "/business",
    "/support",
    "/contact",
    "/privacy",
    "/terms",
  ].includes(pathname);
  const isAuthExperiencePage = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/help",
  ].includes(pathname);
  const isStandalonePage = isPublicWebsitePage || isAuthExperiencePage;

  return (
    <div className="app-shell">
      {!isStandalonePage ? <a className="app-skip-link" href="#app-content">Skip to main content</a> : null}
      {!isStandalonePage ? <header className="topbar">
        <Link className="brand" to="/" aria-label="CarGoKe home">
          <span className="brand-mark" aria-hidden="true">C</span>
          <span className="brand-copy">
            <span className="brand-name">CarGo<span className="brand-ke">Ke</span></span>
            <span className="brand-tag">Vehicle transport, connected</span>
          </span>
        </Link>

        <div className="topbar-nav">
          {isAuthenticated ? <RoleNavigation /> : (
            <nav className="role-nav" aria-label="Account navigation">
              <Link to="/login" className="nav-link">Log in</Link>
              <Link to="/register" className="nav-link">Create account</Link>
            </nav>
          )}
          {isAuthenticated ? (
            <div className="topbar-user-row">
              <span className="user-pill" title={user?.email ?? undefined}>
                <span className="user-avatar" aria-hidden="true">
                  {(user?.fullName?.trim() || user?.email || "C").charAt(0).toUpperCase()}
                </span>
                <span className="user-identity">
                  <strong>{user?.fullName?.trim() || "CarGoKe user"}</strong>
                  <small>{user?.email}</small>
                </span>
              </span>
              <button type="button" className="link-button" onClick={logout}>Logout</button>
            </div>
          ) : null}
        </div>
      </header> : null}
      {isPublicWebsitePage ? (
        <div className="public-main">
          <AppRoutes />
        </div>
      ) : isAuthExperiencePage ? (
        <div className="auth-main">
          <AppRoutes />
        </div>
      ) : (
        <main className="page-shell" id="app-content">
          <AppRoutes />
        </main>
      )}
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
