import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import App from "../app/App";
import { clearToken } from "../lib/storage";

const { mockGetCurrentUser } = vi.hoisted(() => ({
  mockGetCurrentUser: vi.fn(),
}));

vi.mock("../lib/auth", async () => {
  const actual = await vi.importActual<typeof import("../lib/auth")>("../lib/auth");
  return {
    ...actual,
    getCurrentUser: (...args: Parameters<typeof actual.getCurrentUser>) => mockGetCurrentUser(...args),
  };
});

const publicPages = [
  ["/", "Moving vehicles."],
  ["/about", "About CarGoKe"],
  ["/services", "Vehicle transport services"],
  ["/routes", "Plan a route across Kenya"],
  ["/how-it-works", "How CarGoKe works"],
  ["/transporters", "Transport vehicles with CarGoKe"],
  ["/business", "Vehicle transport for business needs"],
  ["/support", "Help for your CarGoKe journey"],
  ["/contact", "Get in touch with CarGoKe"],
  ["/privacy", "Privacy"],
  ["/terms", "Terms of use"],
];

function renderApp(path = "/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  clearToken();
  localStorage.clear();
  mockGetCurrentUser.mockReset();
});

afterEach(() => cleanup());

describe("public corporate website", () => {
  it.each(publicPages)("renders the public page at %s", async (path, heading) => {
    renderApp(path);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent(new RegExp(heading, "i"));
    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeInTheDocument();
  });

  it("links the public request and login actions into the existing account flows", async () => {
    renderApp("/");
    const requestLinks = within(screen.getByRole("main")).getAllByRole("link", { name: /Request vehicle transport/i });
    expect(requestLinks.length).toBeGreaterThan(0);
    requestLinks.forEach((link) => expect(link).toHaveAttribute("href", "/register"));
    await userEvent.click(within(screen.getByRole("navigation", { name: "Main navigation" })).getByRole("link", { name: "Log in" }));
    expect(await screen.findByRole("heading", { name: "Login" })).toBeInTheDocument();
  });

  it("supports keyboard dismissal of the mobile navigation", async () => {
    const user = userEvent.setup();
    const { container } = renderApp("/");
    const menuButton = container.querySelector<HTMLButtonElement>(".public-menu-toggle");
    if (!menuButton) throw new Error("Mobile navigation toggle was not rendered");
    await user.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(menuButton).toHaveAttribute("aria-expanded", "false"));
  });

  it("exposes the password visibility control on login", async () => {
    const user = userEvent.setup();
    renderApp("/login");
    const passwordField = screen.getByLabelText("Password");
    expect(passwordField).toHaveAttribute("type", "password");
    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(passwordField).toHaveAttribute("type", "text");
    await user.click(screen.getByRole("button", { name: "Hide password" }));
    expect(passwordField).toHaveAttribute("type", "password");
  });

  it("links to account recovery and clearly reports that no reset email is sent", async () => {
    const user = userEvent.setup();
    renderApp("/login");
    await user.click(screen.getByRole("link", { name: "Forgot password?" }));
    expect(await screen.findByRole("heading", { name: "Forgot your password?" })).toBeInTheDocument();
    await user.type(screen.getByLabelText("Email address"), "customer@example.com");
    await user.click(screen.getByRole("button", { name: /Check recovery options/i }));
    expect(await screen.findByText(/No reset email was sent/i)).toBeInTheDocument();
  }, 15000);

  it("handles reset links without claiming an unsupported password change", async () => {
    renderApp("/reset-password?token=example-reset-token");
    expect(await screen.findByRole("heading", { name: "Reset link cannot be verified" })).toBeInTheDocument();
    expect(screen.getByText(/no password has been changed/i)).toBeInTheDocument();
  });

  it("provides public, keyboard-operable account help", async () => {
    const user = userEvent.setup();
    renderApp("/help");
    await user.click(screen.getByText("I cannot register"));
    expect(screen.getByText(/Customer and Transporter \(Driver\) accounts only/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to log in" })).toHaveAttribute("href", "/login");
  });

  it("keeps protected customer routes behind authentication", async () => {
    renderApp("/customer/requests");
    expect(await screen.findByRole("heading", { name: "Login" })).toBeInTheDocument();
  });

  it("shows an authenticated user's role-specific account link on the public homepage", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockGetCurrentUser.mockResolvedValue({
      data: {
        id: "customer-1",
        email: "customer@example.com",
        fullName: "Customer User",
        role: "CUSTOMER",
        accountStatus: "ACTIVE",
        createdAt: "2026-10-13T00:00:00.000Z",
        updatedAt: "2026-10-13T00:00:00.000Z",
      },
    });
    renderApp("/");

    expect(await screen.findByText(/Welcome back, Customer User/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go to your account" })).toHaveAttribute("href", "/customer");
  });
});
