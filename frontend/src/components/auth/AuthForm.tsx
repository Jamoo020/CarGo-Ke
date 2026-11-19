import { FormEvent, ReactNode } from "react";

interface AuthFormProps {
  title: string;
  subtitle?: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  submitLabel: string;
  isLoading?: boolean;
  error?: string | null;
  success?: string | null;
  notice?: string | null;
  footer?: ReactNode;
}

export default function AuthForm({
  title,
  subtitle,
  onSubmit,
  children,
  submitLabel,
  isLoading = false,
  error,
  success,
  notice,
  footer,
}: AuthFormProps) {
  return (
    <section className="auth-card">
      <h1>{title}</h1>
      {subtitle ? <p className="auth-card-intro">{subtitle}</p> : null}
      {error ? <p className="auth-feedback error" role="alert">{error}</p> : null}
      {success ? <p className="auth-feedback success" role="status">{success}</p> : null}
      {notice ? <p className="auth-feedback notice" role="status">{notice}</p> : null}
      <form onSubmit={onSubmit} className="auth-form" noValidate>
        {children}
        <button type="submit" className="auth-primary-button" disabled={isLoading}>
          {isLoading ? <><span className="auth-spinner" aria-hidden="true" /> Please wait...</> : <>{submitLabel} <span aria-hidden="true">→</span></>}
        </button>
        {footer ? <div className="auth-form-footer">{footer}</div> : null}
      </form>
    </section>
  );
}
