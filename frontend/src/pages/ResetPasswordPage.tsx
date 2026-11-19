import { Link, useSearchParams } from "react-router-dom";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const hasToken = Boolean(searchParams.get("token"));

  return (
    <section className="auth-card auth-unavailable">
      <h1>{hasToken ? "Reset link cannot be verified" : "Password reset unavailable"}</h1>
      <p className="auth-card-intro">
        {hasToken
          ? "CarGoKe does not currently have a password-reset service to verify or redeem this link. For your security, no password has been changed."
          : "Password reset is not currently available for CarGoKe accounts. No reset link can be issued yet."}
      </p>
      <div className="auth-feedback notice" role="status">
        Password recovery and reset endpoints are not configured. Do not share this link or your password with anyone.
      </div>
      <div className="auth-help-actions">
        <Link to="/login">Back to log in</Link>
        <Link to="/help">Visit the Help Centre</Link>
      </div>
    </section>
  );
}
