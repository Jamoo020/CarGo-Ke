import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getDashboardPathForRole } from "../lib/roleAccess";

const services = [
  {
    number: "01",
    title: "Request a vehicle move",
    text: "Share the vehicle details, pickup and destination so your transport request has the information providers need.",
    icon: "↗",
  },
  {
    number: "02",
    title: "Compare provider quotes",
    text: "Review quotes submitted for your request and choose the option that works for your planned move.",
    icon: "≋",
  },
  {
    number: "03",
    title: "Follow the trip",
    text: "Use trip status updates, location sharing and vehicle inspection records to follow the transport process.",
    icon: "◎",
  },
];

const steps = [
  ["01", "Create your request", "Add vehicle information, confirmed pickup and destination, and your preferred timing."],
  ["02", "Review provider quotes", "Eligible transport providers can submit quotes for available requests."],
  ["03", "Confirm and prepare", "Select a quote and follow the in-app booking and payment steps."],
  ["04", "Inspect and track", "Pickup and delivery records, trip milestones and tracking support the journey."],
];

const faqs = [
  {
    question: "What can I arrange through CarGoKe?",
    answer: "The platform supports vehicle transport requests, provider quotes, trip progress, pickup and delivery inspections, and related booking records.",
  },
  {
    question: "Can I request a move from Mombasa Port?",
    answer: "You can enter a pickup and destination in Kenya in the transport request flow. The initial service focus is vehicle movements from Mombasa Port to destinations across Kenya; provider availability depends on quotes for your request.",
  },
  {
    question: "Do I need an account?",
    answer: "Yes. Create a customer account to submit a transport request and manage it in the customer workspace. Transport providers can register separately.",
  },
  {
    question: "Does the website promise a route price or delivery time?",
    answer: "No. Providers submit quotes for requests. Route and timing information depend on the available trip details and provider arrangements.",
  },
];

