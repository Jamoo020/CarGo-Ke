import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import AuthForm from "../components/auth/AuthForm";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    setNotice("Password recovery is not configured yet. No reset email was sent. Visit the Help Centre for available support options.");
  }

  return (
    <AuthForm
      title="Forgot your password?"
      subtitle="Enter the email address associated with your account to check the available recovery options."
      onSubmit={handleSubmit}
      submitLabel="Check recovery options"
      error={error || null}
      notice={notice || null}
      footer={<Link className="auth-inline-link" to="/login">Back to log in</Link>}
    >
      <div className="auth-field">
        <label htmlFor="recovery-email">Email address</label>
        <input
          id="recovery-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>
    </AuthForm>
  );
}
