export type UserRole = "ADMIN" | "CUSTOMER" | "DRIVER" | "AUTHORIZED_REPRESENTATIVE";

export type AccountStatus = "ACTIVE" | "SUSPENDED" | "DEACTIVATED";

export interface User {
  id: string;
  email: string;
  fullName: string | null;
  role: UserRole;
  accountStatus: AccountStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: {
    token: string;
    user: User;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName?: string;
  role: UserRole;
}

export interface RegisterResponse {
  data: User;
}

export interface ApiError {
  error: string;
  status?: string;
  details?: unknown;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
