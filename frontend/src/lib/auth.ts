import { apiGet, apiPost } from "./api";
import { clearToken, getStoredToken, storeToken } from "./storage";
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, User } from "../types/auth";

export async function login(payload: LoginRequest) {
  const response = await apiPost<LoginResponse>("/api/auth/login", payload);
  if (response.data?.token) {
    storeToken(response.data.token);
  }
  return response;
}

export async function logout() {
  clearToken();
}

export function getCurrentUser() {
  return apiGet<{ data: User }>("/api/auth/me");
}

export async function register(payload: RegisterRequest) {
  return apiPost<RegisterResponse>("/api/auth/register", payload);
}

export function hasStoredToken() {
  return Boolean(getStoredToken());
}
