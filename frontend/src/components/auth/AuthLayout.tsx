import { Link, Outlet, useLocation } from "react-router-dom";
import "./auth-experience.css";

const benefits = [
  ["01", "Marketplace quotes", "Compare transport offers for your vehicle request."],
  ["02", "Trip progress", "Follow available status and location updates."],
  ["03", "Vehicle records", "Review pickup and delivery inspection evidence."],
];

export default function AuthLayout() {
  const { pathname } = useLocation();
  const activeView = pathname === "/register" ? "register" : pathname === "/login" ? "login" : null;

  return (
    <div className="auth-experience">
      <div className="auth-backdrop-art" aria-hidden="true">
        <span className="auth-art-route" />
        <span className="auth-art-sun" />
        <span className="auth-art-port auth-art-port-one" />
        <span className="auth-art-port auth-art-port-two" />
        <span className="auth-art-carrier">
          <i /><i /><i />
        </span>
      </div>
      <header className="auth-site-header">
        <Link className="auth-brand" to="/" aria-label="CarGoKe home">
          <span className="auth-brand-mark" aria-hidden="true">C</span>
          <span><strong>CarGo<span>Ke</span></strong><small>Vehicle transport, connected</small></span>
        </Link>
        <nav aria-label="Authentication navigation">
          <Link to="/">Home</Link>
          <Link to="/about">Corporate profile</Link>
          <Link to="/help">Help centre</Link>
        </nav>
      </header>

      <main className="auth-experience-main">
        <section className="auth-intro" aria-labelledby="auth-promo-title">
          <p className="auth-kicker"><span /> VEHICLE TRANSPORT ACROSS KENYA</p>
          <h1 id="auth-promo-title">Move Your Vehicle <em>with Confidence</em></h1>
          <p className="auth-intro-copy">
            Connecting customers with independent vehicle transport providers across Kenya.
          </p>
          <div className="auth-benefits">
            {benefits.map(([number, title, description]) => (
              <article key={number}>
                <span>{number}</span>
                <div><h2>{title}</h2><p>{description}</p></div>
              </article>
            ))}
          </div>
          <div className="auth-flow-art" aria-hidden="true">
            <span className="auth-flow-origin" />
            <i />
            <span className="auth-flow-destination" />
            <span className="auth-flow-caption">REQUEST <b>→</b> QUOTE <b>→</b> TRIP RECORDS</span>
          </div>
        </section>

        <section className="auth-panel-column" aria-label="Account access">
          <div className="auth-view-switch" aria-label="Account access options">
            <Link className={activeView === "login" ? "is-active" : ""} to="/login" aria-current={activeView === "login" ? "page" : undefined}>Log in</Link>
            <Link className={activeView === "register" ? "is-active" : ""} to="/register" aria-current={activeView === "register" ? "page" : undefined}>Create account</Link>
          </div>
          <Outlet />
          {pathname !== "/help" ? (
            <>
              <Link className="auth-help-link" to="/help">
                <span className="auth-help-icon" aria-hidden="true">?</span>
                <span><strong>Need help?</strong><small>Visit the Help Centre or contact support.</small></span>
                <span aria-hidden="true">›</span>
              </Link>
              <p className="auth-panel-footnote">Please provide accurate account and vehicle information.</p>
            </>
          ) : null}
        </section>
      </main>

      <footer className="auth-site-footer">
        <span>© {new Date().getFullYear()} CarGoKe</span>
        <span>Marketplace workflows for vehicle transport in Kenya</span>
      </footer>
    </div>
  );
}
