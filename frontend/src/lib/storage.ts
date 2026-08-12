export const AUTH_TOKEN_KEY = "cargo_kenya_token";

export function getStoredToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function storeToken(token: string) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}
