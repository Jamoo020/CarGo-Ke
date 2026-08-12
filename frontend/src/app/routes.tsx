import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProtectedRoute from "../components/guard/ProtectedRoute";
import RoleRoute from "../components/guard/RoleRoute";
import PlaceholderScreen from "../pages/PlaceholderScreen";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import UsersPage from "../pages/admin/UsersPage";
import UserDetailPage from "../pages/admin/UserDetailPage";
import DriversPage from "../pages/admin/DriversPage";
import DriverDetailPage from "../pages/admin/DriverDetailPage";
import TripsPage from "../pages/admin/TripsPage";
import TripDetailPage from "../pages/admin/TripDetailPage";
import PaymentsPage from "../pages/admin/PaymentsPage";
import PaymentDetailPage from "../pages/admin/PaymentDetailPage";
import DisputesPage from "../pages/admin/DisputesPage";
import ConfigPage from "../pages/admin/ConfigPage";
import AuditLogsPage from "../pages/admin/AuditLogsPage";
import CustomerDashboardPage from "../pages/CustomerDashboardPage";
import CustomerRequestsPage from "../pages/CustomerRequestsPage";
import CreateTransportRequestPage from "../pages/CreateTransportRequestPage";
import TransportRequestDetailPage from "../pages/TransportRequestDetailPage";
import DriverDashboardPage from "../pages/DriverDashboardPage";
import DriverQuotesPage from "../pages/DriverQuotesPage";
import DriverTripsPage from "../pages/DriverTripsPage";
import DriverTripDetailPage from "../pages/DriverTripDetailPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/customer" element={<RoleRoute allowedRoles={["CUSTOMER", "AUTHORIZED_REPRESENTATIVE"]}><CustomerDashboardPage /></RoleRoute>} />
        <Route path="/customer/requests" element={<RoleRoute allowedRoles={["CUSTOMER", "AUTHORIZED_REPRESENTATIVE"]}><CustomerRequestsPage /></RoleRoute>} />
        <Route path="/customer/requests/new" element={<RoleRoute allowedRoles={["CUSTOMER", "AUTHORIZED_REPRESENTATIVE"]}><CreateTransportRequestPage /></RoleRoute>} />
        <Route path="/customer/requests/:requestId" element={<RoleRoute allowedRoles={["CUSTOMER", "AUTHORIZED_REPRESENTATIVE"]}><TransportRequestDetailPage /></RoleRoute>} />
        <Route path="/driver" element={<RoleRoute allowedRoles={["DRIVER"]}><DriverDashboardPage /></RoleRoute>} />
        <Route path="/driver/requests" element={<RoleRoute allowedRoles={["DRIVER"]}><DriverQuotesPage /></RoleRoute>} />
        <Route path="/driver/trips" element={<RoleRoute allowedRoles={["DRIVER"]}><DriverTripsPage /></RoleRoute>} />
        <Route path="/driver/trips/:tripId" element={<RoleRoute allowedRoles={["DRIVER"]}><DriverTripDetailPage /></RoleRoute>} />
        <Route path="/admin" element={<RoleRoute allowedRoles={["ADMIN"]}><AdminDashboardPage /></RoleRoute>} />
        <Route path="/admin/users" element={<RoleRoute allowedRoles={["ADMIN"]}><UsersPage /></RoleRoute>} />
        <Route path="/admin/users/:userId" element={<RoleRoute allowedRoles={["ADMIN"]}><UserDetailPage /></RoleRoute>} />
        <Route path="/admin/drivers" element={<RoleRoute allowedRoles={["ADMIN"]}><DriversPage /></RoleRoute>} />
        <Route path="/admin/drivers/:driverId" element={<RoleRoute allowedRoles={["ADMIN"]}><DriverDetailPage /></RoleRoute>} />
        <Route path="/admin/trips" element={<RoleRoute allowedRoles={["ADMIN"]}><TripsPage /></RoleRoute>} />
        <Route path="/admin/trips/:tripId" element={<RoleRoute allowedRoles={["ADMIN"]}><TripDetailPage /></RoleRoute>} />
        <Route path="/admin/payments" element={<RoleRoute allowedRoles={["ADMIN"]}><PaymentsPage /></RoleRoute>} />
        <Route path="/admin/payments/:paymentId" element={<RoleRoute allowedRoles={["ADMIN"]}><PaymentDetailPage /></RoleRoute>} />
        <Route path="/admin/disputes" element={<RoleRoute allowedRoles={["ADMIN"]}><DisputesPage /></RoleRoute>} />
        <Route path="/admin/config" element={<RoleRoute allowedRoles={["ADMIN"]}><ConfigPage /></RoleRoute>} />
        <Route path="/admin/audit-logs" element={<RoleRoute allowedRoles={["ADMIN"]}><AuditLogsPage /></RoleRoute>} />
      </Route>

      <Route path="/unauthorized" element={<PlaceholderScreen title="Unauthorized" message="You do not have access to the requested area." />} />
      <Route path="*" element={<PlaceholderScreen title="Page Not Found" message="The requested page could not be found." />} />
    </Routes>
  );
}
