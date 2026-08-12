import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AuthForm from "../components/auth/AuthForm";
import { ApiError } from "../types/auth";

function getDefaultRouteForRole(role: string | undefined) {
  if (role === "ADMIN") return "/admin";
  if (role === "DRIVER") return "/driver";
  return "/customer";
}

export default function LoginPage() {
  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated && user) {
    return <Navigate to={getDefaultRouteForRole(user.role)} replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const nextUser = await login(email.trim(), password);
      const destination = getDefaultRouteForRole(nextUser?.role);
      navigate(destination, { replace: true });
    } catch (caughtError) {
      const apiError = caughtError as ApiError;
      setError(apiError?.error ?? "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthForm title="Login" subtitle="Access your CarGo Kenya account" onSubmit={handleSubmit} submitLabel="Login" isLoading={isSubmitting} error={error}>
      <label>
        <span>Email</span>
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
      </label>
      <label>
        <span>Password</span>
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
      </label>
    </AuthForm>
  );
}
