import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/auth/AuthForm";
import { register } from "../lib/auth";
import { ApiError, UserRole } from "../types/auth";

const allowedRoles: UserRole[] = ["CUSTOMER", "DRIVER"];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("CUSTOMER");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
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
      navigate("/login", { replace: true });
    } catch (caughtError) {
      const apiError = caughtError as ApiError;
      setError(apiError?.error ?? "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthForm title="Register" subtitle="Create a new CarGo Kenya account" onSubmit={handleSubmit} submitLabel="Register" isLoading={isSubmitting} error={error}>
      <label>
        <span>Full name</span>
        <input type="text" value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" />
      </label>
      <label>
        <span>Email</span>
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
      </label>
      <label>
        <span>Password</span>
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" />
      </label>
      <label>
        <span>Role</span>
        <select value={role} onChange={(event) => setRole(event.target.value as UserRole)}>
          {allowedRoles.map((entry) => (
            <option key={entry} value={entry}>{entry}</option>
          ))}
        </select>
      </label>
    </AuthForm>
  );
}
