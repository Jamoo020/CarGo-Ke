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
      { label: "Dashboard", to: "/admin" },
      { label: "Users", to: "/admin/users" },
      { label: "Drivers", to: "/admin/drivers" },
      { label: "Trips", to: "/admin/trips" },
      { label: "Payments", to: "/admin/payments" },
      { label: "Audit Logs", to: "/admin/audit-logs" },
    ];
  }

  if (role === "DRIVER") {
    return [
      { label: "Home", to: "/driver" },
      { label: "Available Jobs", to: "/driver/requests" },
      { label: "Trips", to: "/driver/trips" },
      { label: "Wallet", to: "/driver/wallet" },
    ];
  }

  return [
    { label: "Home", to: "/customer" },
    { label: "Requests", to: "/customer/requests" },
    { label: "New Request", to: "/customer/requests/new" },
  ];
}
