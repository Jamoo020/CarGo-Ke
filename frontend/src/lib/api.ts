import { ApiError } from "../types/auth";

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
if (import.meta.env.PROD && !configuredApiBaseUrl) {
  throw new Error("VITE_API_BASE_URL must be set in production.");
}

const DEFAULT_API_BASE_URL = configuredApiBaseUrl || "http://localhost:4000";

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

export function getApiUrl(path: string) {
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

  const resolvedUrl = getApiUrl(path);
  // Temporary debug logging for transport-requests
  try {
    if (path.includes("transport-requests")) {
      // eslint-disable-next-line no-console
      console.debug("[DEBUG frontend] Fetching", resolvedUrl, "token present:", Boolean(token));
    }
  } catch (e) {
    // ignore
  }

  const response = await fetch(resolvedUrl, {
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

export async function apiGetBlob(path: string, signal?: AbortSignal): Promise<Blob> {
  const resolvedUrl = getApiUrl(path);
  if (new URL(resolvedUrl).origin !== new URL(getApiBaseUrl()).origin) {
    throw new Error("Protected image requests must use the configured API origin.");
  }

  const token = localStorage.getItem("cargo_kenya_token");
  const headers = new Headers();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(resolvedUrl, { method: "GET", headers, signal });
  if (!response.ok) {
    const responseText = await response.text();
    let errorMessage = `Request failed (${response.status})`;
    if (responseText) {
      try {
        const payload = JSON.parse(responseText) as ApiError;
        errorMessage = payload.error ?? errorMessage;
      } catch (error) {
        if (!(error instanceof SyntaxError)) {
          throw error;
        }
      }
    }
    throw new Error(errorMessage);
  }

  return response.blob();
}

export function apiPost<T>(path: string, body: unknown) {
  return apiRequest<T>(path, { method: "POST", body });
}

export function apiPatch<T>(path: string, body: unknown) {
  return apiRequest<T>(path, { method: "PATCH", body });
}
