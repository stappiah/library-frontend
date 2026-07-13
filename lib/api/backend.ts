/*
 * Backend (Django) API client for the multivendor ecommerce.
 */

import {
  clearAuthStorage,
  readAccessToken,
  readRefreshToken,
  writeAccessToken,
} from "@/lib/api/auth-storage";
import { getApiBaseUrl } from "@/lib/api/api-config";
import { store } from "@/store/store";
import { clearAuthSession, updateAuthTokens } from "@/store/slices/authSlice";

export type ApiError = {
  message: string;
  status?: number;
  details?: unknown;
};

const REFRESH_TOKEN_PATH = "/token/refresh/";
const REFRESH_BODY_KEY = "refresh";
const ACCESS_TOKEN_KEYS = ["access", "accessToken", "access_token"];

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

function extractStringValue(source: unknown, keys: string[]) {
  if (!source || typeof source !== "object") return null;

  const record = source as Record<string, unknown>;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return null;
}

function buildUrl(path: string): URL {
  const urlBase = getApiBaseUrl();
  const normalizedPath = urlBase.endsWith("/api") && path.startsWith("/api/") ? path.slice(4) : path;
  return new URL(normalizedPath.startsWith("/") ? normalizedPath.slice(1) : normalizedPath, urlBase.endsWith("/") ? urlBase : urlBase + "/");
}

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = readRefreshToken();
    if (!refreshToken) {
      clearAuthStorage();
      throw { message: "Missing refresh token", status: 401 } as ApiError;
    }

    const url = buildUrl(REFRESH_TOKEN_PATH);
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ [REFRESH_BODY_KEY]: refreshToken }),
    });

    const text = await response.text();
    const parsed = text ? safeJsonParse(text) : undefined;

    if (!response.ok) {
      clearAuthStorage();
      store.dispatch(clearAuthSession());
      const message =
        (parsed && typeof parsed === "object" && "detail" in parsed && typeof (parsed as any).detail === "string" && (parsed as any).detail) ||
        (parsed && typeof parsed === "object" && "message" in parsed && typeof (parsed as any).message === "string" && (parsed as any).message) ||
        response.statusText ||
        "Unable to refresh access token.";
      throw { message, status: response.status, details: parsed } as ApiError;
    }

    if (!parsed || typeof parsed !== "object") {
      clearAuthStorage();
      throw { message: "Invalid refresh token response.", status: response.status, details: parsed } as ApiError;
    }

    const newAccessToken = extractStringValue(parsed, ACCESS_TOKEN_KEYS);
    if (!newAccessToken) {
      clearAuthStorage();
      store.dispatch(clearAuthSession());
      throw { message: "Refresh response did not include an access token.", status: response.status, details: parsed } as ApiError;
    }

    writeAccessToken(newAccessToken);
    store.dispatch(updateAuthTokens({ accessToken: newAccessToken }));
    return newAccessToken;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

function buildApiError(res: Response, parsed: unknown): ApiError {
  const message =
    (parsed && typeof parsed === "object" && "error" in parsed && typeof (parsed as any).error === "string" && (parsed as any).error) ||
    (parsed && typeof parsed === "object" && "message" in parsed && typeof (parsed as any).message === "string" && (parsed as any).message) ||
    res.statusText ||
    "Request failed";

  return { message, status: res.status, details: parsed };
}

async function performRequest<T>(opts: {
  path: string;
  method: string;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  accessToken?: string | null;
  signal?: AbortSignal;
}): Promise<T> {
  const { path, method, body, query, accessToken, signal } = opts;
  const url = buildUrl(path);

  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null) continue;
      url.searchParams.set(k, String(v));
    }
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  const isFormData = body instanceof FormData;
  if (body !== undefined && !isFormData) {
    headers["Content-Type"] = "application/json";
  }
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  const text = await res.text();
  const parsed = text ? safeJsonParse(text) : undefined;
  const errorDetails = parsed ?? (text ? text.slice(0, 2048) : undefined);

  if (!res.ok) {
    throw buildApiError(res, errorDetails);
  }

  if (parsed && typeof parsed === "object" && Array.isArray((parsed as any).results)) {
    return (parsed as any).results as T;
  }

  return parsed as T;
}

export async function apiFetch<T>(opts: {
  path: string;
  method?: string;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  accessToken?: string | null;
  signal?: AbortSignal;
}): Promise<T> {
  const { path, method = "GET", body, query, accessToken, signal } = opts;
  const token = accessToken ?? readAccessToken();

  try {
    return await performRequest<T>({ path, method, body, query, accessToken: token, signal });
  } catch (error) {
    const apiError = error as ApiError;
    if (apiError?.status === 401 || apiError?.status === 403) {
      const refreshToken = readRefreshToken();
      if (!refreshToken) {
        store.dispatch(clearAuthSession());
        throw apiError;
      }

      try {
        const newToken = await refreshAccessToken();
        return await performRequest<T>({ path, method, body, query, accessToken: newToken, signal });
      } catch {
        throw apiError;
      }
    }

    throw apiError;
  }
}



