import { FormEvent, ReactNode } from "react";

interface AuthFormProps {
  title: string;
  subtitle?: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  submitLabel: string;
  isLoading?: boolean;
  error?: string | null;
}

export default function AuthForm({ title, subtitle, onSubmit, children, submitLabel, isLoading = false, error }: AuthFormProps) {
  return (
    <section className="screen-card auth-card">
      <h1>{title}</h1>
      {subtitle ? <p className="auth-subtitle">{subtitle}</p> : null}
      {error ? <div className="error-box">{error}</div> : null}
      <form onSubmit={onSubmit} className="auth-form">
        {children}
        <button type="submit" className="primary-button" disabled={isLoading}>
          {isLoading ? "Please wait..." : submitLabel}
        </button>
      </form>
    </section>
  );
}
