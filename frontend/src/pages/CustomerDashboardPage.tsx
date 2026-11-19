import { Link } from "react-router-dom";
import Map from "../components/map/Map";
import { useAuth } from "../hooks/useAuth";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const customerName = user?.fullName?.trim() || user?.email?.split("@")[0] || "there";

  return (
    <>
      <style>{`
        .cgk-home-shell {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          width: 100%;
        }

        .cgk-topbar {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .cgk-title-wrap {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .cgk-title {
          margin: 0;
          font-size: clamp(2rem, 4vw, 3.1rem);
          line-height: 1.05;
          letter-spacing: -0.06em;
          color: #0f172a;
        }

        .cgk-subtitle {
          margin: 0;
          font-size: 1.05rem;
          color: #475569;
        }

        .cgk-primary-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.9rem 1.25rem;
          border-radius: 14px;
          background: linear-gradient(135deg, #ffc247 0%, #e5a92f 100%);
          color: #101b2d;
          text-decoration: none;
          font-weight: 700;
          box-shadow: 0 14px 30px rgba(229, 169, 47, 0.22);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .cgk-primary-link:hover,
        .cgk-primary-link:focus-visible {
          transform: translateY(-1px);
          box-shadow: 0 18px 30px rgba(229, 169, 47, 0.28);
        }

        .cgk-hero {
          display: grid;
          grid-template-columns: 1.05fr 1.2fr;
          gap: 1.25rem;
          align-items: stretch;
        }

        .cgk-booking-panel,
        .cgk-map-panel,
        .cgk-stack-panel {
          background: rgba(255, 255, 255, 0.82);
          border: 1px solid rgba(148, 163, 184, 0.18);
          border-radius: 24px;
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.06);
        }

        .cgk-booking-panel {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          padding: 1rem;
        }

        .cgk-route-input {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.95rem 1rem;
          border-radius: 16px;
          background: #f8fafc;
          border: 1px solid rgba(148, 163, 184, 0.22);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .cgk-route-input + .cgk-route-input {
          margin-top: 0.25rem;
        }

        .cgk-route-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.75rem;
          height: 1.75rem;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 800;
          background: rgba(255, 194, 71, 0.24);
          color: #101b2d;
        }

        .cgk-route-input--destination .cgk-route-icon {
          background: rgba(34, 197, 94, 0.1);
          color: #15803d;
        }

        .cgk-route-field {
          flex: 1;
          min-width: 0;
          border: none;
          background: transparent;
          color: #0f172a;
          font-size: 1rem;
          padding: 0;
        }

        .cgk-route-field::placeholder {
          color: #94a3b8;
        }

        .cgk-route-field:focus {
          outline: none;
        }

        .cgk-map-panel {
          position: relative;
          min-height: 290px;
          overflow: hidden;
          border-radius: 26px;
        }

        .cgk-map-overlay {
          position: absolute;
          left: 1rem;
          right: 1rem;
          bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 0.8rem 0.9rem;
          border-radius: 16px;
          background: rgba(15, 23, 42, 0.72);
          backdrop-filter: blur(12px);
          color: #f8fafc;
          box-shadow: 0 14px 30px rgba(15, 23, 42, 0.2);
        }

        .cgk-map-label {
          display: block;
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          opacity: 0.7;
        }

        .cgk-map-value {
          display: block;
          margin-top: 0.2rem;
          font-size: 0.96rem;
          font-weight: 700;
        }

        .cgk-map-tag {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 0.4rem 0.7rem;
          background: rgba(34, 197, 94, 0.18);
          color: #dcfce7;
          border: 1px solid rgba(34, 197, 94, 0.2);
          font-size: 0.76rem;
          font-weight: 700;
        }

        .cgk-panels {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.2rem;
        }

        .cgk-stack-panel {
          padding: 1.2rem;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          min-height: 230px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .cgk-stack-panel:hover,
        .cgk-stack-panel:focus-within {
          transform: translateY(-1px);
          box-shadow: 0 22px 42px rgba(15, 23, 42, 0.08);
        }

        .cgk-panel-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }

        .cgk-panel-title {
          margin: 0;
          font-size: 1.05rem;
          color: #0f172a;
        }

        .cgk-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 0.42rem 0.72rem;
          font-size: 0.7rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 800;
        }

        .cgk-pill--info {
          background: rgba(255, 194, 71, 0.22);
          color: #664300;
        }

        .cgk-pill--success {
          background: rgba(34, 197, 94, 0.12);
          color: #15803d;
        }

        .cgk-empty-state {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0.75rem;
          min-height: 120px;
          padding: 1rem;
          border: 1px dashed rgba(148, 163, 184, 0.56);
          border-radius: 18px;
          background: rgba(248, 250, 252, 0.74);
          color: #475569;
        }

        .cgk-empty-title {
          margin: 0;
          font-size: 1rem;
          color: #0f172a;
        }

        .cgk-empty-text {
          margin: 0;
          line-height: 1.55;
          color: #475569;
        }

        .cgk-link-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          margin-top: auto;
          padding-top: 0.5rem;
        }

        .cgk-inline-link {
          color: #101b2d;
          text-decoration: none;
          font-weight: 700;
        }

        .cgk-inline-link:hover {
          color: #8a5b00;
          text-decoration: underline;
          text-underline-offset: 0.2em;
        }

        @media (max-width: 820px) {
          .cgk-hero,
          .cgk-panels {
            grid-template-columns: 1fr;
          }

          .cgk-topbar {
            align-items: flex-start;
          }
        }

        @media (max-width: 640px) {
          .screen-card {
            padding: 1.1rem;
            border-radius: 20px;
          }

          .cgk-title {
            font-size: 2rem;
          }

          .cgk-booking-panel {
            padding: 0.8rem;
          }

          .cgk-map-panel {
            min-height: 220px;
          }

          .cgk-map-overlay {
            flex-direction: column;
            align-items: flex-start;
          }

          .cgk-primary-link {
            width: 100%;
          }

          .cgk-link-row {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      <section className="screen-card cgk-home-shell">
        <div className="cgk-topbar">
          <div className="cgk-title-wrap">
            <p className="eyebrow">CarGo Kenya</p>
            <h1 className="cgk-title">Good {getGreeting()}, {customerName}</h1>
            <p className="cgk-subtitle">Where are you moving something?</p>
          </div>

          <Link to="/customer/requests/new" className="cgk-primary-link">
            Get a transport quote
          </Link>
        </div>

        <div className="cgk-hero">
          <div className="cgk-booking-panel">
            <div className="cgk-route-input">
              <span className="cgk-route-icon">📍</span>
              <input
                className="cgk-route-field"
                type="text"
                value=""
                placeholder="Pickup location"
                aria-label="Pickup location"
                readOnly
              />
            </div>

            <div className="cgk-route-input cgk-route-input--destination">
              <span className="cgk-route-icon">◎</span>
              <input
                className="cgk-route-field"
                type="text"
                value=""
                placeholder="Destination"
                aria-label="Destination"
                readOnly
              />
            </div>

            <Link to="/customer/requests/new" className="cgk-primary-link" style={{ marginTop: "0.25rem" }}>
              Get a transport quote
            </Link>
          </div>

          <div className="cgk-map-panel" aria-label="Route preview map">
            <Map
              center={{ lat: -1.2921, lng: 36.8219 }}
              zoom={11}
              style={{ width: "100%", height: "100%", minHeight: "290px" }}
            />

            <div className="cgk-map-overlay">
              <div>
                <span className="cgk-map-label">Destination</span>
                <span className="cgk-map-value">Nairobi, Kenya</span>
              </div>
              <span className="cgk-map-tag">Live route</span>
            </div>
          </div>
        </div>

        <div className="cgk-panels">
          <article className="cgk-stack-panel">
            <div className="cgk-panel-head">
              <h2 className="cgk-panel-title">Active trip</h2>
              <span className="cgk-pill cgk-pill--info">Status</span>
            </div>

            <div className="cgk-empty-state">
              <h3 className="cgk-empty-title">No active trip yet</h3>
              <p className="cgk-empty-text">
                Once a driver is selected and your trip begins, live trip details will appear here.
              </p>
            </div>

            <div className="cgk-link-row">
              <span style={{ color: "#64748b", fontSize: "0.92rem" }}>Your next trip will appear here</span>
              <Link to="/customer/requests" className="cgk-inline-link">View requests</Link>
            </div>
          </article>

          <article className="cgk-stack-panel">
            <div className="cgk-panel-head">
              <h2 className="cgk-panel-title">Recent requests</h2>
              <span className="cgk-pill cgk-pill--success">Recent</span>
            </div>

            <div className="cgk-empty-state">
              <h3 className="cgk-empty-title">No recent requests</h3>
              <p className="cgk-empty-text">
                Create a transport request to compare quotes and move your load with confidence.
              </p>
            </div>

            <div className="cgk-link-row">
              <span style={{ color: "#64748b", fontSize: "0.92rem" }}>Start with a new request</span>
              <Link to="/customer/requests/new" className="cgk-inline-link">Create request</Link>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
