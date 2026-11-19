import { Link } from "react-router-dom";

const contactEmail = import.meta.env.VITE_PUBLIC_CONTACT_EMAIL?.trim();

const helpTopics = [
  {
    question: "I cannot log in",
    answer: <>Check that you are using the email address registered to your account and that your password is entered correctly. If sign-in still fails, use the contact option below if one is configured. CarGoKe will display the API's sign-in error without changing your account.</>,
  },
  {
    question: "I forgot my password",
    answer: <>Password recovery is not available yet: the service has no reset endpoint or configured delivery channel. The forgot-password page will not send a message or change an account password.</>,
  },
  {
    question: "I cannot register",
    answer: <>Public registration currently supports Customer and Transporter (Driver) accounts only. Administrator and representative accounts cannot be created through public signup. Each email address can only be registered once.</>,
  },
  {
    question: "My account is suspended or awaiting approval",
    answer: <>Driver accounts can require administrator approval before they can submit quotes. If your account is suspended or you believe its status is incorrect, contact CarGoKe through the configured support channel. The Help Centre cannot change account status.</>,
  },
  {
    question: "I am not receiving a verification message",
    answer: <>The current application does not implement email or SMS account verification, so it does not send verification messages. Registration and sign-in use the existing email-and-password account flow.</>,
  },
];

export default function HelpCenterPage() {
  return (
    <section className="auth-help-page">
      <p className="auth-kicker"><span /> ACCOUNT SUPPORT</p>
      <h1>Help Centre</h1>
      <p>Answers for signing in, creating an account and getting help with account access.</p>
      <div className="auth-faq-list">
        {helpTopics.map((topic) => (
          <details key={topic.question}>
            <summary>{topic.question}</summary>
            <p>{topic.answer}</p>
          </details>
        ))}
      </div>
      <div className="auth-help-actions">
        {contactEmail ? (
          <a href={`mailto:${encodeURIComponent(contactEmail)}`}>Email CarGoKe support</a>
        ) : (
          <Link to="/contact">View contact options</Link>
        )}
        <Link to="/login">Back to log in</Link>
        <Link to="/register">Create an account</Link>
      </div>
    </section>
  );
}
