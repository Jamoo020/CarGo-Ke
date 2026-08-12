import { UserRole } from "../types/auth";

export function getDashboardPathForRole(role?: UserRole | string) {
  if (role === "ADMIN") return "/admin";
  if (role === "DRIVER") return "/driver";
  return "/customer";
}

export function isCustomerRole(role?: UserRole | string) {
  return role === "CUSTOMER" || role === "AUTHORIZED_REPRESENTATIVE";
}

export function getRoleNavigationLinks(role?: UserRole | string) {
  if (role === "ADMIN") {
    return [
      { label: "Users", to: "/admin/users" },
      { label: "Drivers", to: "/admin/drivers" },
      { label: "Trips", to: "/admin/trips" },
      { label: "Payments", to: "/admin/payments" },
      { label: "Disputes", to: "/admin/disputes" },
      { label: "Configuration", to: "/admin/config" },
      { label: "Audit Logs", to: "/admin/audit-logs" },
    ];
  }

  if (role === "DRIVER") {
    return [
      { label: "Quote Requests", to: "/driver/requests" },
      { label: "Assigned Trips", to: "/driver/trips" },
    ];
  }

  return [
    { label: "My Requests", to: "/customer/requests" },
    { label: "New Request", to: "/customer/requests/new" },
  ];
}
