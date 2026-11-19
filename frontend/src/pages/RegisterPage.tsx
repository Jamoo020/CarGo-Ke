import { FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthForm from "../components/auth/AuthForm";
import { register } from "../lib/auth";
import { ApiError, UserRole } from "../types/auth";
import PasswordField from "../components/auth/PasswordField";

const allowedRoles: UserRole[] = ["CUSTOMER", "DRIVER"];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const initialRole = searchParams.get("role");
  const [role, setRole] = useState<UserRole>(
    initialRole === "DRIVER" ? "DRIVER" : "CUSTOMER",
  );
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setEmailError("");
    setPasswordError("");
    let isValid = true;
    if (!email.trim()) {
      setEmailError("Enter an email address.");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Enter a valid email address.");
      isValid = false;
    }
    if (!password) {
      setPasswordError("Create a password.");
      isValid = false;
    }
    if (!isValid) {
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        email: email.trim(),
        password,
        fullName: fullName.trim() || undefined,
        role,
      });
      navigate("/login", { replace: true, state: { registrationSuccess: true } });
    } catch (caughtError) {
      const apiError = caughtError as ApiError;
      setError(apiError?.error ?? "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthForm
      title="Create your account"
      subtitle="Choose how you’ll use the CarGoKe transport marketplace."
      onSubmit={handleSubmit}
      submitLabel="Create account"
      isLoading={isSubmitting}
      error={error}
      footer={<>Already registered? <Link className="auth-inline-link" to="/login">Log in</Link></>}
    >
      <div className="auth-role-field">
        <span className="auth-role-legend" id="register-role-label">Account type</span>
        <div className="auth-role-options" role="radiogroup" aria-labelledby="register-role-label">
          {allowedRoles.map((entry) => (
            <button
              key={entry}
              type="button"
              className="auth-role-choice"
              role="radio"
              aria-checked={role === entry}
              onClick={() => setRole(entry)}
              onKeyDown={(event) => {
                if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
                event.preventDefault();
                const choices = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
                if (!choices?.length) return;
                const selectedIndex = role === entry ? (entry === "CUSTOMER" ? 0 : 1) : 0;
                const nextIndex = (selectedIndex + (event.key === "ArrowRight" ? 1 : choices.length - 1)) % choices.length;
                choices[nextIndex].focus();
                choices[nextIndex].click();
              }}
            >
              <strong>{entry === "CUSTOMER" ? "Customer" : "Transporter"}</strong>
              <small>{entry === "CUSTOMER" ? "Request vehicle transport and review quotes." : "Find eligible requests and submit transport quotes."}</small>
            </button>
          ))}
        </div>
      </div>
      <div className="auth-field">
        <label htmlFor="register-full-name">Full name <span className="auth-optional">(optional)</span></label>
        <input id="register-full-name" name="fullName" type="text" value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" />
      </div>
      <div className={`auth-field${emailError ? " has-error" : ""}`}>
        <label htmlFor="register-email">Email address</label>
        <input
          id="register-email"
          name="email"
          type="email"
          inputMode="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? "register-email-error" : undefined}
          required
        />
        {emailError ? <p className="auth-field-error" id="register-email-error">{emailError}</p> : null}
      </div>
      <PasswordField
        id="register-password"
        label="Password"
        autoComplete="new-password"
        value={password}
        onChange={setPassword}
        error={passwordError}
      />
    </AuthForm>
  );
}
