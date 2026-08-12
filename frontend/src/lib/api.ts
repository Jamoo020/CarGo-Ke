import { ApiError } from "../types/auth";

const DEFAULT_API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

function normalizeUrl(path: string) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const base = DEFAULT_API_BASE_URL.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

function normalizeBody(body: unknown) {
  if (body === undefined || body === null) {
    return undefined;
  }

  if (typeof body === "string" || body instanceof FormData || body instanceof URLSearchParams) {
    return body;
  }

  return JSON.stringify(body);
}

export function getApiBaseUrl() {
  return DEFAULT_API_BASE_URL;
}

export async function apiRequest<T>(path: string, init: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = init;
  const token = localStorage.getItem("cargo_kenya_token");

  const requestHeaders = new Headers(headers ?? {});
  if (!requestHeaders.has("Content-Type") && body !== undefined && body !== null && !(body instanceof FormData)) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(normalizeUrl(path), {
    ...rest,
    body: normalizeBody(body),
    headers: requestHeaders,
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const errorPayload = payload as ApiError | null;
    const errorMessage = errorPayload?.error ?? "Request failed";
    const error: ApiError = {
      error: errorMessage,
      status: String(response.status),
      details: errorPayload?.details ?? payload ?? undefined,
    };
    throw error;
  }

  return (payload ?? null) as T;
}

export function apiGet<T>(path: string) {
  return apiRequest<T>(path, { method: "GET" });
}

export function apiPost<T>(path: string, body: unknown) {
  return apiRequest<T>(path, { method: "POST", body });
}

export function apiPatch<T>(path: string, body: unknown) {
  return apiRequest<T>(path, { method: "PATCH", body });
}
