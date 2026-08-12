import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getRoleNavigationLinks } from "../../lib/roleAccess";

export default function RoleNavigation() {
  const { user } = useAuth();
  const links = getRoleNavigationLinks(user?.role);

  return (
    <nav className="role-nav" aria-label="Role navigation">
      {links.map((link) => (
        <Link key={link.to} to={link.to}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
