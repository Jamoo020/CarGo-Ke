import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { UserRole } from "../../types/auth";

interface RoleRouteProps {
  allowedRoles: UserRole[];
  children: ReactNode;
}

export default function RoleRoute({ allowedRoles, children }: RoleRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <section className="screen-card">
        <h1>Loading…</h1>
        <p>Resolving your access level.</p>
      </section>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
