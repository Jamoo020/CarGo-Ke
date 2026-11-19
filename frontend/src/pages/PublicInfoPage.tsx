import { Link } from "react-router-dom";

interface PublicPageContent {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Array<{ title: string; body: string }>;
  cta?: { label: string; to: string };
}

const pages: Record<string, PublicPageContent> = {
  about: {
    eyebrow: "Corporate profile",
    title: "About CarGoKe",
    intro: "CarGoKe is a Kenyan vehicle-transport marketplace designed to connect people who need vehicles moved with independent transport providers.",
    sections: [
      { title: "Our purpose", body: "We bring transport requests, provider quotes and trip information into a shared digital workflow, helping participants coordinate vehicle movements with clearer next steps." },
      { title: "Our service focus", body: "The initial market focus is Mombasa and vehicle movements from Mombasa Port to destinations across Kenya. Actual provider availability is determined by the quotes received for each request." },
      { title: "How the marketplace works", body: "Customers create vehicle-specific requests. Eligible transport providers can review available requests and submit quotes. Customers can review and select a quote, then follow the trip through the platform." },
      { title: "Trust and visibility", body: "The application supports driver approval workflows, role-based accounts, trip status tracking and pickup and delivery inspection records. These tools provide operational records; they are not a guarantee of transport outcomes." },
    ],
    cta: { label: "Explore how it works", to: "/how-it-works" },
  },
  services: {
    eyebrow: "Service discovery",
    title: "Vehicle transport services",
    intro: "Explore the transport coordination workflows currently available through CarGoKe.",
    sections: [
      { title: "Vehicle transport requests", body: "Customers can submit vehicle information, confirmed pickup and destination details, and preferred travel timing through the request workflow." },
      { title: "Provider quotes", body: "Eligible transport providers can submit quotes against available requests. Customers review and select from the quotes they receive." },
      { title: "Trip coordination", body: "After a quote is selected, participants can use the platform's trip status and milestone workflow to follow progress." },
      { title: "Vehicle condition records", body: "Pickup and delivery inspections can record vehicle condition information and photos within the trip workflow." },
    ],
    cta: { label: "Start a transport request", to: "/register" },
  },
  routes: {
    eyebrow: "Routes and coverage",
    title: "Plan a route across Kenya",
    intro: "CarGoKe's initial market focus is vehicle movements from Mombasa Port to destinations across Kenya.",
    sections: [
      { title: "Start with your locations", body: "Enter the actual pickup and destination when creating a request. The platform validates locations in Kenya and keeps selected place names and coordinates with the request." },
      { title: "Availability is request-based", body: "The marketplace does not publish a guaranteed route timetable or fixed coverage list. Provider availability depends on the requests and quotes available at the time." },
      { title: "Mombasa Port movements", body: "Port-related vehicle movements are part of the initial service focus. Add the relevant pickup details to your request so providers can assess the job." },
      { title: "Route information", body: "A displayed route estimate is only available when the selected map provider returns a valid route. Local development mode intentionally does not present simulated distances or driving times." },
    ],
    cta: { label: "Create a transport request", to: "/register" },
  },
  "how-it-works": {
    eyebrow: "The process",
    title: "How CarGoKe works",
    intro: "A request-led workflow connects customers and transport providers, with trip records available as the move progresses.",
    sections: [
      { title: "1. Create a request", body: "A customer signs in, adds vehicle details and selects pickup and destination locations in Kenya." },
      { title: "2. Providers submit quotes", body: "Eligible drivers can review available jobs and send a quote for a request." },
      { title: "3. Select and confirm", body: "The customer reviews quotes and selects a provider. The application then guides the participants through booking and payment steps." },
      { title: "4. Inspect and follow the trip", body: "The trip workflow supports pickup and delivery inspections, status transitions, milestones and location updates." },
      { title: "5. Keep the records", body: "Trip, inspection and related operational records remain available through the appropriate authenticated account screens." },
    ],
    cta: { label: "Create your account", to: "/register" },
  },
  transporters: {
    eyebrow: "For independent providers",
    title: "Transport vehicles with CarGoKe",
    intro: "CarGoKe provides an account workflow for transport providers to discover eligible vehicle-movement requests and manage assigned trips.",
    sections: [
      { title: "Register as a driver", body: "Create a driver account through registration. Access to driver workflows is subject to account status and the platform's driver eligibility and approval process." },
      { title: "Review available requests", body: "Eligible drivers can review available jobs and submit quotes with their proposed amount and relevant details." },
      { title: "Manage an assigned trip", body: "The driver workspace supports trip actions, required vehicle inspections, photo records and trip progress features." },
      { title: "Independent providers", body: "Transport providers operate independently. CarGoKe provides marketplace and workflow tools and does not make claims here about employment, guaranteed work or earnings." },
    ],
    cta: { label: "Register as a driver", to: "/register" },
  },
  business: {
    eyebrow: "For businesses",
    title: "Vehicle transport for business needs",
    intro: "Vehicle importers, dealerships and fleet operators can explore the CarGoKe request and provider-quote workflow for vehicle movements.",
    sections: [
      { title: "A request-led marketplace", body: "The existing product supports vehicle-specific transport requests, provider quotes, trip tracking and inspection records. It does not currently advertise a separate enterprise dashboard or negotiated corporate service level." },
      { title: "Recurring or multi-vehicle needs", body: "Use the public enquiry option below to share a business question if a public contact address has been configured. Otherwise, create a customer account to submit an individual request and assess the platform workflow." },
      { title: "Business enquiries are not platform accounts", body: "Submitting an enquiry is separate from registering for an authenticated customer, driver or representative account. Do not share credentials or sensitive vehicle documents in a general enquiry." },
    ],
    cta: { label: "Create a customer account", to: "/register" },
  },
  support: {
    eyebrow: "FAQs and support",
    title: "Help for your CarGoKe journey",
    intro: "Find answers to common questions about requests, quotes and trip records.",
    sections: [
      { title: "How do I request a vehicle move?", body: "Create a customer account, then enter the vehicle details, pickup, destination and any preferred timing in a new transport request." },
      { title: "Why have I not received a quote?", body: "Quotes depend on eligible transport providers reviewing and responding to the request. The platform does not guarantee a quote or a response time." },
      { title: "Where can I see trip updates?", body: "Sign in and open the relevant request or trip from your customer workspace. The available status and location details depend on trip activity and data provided." },
      { title: "Where are inspection photos?", body: "Inspection photos and condition details are shown with the relevant inspection record in the authenticated trip screens, where available." },
      { title: "Need account-specific assistance?", body: "Sign in to your account and use the support or dispute options available for the relevant trip. For a general business enquiry, see the contact page." },
    ],
    cta: { label: "Log in to your account", to: "/login" },
  },
  contact: {
    eyebrow: "Contact",
    title: "Get in touch with CarGoKe",
    intro: "Choose the right path for your question. Public enquiries and authenticated platform activity are handled separately.",
    sections: [
      { title: "Transport request", body: "Create an account to submit a vehicle transport request, receive provider quotes and manage the resulting trip workflow." },
      { title: "Account or trip support", body: "Sign in to access the support and dispute options provided for your account and trips." },
      { title: "Business enquiry", body: "For recurring or business transport questions, use the business contact option if an address is shown below. A public enquiry address has not been configured in this environment." },
    ],
    cta: { label: "Visit business information", to: "/business" },
  },
  privacy: {
    eyebrow: "Legal information",
    title: "Privacy",
    intro: "CarGoKe uses account and transport-request information to operate the marketplace and its trip workflows.",
    sections: [
      { title: "Information used by the platform", body: "The application processes account details, vehicle and route information, trip status, inspection evidence and related operational records needed for its workflows." },
      { title: "Access and visibility", body: "Access to authenticated platform information is controlled by account and role permissions. Do not include sensitive personal information in public-facing request notes." },
      { title: "Questions", body: "For account-specific privacy questions, sign in and use the support options available to your account. This page is a product summary, not a substitute for a reviewed legal privacy notice." },
    ],
    cta: { label: "Contact and support options", to: "/contact" },
  },
  terms: {
    eyebrow: "Legal information",
    title: "Terms of use",
    intro: "Use of CarGoKe is subject to account access, the request and trip workflows, and applicable platform rules.",
    sections: [
      { title: "Marketplace role", body: "CarGoKe provides a digital workflow for customers and independent transport providers to exchange requests and quotes and manage trip records." },
      { title: "Accurate information", body: "Users should provide accurate vehicle and location details and use only accounts and workflows they are authorised to access." },
      { title: "Payments and trips", body: "Follow the instructions and status information shown within the authenticated platform. This summary does not replace reviewed, binding platform terms." },
      { title: "Questions", body: "For questions about a specific account or trip, sign in and use available support options." },
    ],
    cta: { label: "Visit support", to: "/support" },
  },
};

