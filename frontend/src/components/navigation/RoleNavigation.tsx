import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getRoleNavigationLinks } from "../../lib/roleAccess";

export default function RoleNavigation() {
  const { user } = useAuth();
  const links = getRoleNavigationLinks(user?.role);

  return (
    <nav className="role-nav" aria-label="Role navigation">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === "/customer" || link.to === "/driver" || link.to === "/admin"}
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          title={link.label}
          aria-label={link.label}
        >
          <span>{link.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
