import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import App from "../app/App";
import { AuthProvider } from "../app/providers/AuthProvider";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProtectedRoute from "../components/guard/ProtectedRoute";
import RoleRoute from "../components/guard/RoleRoute";
import { clearToken } from "../lib/storage";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockLogin = vi.fn();
const mockRegister = vi.fn();
const mockGetCurrentUser = vi.fn();

vi.mock("../lib/auth", async () => {
  const actual = await vi.importActual<typeof import("../lib/auth")>("../lib/auth");
  return {
    ...actual,
    login: (...args: Parameters<typeof actual.login>) => mockLogin(...args),
    register: (...args: Parameters<typeof actual.register>) => mockRegister(...args),
    getCurrentUser: (...args: Parameters<typeof actual.getCurrentUser>) => mockGetCurrentUser(...args),
  };
});

beforeEach(() => {
  clearToken();
  mockLogin.mockReset();
  mockRegister.mockReset();
  mockGetCurrentUser.mockReset();
  mockGetCurrentUser.mockResolvedValue({
    data: {
      id: "u1",
      email: "customer@example.com",
      fullName: "Customer User",
      role: "CUSTOMER",
      accountStatus: "ACTIVE",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    },
  });
  localStorage.clear();
});

describe("frontend auth flows", () => {
  it("successful login stores token and renders user state", async () => {
    mockLogin.mockResolvedValue({
      data: {
        token: "test-token",
        user: {
          id: "u1",
          email: "customer@example.com",
          fullName: "Customer User",
          role: "CUSTOMER",
          accountStatus: "ACTIVE",
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
      },
    });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/customer" element={<div>customer page</div>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );

    await userEvent.type(screen.getByLabelText(/email/i), "customer@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "Password123!");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(localStorage.getItem("cargo_kenya_token")).toBe("test-token");
    });
  });

  it("invalid login shows backend error", async () => {
    mockLogin.mockRejectedValue({ error: "Invalid credentials" });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );

    await userEvent.type(screen.getByLabelText(/email/i), "bad@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "wrongpassword");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  it("token storage persists and logout clears it", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockGetCurrentUser.mockResolvedValue({
      data: {
        id: "u1",
        email: "customer@example.com",
        fullName: "Customer User",
        role: "CUSTOMER",
        accountStatus: "ACTIVE",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    });

    render(
      <MemoryRouter initialEntries={['/customer']}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Customer Dashboard")).toBeInTheDocument();
    });

    const logoutButton = screen.getByRole("button", { name: /logout/i });
    await userEvent.click(logoutButton);
    expect(localStorage.getItem("cargo_kenya_token")).toBeNull();
  });

  it("/me success populates authenticated user", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockGetCurrentUser.mockResolvedValue({
      data: {
        id: "u1",
        email: "customer@example.com",
        fullName: "Customer User",
        role: "CUSTOMER",
        accountStatus: "ACTIVE",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    });

    render(
      <MemoryRouter initialEntries={['/customer']}>
        <AuthProvider>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/customer" element={<div>customer page</div>} />
            </Route>
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("customer page")).toBeInTheDocument();
    });
  });

  it("/me 401 clears token", async () => {
    localStorage.setItem("cargo_kenya_token", "expired-token");
    mockGetCurrentUser.mockRejectedValue({ status: "401", error: "Invalid or expired token" });

    render(
      <MemoryRouter initialEntries={['/customer']}>
        <AuthProvider>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/customer" element={<div>customer page</div>} />
            </Route>
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(localStorage.getItem("cargo_kenya_token")).toBeNull();
    });
  });

  it("protected route redirects unauthenticated users", async () => {
    render(
      <MemoryRouter initialEntries={['/customer']}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<div>login route</div>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/customer" element={<div>customer page</div>} />
            </Route>
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("login route")).toBeInTheDocument();
    });
  });

  it("customer cannot access admin role route", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockGetCurrentUser.mockResolvedValue({
      data: {
        id: "u1",
        email: "customer@example.com",
        fullName: "Customer User",
        role: "CUSTOMER",
        accountStatus: "ACTIVE",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AuthProvider>
          <Routes>
            <Route path="/unauthorized" element={<div>Unauthorized</div>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<RoleRoute allowedRoles={["ADMIN"]}><div>admin page</div></RoleRoute>} />
            </Route>
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Unauthorized")).toBeInTheDocument();
    });
  });

  it("admin can access admin role route", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockGetCurrentUser.mockResolvedValue({
      data: {
        id: "u1",
        email: "admin@example.com",
        fullName: "Admin User",
        role: "ADMIN",
        accountStatus: "ACTIVE",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AuthProvider>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<RoleRoute allowedRoles={["ADMIN"]}><div>admin page</div></RoleRoute>} />
            </Route>
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("admin page")).toBeInTheDocument();
    });
  });

  it("shows role-aware navigation for authenticated customers", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockGetCurrentUser.mockResolvedValue({
      data: {
        id: "u1",
        email: "customer@example.com",
        fullName: "Customer User",
        role: "CUSTOMER",
        accountStatus: "ACTIVE",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    });

    render(
      <MemoryRouter initialEntries={['/customer']}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Customer Dashboard")).toBeInTheDocument();
    });

    expect(screen.getByRole("link", { name: /view my requests/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /users/i })).not.toBeInTheDocument();
  });

  it("shows the unauthorized screen with a dashboard link for authenticated users", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockGetCurrentUser.mockResolvedValue({
      data: {
        id: "u1",
        email: "customer@example.com",
        fullName: "Customer User",
        role: "CUSTOMER",
        accountStatus: "ACTIVE",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    });

    render(
      <MemoryRouter initialEntries={['/unauthorized']}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/You are signed in as/i)).toBeInTheDocument();
    });

    expect(screen.getByRole("link", { name: /Back to Dashboard/i })).toHaveAttribute("href", "/customer");
  });

  it("registration behavior matches backend contract", async () => {
    mockRegister.mockResolvedValue({
      data: {
        id: "u1",
        email: "driver@example.com",
        fullName: "Driver User",
        role: "DRIVER",
        accountStatus: "ACTIVE",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    });

    render(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await userEvent.type(screen.getByLabelText(/full name/i), "Driver User");
    await userEvent.type(screen.getByLabelText(/email/i), "driver@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "Password123!");
    await userEvent.selectOptions(screen.getByLabelText(/role/i), "DRIVER");
    await userEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        email: "driver@example.com",
        password: "Password123!",
        fullName: "Driver User",
        role: "DRIVER",
      });
    });
  });

  it("suspended and deactivated account states are recognized", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockGetCurrentUser.mockResolvedValue({
      data: {
        id: "u1",
        email: "suspended@example.com",
        fullName: "Suspended User",
        role: "CUSTOMER",
        accountStatus: "SUSPENDED",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    });

    render(
      <MemoryRouter initialEntries={['/customer']}>
        <AuthProvider>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/customer" element={<RoleRoute allowedRoles={["CUSTOMER"]}><div>SUSPENDED</div></RoleRoute>} />
            </Route>
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("SUSPENDED")).toBeInTheDocument();
    });
  });
});