export default function PublicInfoPage({ pageKey }: { pageKey: string }) {
  const page = pageKey;
  const content = pages[page];

  if (!content) return <section className="public-info-page"><h1>Page not found</h1></section>;
  const publicContactEmail = import.meta.env.VITE_PUBLIC_CONTACT_EMAIL?.trim();

  return (
    <section className="public-info-page">
      <div className="public-info-hero">
        <span className="public-eyebrow">{content.eyebrow}</span>
        <h1>{content.title}</h1>
        <p>{content.intro}</p>
      </div>
      <div className="public-info-body">
        {content.sections.map((section, index) => (
          <article className="public-info-row" key={section.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div><h2>{section.title}</h2><p>{section.body}</p></div>
          </article>
        ))}
        {page === "business" || page === "contact" ? (
          <div className="public-contact-option">
            <span className="public-eyebrow">Public business enquiry</span>
            {publicContactEmail ? (
              <>
                <p>Use the configured public contact address for a business enquiry. Do not send account credentials.</p>
                <a className="public-cta" href={`mailto:${encodeURIComponent(publicContactEmail)}`}>Email the CarGoKe team <span aria-hidden="true">↗</span></a>
              </>
            ) : (
              <p>No public enquiry address is configured for this environment. You can still create an account to access the platform request workflow.</p>
            )}
          </div>
        ) : null}
        {content.cta ? <Link className="public-cta public-info-cta" to={content.cta.to}>{content.cta.label} <span aria-hidden="true">↗</span></Link> : null}
      </div>
    </section>
  );
}