export default function PublicHomePage() {
  const { user, isAuthenticated } = useAuth();
  const requestPath = isAuthenticated ? "/customer/requests/new" : "/register";

  return (
    <>
      <section className="public-hero">
        <div className="public-hero-inner">
          <div className="public-hero-copy">
            <span className="public-eyebrow"><i /> Vehicle transport across Kenya</span>
            <h1>Moving vehicles.<br /><em>Connecting destinations.</em></h1>
            <p>
              CarGoKe connects customers with independent transport providers
              for vehicle movements from Mombasa Port and across Kenya.
            </p>
            <div className="public-hero-actions">
              <Link className="public-cta" to={requestPath}>Request vehicle transport <span aria-hidden="true">↗</span></Link>
              <Link className="public-text-link" to="/services">Explore our services <span aria-hidden="true">→</span></Link>
            </div>
            <div className="public-hero-note">
              <span className="public-note-icon" aria-hidden="true">⌖</span>
              <span><strong>Start with your route.</strong><br />Provider availability is confirmed through quotes.</span>
            </div>
          </div>
          <div className="public-hero-visual">
            <div className="public-hero-photo" role="img" aria-label="Transport vehicle on the road">
              <img
                src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1500&q=85"
                alt=""
                onError={(event) => { event.currentTarget.style.display = "none"; }}
              />
              <div className="public-photo-shade" />
            </div>
            <div className="public-route-card">
              <span className="public-route-dot" />
              <div><small>PLAN A VEHICLE MOVE</small><strong>Mombasa Port <span aria-hidden="true">→</span> your destination</strong></div>
              <span className="public-route-arrow" aria-hidden="true">↗</span>
            </div>
            <span className="public-hero-stamp">KENYA<br /><strong>ON THE MOVE</strong></span>
          </div>
        </div>
        <div className="public-hero-index"><span>01</span><i /><span>Connected transport</span></div>
      </section>

      {isAuthenticated ? (
        <section className="public-account-banner">
          <p>Welcome back{user?.fullName ? `, ${user.fullName}` : ""}.</p>
          <Link to={getDashboardPathForRole(user?.role)}>Go to your account <span aria-hidden="true">→</span></Link>
        </section>
      ) : null}

      <section className="public-section public-intro">
        <div className="public-section-kicker">A clearer way to get moving <span>01 / 05</span></div>
        <div className="public-intro-grid">
          <h2>Vehicle transport,<br /><em>made more connected.</em></h2>
          <div>
            <p className="public-lead">
              CarGoKe brings the request, provider quotes and trip information
              into one place—so customers and transporters can coordinate a
              vehicle move with greater clarity.
            </p>
            <Link className="public-underlined-link" to="/about">Get to know CarGoKe <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      <section className="public-section public-services-section">
        <div className="public-section-kicker">What you can do <span>02 / 05</span></div>
        <div className="public-heading-row">
          <div><span className="public-eyebrow">Services on the platform</span><h2>From first request<br />to trip records.</h2></div>
          <Link className="public-underlined-link" to="/services">View all services <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="public-service-grid">
          {services.map((service) => (
            <article className="public-service-card" key={service.number}>
              <div className="public-service-card-top"><span>{service.number}</span><b aria-hidden="true">{service.icon}</b></div>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <Link to="/how-it-works" aria-label={`Learn about ${service.title}`}>Learn more <span aria-hidden="true">↗</span></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="public-process-section">
        <div className="public-process-inner">
          <div className="public-process-copy">
            <div className="public-section-kicker public-section-kicker-light">The journey <span>03 / 05</span></div>
            <span className="public-eyebrow">How it works</span>
            <h2>A simple flow.<br /><em>Clear next steps.</em></h2>
            <p>Each request moves through a defined process—from details and quotes to trip progress and delivery records.</p>
            <Link className="public-cta public-cta-light" to="/how-it-works">See how it works <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="public-steps">
            {steps.map(([number, title, text]) => (
              <article className="public-step" key={number}>
                <span>{number}</span>
                <div><h3>{title}</h3><p>{text}</p></div>
                <span className="public-step-check" aria-hidden="true">↗</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section public-route-section">
        <div className="public-section-kicker">Where journeys begin <span>04 / 05</span></div>
        <div className="public-route-feature">
          <div className="public-route-feature-copy">
            <span className="public-eyebrow">Routes and coverage</span>
            <h2>From the coast<br />to destinations<br /><em>across Kenya.</em></h2>
            <p>
              Our initial focus is vehicle movements from Mombasa Port to
              destinations around Kenya. Enter the pickup and destination on
              your request; provider availability is established through the
              quotes received.
            </p>
            <Link className="public-underlined-link" to="/routes">Explore route information <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="public-route-graphic" aria-label="Illustration of a route from the Kenyan coast inland">
            <div className="public-route-map-grid" />
            <div className="public-route-map-shape" />
            <div className="public-route-map-line" />
            <div className="public-route-pin public-route-pin-coast"><i /><span>Mombasa</span></div>
            <div className="public-route-pin public-route-pin-inland"><i /><span>Across Kenya</span></div>
            <span className="public-route-map-label">ROUTE PLANNING<br />STARTS WITH YOUR REQUEST</span>
          </div>
        </div>
      </section>

      <section className="public-audience-section">
        <div className="public-audience-panel">
          <span className="public-eyebrow">For vehicle owners</span>
          <h2>Your vehicle move,<br />organised in one place.</h2>
          <p>Create a request, compare provider quotes and keep trip progress and inspection records together.</p>
          <Link className="public-cta" to={requestPath}>Start a request <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="public-audience-panel public-audience-panel-dark">
          <span className="public-eyebrow">For transport providers</span>
          <h2>Find requests.<br />Manage your trips.</h2>
          <p>Register as a transporter to access eligible requests, submit quotes and manage assigned trip workflows.</p>
          <Link className="public-cta public-cta-outline" to="/transporters">Explore transporter info <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className="public-section public-trust-section">
        <div className="public-section-kicker">Built around trip visibility <span>05 / 05</span></div>
        <div className="public-trust-grid">
          <div><span className="public-eyebrow">A record at each stage</span><h2>More context<br />along the way.</h2></div>
          <article><span aria-hidden="true">01</span><h3>Inspection records</h3><p>Pickup and delivery inspections can capture vehicle condition details and photographs.</p></article>
          <article><span aria-hidden="true">02</span><h3>Trip progress</h3><p>Status updates and location features help participants follow the trip in the platform.</p></article>
          <article><span aria-hidden="true">03</span><h3>Account controls</h3><p>Customers, transporters and administrators use role-specific, authenticated workspaces.</p></article>
        </div>
      </section>

      <section className="public-section public-business-callout">
        <div>
          <span className="public-eyebrow">For businesses</span>
          <h2>Moving vehicles regularly?</h2>
          <p>Tell us what your vehicle transport needs look like. Business enquiries are separate from creating a CarGoKe account.</p>
        </div>
        <Link className="public-cta" to="/business">Business transport information <span aria-hidden="true">↗</span></Link>
      </section>

      <section className="public-section public-faq-section">
        <div className="public-heading-row">
          <div><span className="public-eyebrow">A few useful details</span><h2>Frequently asked<br />questions.</h2></div>
          <Link className="public-underlined-link" to="/support">Visit support <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="public-faq-list">
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}<span aria-hidden="true">+</span></summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="public-final-cta">
        <span className="public-eyebrow">Your next move starts here</span>
        <h2>Ready to move<br /><em>a vehicle?</em></h2>
        <p>Start a request with your vehicle and route details.</p>
        <Link className="public-cta public-cta-light" to={requestPath}>Request vehicle transport <span aria-hidden="true">↗</span></Link>
      </section>
    </>
  );
}
