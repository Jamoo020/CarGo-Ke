import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getDashboardPathForRole } from "../../lib/roleAccess";
import "./public-site.css";

const navigation = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Routes", to: "/routes" },
  { label: "For transporters", to: "/transporters" },
  { label: "For businesses", to: "/business" },
  { label: "Support", to: "/support" },
];

export default function PublicLayout() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const dashboardPath = getDashboardPathForRole(user?.role);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const requestPath = isAuthenticated ? "/customer/requests/new" : "/register";

  return (
    <div className="public-site">
      <a className="public-skip-link" href="#main-content">Skip to content</a>
      <header className="public-header">
        <div className="public-header-inner">
          <Link className="public-brand" to="/" aria-label="CarGoKe home">
            <span className="public-brand-mark" aria-hidden="true">C</span>
            <span className="public-brand-copy">
              <strong>CarGo<span>Ke</span></strong>
              <small>Vehicle transport, connected</small>
            </span>
          </Link>

          <button
            type="button"
            className="public-menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="public-navigation"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav
            id="public-navigation"
            className={`public-navigation ${menuOpen ? "is-open" : ""}`}
            aria-label="Main navigation"
          >
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) => `public-nav-link${isActive ? " is-active" : ""}`}
              >
                {item.label}
              </NavLink>
            ))}
            <div className="public-nav-actions">
              {isAuthenticated ? (
                <Link className="public-login-link" to={dashboardPath}>My account</Link>
              ) : (
                <>
                  <Link className="public-login-link" to="/login">Log in</Link>
                  <Link className="public-register-link" to="/register">Create account</Link>
                </>
              )}
              <Link className="public-cta public-cta-small" to={requestPath}>
                Request transport
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main id="main-content" className="public-content">
        <Outlet />
      </main>

      <footer className="public-footer">
        <div className="public-footer-main">
          <div className="public-footer-brand">
            <Link className="public-brand public-brand-footer" to="/" aria-label="CarGoKe home">
              <span className="public-brand-mark" aria-hidden="true">C</span>
              <span className="public-brand-copy">
                <strong>CarGo<span>Ke</span></strong>
                <small>Vehicle transport, connected</small>
              </span>
            </Link>
            <p>A marketplace connecting people who need vehicles moved with independent transport providers.</p>
          </div>
          <div className="public-footer-links">
            <strong>Explore</strong>
            <Link to="/about">About CarGoKe</Link>
            <Link to="/services">Our services</Link>
            <Link to="/routes">Routes and coverage</Link>
            <Link to="/how-it-works">How it works</Link>
          </div>
          <div className="public-footer-links">
            <strong>Get started</strong>
            <Link to="/transporters">For transporters</Link>
            <Link to="/business">For businesses</Link>
            <Link to="/support">FAQs and support</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="public-footer-links">
            <strong>Your account</strong>
            <Link to="/login">Log in</Link>
            <Link to="/register">Create an account</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
        </div>
        <div className="public-footer-bottom">
          <span>© {new Date().getFullYear()} CarGoKe</span>
          <span>Built for vehicle transport in Kenya</span>
        </div>
      </footer>
    </div>
  );
}
