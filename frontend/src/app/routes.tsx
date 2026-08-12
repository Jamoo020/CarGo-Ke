import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProtectedRoute from "../components/guard/ProtectedRoute";
import RoleRoute from "../components/guard/RoleRoute";
import PlaceholderScreen from "../pages/PlaceholderScreen";
import CustomerDashboardPage from "../pages/CustomerDashboardPage";
import CustomerRequestsPage from "../pages/CustomerRequestsPage";
import CreateTransportRequestPage from "../pages/CreateTransportRequestPage";
import TransportRequestDetailPage from "../pages/TransportRequestDetailPage";

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
        <Route path="/driver" element={<RoleRoute allowedRoles={["DRIVER"]}><PlaceholderScreen title="Driver Dashboard" /></RoleRoute>} />
        <Route path="/admin" element={<RoleRoute allowedRoles={["ADMIN"]}><PlaceholderScreen title="Admin Dashboard" /></RoleRoute>} />
      </Route>

      <Route path="/unauthorized" element={<PlaceholderScreen title="Unauthorized" message="You do not have access to the requested area." />} />
      <Route path="*" element={<PlaceholderScreen title="Page Not Found" message="The requested page could not be found." />} />
    </Routes>
  );
}
