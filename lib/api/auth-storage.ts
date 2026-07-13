const AUTH_STORAGE_KEY = "luma-auth";
const AUTH_ACCESS_TOKEN_STORAGE_KEY = "luma-auth-access-token";
const AUTH_REFRESH_TOKEN_STORAGE_KEY = "luma-auth-refresh-token";

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function removeStorage(key: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(key);
}

export function clearAuthStorage() {
  removeStorage(AUTH_STORAGE_KEY);
  removeStorage(AUTH_ACCESS_TOKEN_STORAGE_KEY);
  removeStorage(AUTH_REFRESH_TOKEN_STORAGE_KEY);
}

export function readAccessToken(): string | null {
  return readStorage<string | null>(AUTH_ACCESS_TOKEN_STORAGE_KEY, null);
}

export function readRefreshToken(): string | null {
  return readStorage<string | null>(AUTH_REFRESH_TOKEN_STORAGE_KEY, null);
}

export function writeAccessToken(token: string | null) {
  if (token) {
    writeStorage(AUTH_ACCESS_TOKEN_STORAGE_KEY, token);
  } else {
    removeStorage(AUTH_ACCESS_TOKEN_STORAGE_KEY);
  }
}

export function writeRefreshToken(token: string | null) {
  if (token) {
    writeStorage(AUTH_REFRESH_TOKEN_STORAGE_KEY, token);
  } else {
    removeStorage(AUTH_REFRESH_TOKEN_STORAGE_KEY);
  }
}

