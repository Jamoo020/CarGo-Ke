import { FormEvent, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AuthForm from "../components/auth/AuthForm";
import { ApiError } from "../types/auth";
import PasswordField from "../components/auth/PasswordField";
import { getDashboardPathForRole } from "../lib/roleAccess";

export default function LoginPage() {
  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const registrationSuccess = Boolean((location.state as { registrationSuccess?: boolean } | null)?.registrationSuccess);

  if (isAuthenticated && user) {
    return <Navigate to={getDashboardPathForRole(user.role)} replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setEmailError("");
    setPasswordError("");

    let isValid = true;
    if (!email.trim()) {
      setEmailError("Enter the email address used for your account.");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Enter a valid email address.");
      isValid = false;
    }
    if (!password) {
      setPasswordError("Enter your password.");
      isValid = false;
    }
    if (!isValid) {
      return;
    }

    setIsSubmitting(true);
    try {
      const nextUser = await login(email.trim(), password);
      const destination = getDashboardPathForRole(nextUser?.role);
      navigate(destination, { replace: true });
    } catch (caughtError) {
      const apiError = caughtError as ApiError;
      setError(apiError?.error ?? "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthForm
      title="Login"
      subtitle="Welcome back. Log in to continue to your CarGoKe account."
      onSubmit={handleSubmit}
      submitLabel="Log in"
      isLoading={isSubmitting}
      error={error}
      success={registrationSuccess ? "Your account was created. Log in with your new details." : null}
      footer={<>New to CarGoKe? <Link className="auth-inline-link" to="/register">Create an account</Link></>}
    >
      <div className={`auth-field${emailError ? " has-error" : ""}`}>
        <label htmlFor="login-email">Email address</label>
        <input
          id="login-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? "login-email-error" : undefined}
          required
        />
        {emailError ? <p className="auth-field-error" id="login-email-error">{emailError}</p> : null}
      </div>
      <PasswordField
        id="login-password"
        label="Password"
        autoComplete="current-password"
        value={password}
        onChange={setPassword}
        error={passwordError}
      />
      <div className="auth-form-options">
        <span aria-hidden="true" />
        <Link to="/forgot-password">Forgot password?</Link>
      </div>
    </AuthForm>
  );
}
