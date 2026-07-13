import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserProfile } from "@/types/ecommerce";
import { getApiBaseUrl } from "@/lib/api/api-config";

const AUTH_STORAGE_KEY = "luma-auth";
const AUTH_ACCESS_TOKEN_STORAGE_KEY = "luma-auth-access-token";
const AUTH_REFRESH_TOKEN_STORAGE_KEY = "luma-auth-refresh-token";
const USERS_STORAGE_KEY = "luma-users";
const API_BASE_URL = getApiBaseUrl();
const LOGIN_ENDPOINT = `${API_BASE_URL}/v1/auth/login/`;
const LOGOUT_ENDPOINT = `${API_BASE_URL}/v1/auth/logout/`;
const REGISTER_ENDPOINT = `${API_BASE_URL}/v1/auth/register/`;

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  isAuthenticated: boolean;
}

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function removeStorage(key: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(key);
}

function clearAuthStorage() {
  removeStorage(AUTH_STORAGE_KEY);
  removeStorage(AUTH_ACCESS_TOKEN_STORAGE_KEY);
  removeStorage(AUTH_REFRESH_TOKEN_STORAGE_KEY);
}

function persistAuth(profile: UserProfile, tokens?: { accessToken?: string | null; refreshToken?: string | null }) {
  writeStorage(AUTH_STORAGE_KEY, { user: profile });

  if (tokens?.accessToken) {
    writeStorage(AUTH_ACCESS_TOKEN_STORAGE_KEY, tokens.accessToken);
  } else {
    removeStorage(AUTH_ACCESS_TOKEN_STORAGE_KEY);
  }

  if (tokens?.refreshToken) {
    writeStorage(AUTH_REFRESH_TOKEN_STORAGE_KEY, tokens.refreshToken);
  } else {
    removeStorage(AUTH_REFRESH_TOKEN_STORAGE_KEY);
  }
}

function normalizeLoginPayload(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const root = payload as Record<string, unknown>;
  const rootUser = root.user;
  const responseData = root.data;

  if (rootUser && typeof rootUser === "object") {
    return rootUser as Record<string, unknown>;
  }

  if (responseData && typeof responseData === "object") {
    const nested = responseData as Record<string, unknown>;
    if (nested.user && typeof nested.user === "object") {
      return nested.user as Record<string, unknown>;
    }

    return nested as Record<string, unknown>;
  }

  return root;
}

function extractStringValue(source: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return null;
}

function extractTokens(payload: unknown) {
  const root = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const responseData = root.data && typeof root.data === "object" ? (root.data as Record<string, unknown>) : {};
  const nestedTokens =
    root.tokens && typeof root.tokens === "object"
      ? (root.tokens as Record<string, unknown>)
      : responseData.tokens && typeof responseData.tokens === "object"
        ? (responseData.tokens as Record<string, unknown>)
        : {};

  const accessToken = extractStringValue({ ...root, ...responseData, ...nestedTokens }, ["accessToken", "access_token", "access", "token"]);
  const refreshToken = extractStringValue({ ...root, ...responseData, ...nestedTokens }, ["refreshToken", "refresh_token", "refresh"]);

  return { accessToken, refreshToken };
}

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "string" && error.trim()) {
    return error;
  }

  if (error && typeof error === "object") {
    const payload = error as Record<string, unknown>;

    if (typeof payload.message === "string" && payload.message.trim()) {
      return payload.message;
    }

    if (typeof payload.detail === "string" && payload.detail.trim()) {
      return payload.detail;
    }

    const errorKeys = ["non_field_errors", "errors", "detail", "message"];
    for (const key of errorKeys) {
      const value = payload[key];
      if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") {
        return value[0];
      }
      if (typeof value === "string" && value.trim()) {
        return value;
      }
    }

    for (const value of Object.values(payload)) {
      if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") {
        return value[0];
      }
      if (typeof value === "string" && value.trim()) {
        return value;
      }
    }

    try {
      return JSON.stringify(payload);
    } catch {
      return fallback;
    }
  }

  return fallback;
}

function loadPersistedAuth(): Partial<AuthState> {
  const saved = readStorage<{ user: UserProfile | null } | null>(AUTH_STORAGE_KEY, null);
  const accessToken = readStorage<string | null>(AUTH_ACCESS_TOKEN_STORAGE_KEY, null);
  const refreshToken = readStorage<string | null>(AUTH_REFRESH_TOKEN_STORAGE_KEY, null);

  if (!saved?.user) {
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      status: "idle",
      error: null,
    };
  }

  return {
    user: saved.user,
    accessToken,
    refreshToken,
    isAuthenticated: true,
    status: "succeeded" as const,
    error: null,
  };
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  status: "idle",
  error: null,
  isAuthenticated: false,
  ...loadPersistedAuth(),
};

interface LoginResponse {
  user: UserProfile;
  accessToken: string | null;
  refreshToken: string | null;
}

function splitName(name: string) {
  const parts = name.trim().split(" ");
  return {
    first_name: parts.shift() ?? "",
    last_name: parts.join(" "),
  };
}

export const loginUser = createAsyncThunk<LoginResponse, { email: string; password: string }>(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(LOGIN_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.message || "Invalid email or password.");
      }

      const normalizedUser = normalizeLoginPayload(payload);
      if (!normalizedUser) {
        throw new Error("The server did not return a valid user profile.");
      }

      const stringId =
        typeof normalizedUser.id === "string"
          ? normalizedUser.id
          : typeof normalizedUser.id === "number"
            ? String(normalizedUser.id)
            : `user-${Date.now()}`;

      const firstName = typeof normalizedUser.first_name === "string"
        ? normalizedUser.first_name
        : typeof normalizedUser.firstName === "string"
          ? normalizedUser.firstName
          : undefined;

      const lastName = typeof normalizedUser.last_name === "string"
        ? normalizedUser.last_name
        : typeof normalizedUser.lastName === "string"
          ? normalizedUser.lastName
          : undefined;

      const name =
        [firstName, lastName].filter(Boolean).join(" ") ||
        (typeof normalizedUser.name === "string" ? normalizedUser.name : undefined) ||
        (typeof normalizedUser.fullName === "string" ? normalizedUser.fullName : undefined) ||
        email.split("@")[0];

      const profile: UserProfile = {
        id: stringId,
        name,
        email: typeof normalizedUser.email === "string" ? normalizedUser.email : email,
        plan: typeof normalizedUser.plan === "string" ? normalizedUser.plan : "Student",
        joined:
          typeof normalizedUser.joined === "string"
            ? normalizedUser.joined
            : typeof normalizedUser.created_at === "string"
              ? normalizedUser.created_at
              : new Date().toISOString().slice(0, 10),
        role:
          normalizedUser.role === "vendor"
            ? "vendor"
            : normalizedUser.role === "admin"
              ? "admin"
              : "customer",
        avatarUrl:
          typeof normalizedUser.avatarUrl === "string"
            ? normalizedUser.avatarUrl
            : typeof normalizedUser.avatar_url === "string"
              ? normalizedUser.avatar_url
              : undefined,
      };

      const { accessToken, refreshToken } = extractTokens(payload);
      persistAuth(profile, { accessToken, refreshToken });
      return { user: profile, accessToken, refreshToken };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Unable to sign in.");
    }
  },
);

export const logoutUser = createAsyncThunk<void, void>(
  "auth/logoutUser",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { auth: AuthState };
    const headers: HeadersInit = { Accept: "application/json" };

    if (state.auth.accessToken) {
      headers.Authorization = `Bearer ${state.auth.accessToken}`;
    }

    try {
      const response = await fetch(LOGOUT_ENDPOINT, {
        method: "POST",
        headers,
        body: JSON.stringify({ refreshToken: state.auth.refreshToken }),
      });

      if (!response.ok && response.status !== 401 && response.status !== 403) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.message || "Unable to sign out.");
      }
    } catch (error) {
      clearAuthStorage();
      return rejectWithValue(error instanceof Error ? error.message : "Unable to sign out.");
    }

    clearAuthStorage();
    return;
  },
);

export const registerUser = createAsyncThunk<LoginResponse, { name: string; email: string; password: string; role?: "customer" | "vendor" }>(
  "auth/registerUser",
  async ({ name, email, password, role = "customer" }, { rejectWithValue }) => {
    try {
      const { first_name, last_name } = splitName(name);
      const response = await fetch(REGISTER_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          password2: password,
          first_name,
          last_name,
          role,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = getErrorMessage(payload, "Unable to create account.");
        throw new Error(message);
      }

      const normalizedUser = normalizeLoginPayload(payload);
      if (!normalizedUser) {
        throw new Error("The server did not return a valid user profile.");
      }

      const stringId =
        typeof normalizedUser.id === "string"
          ? normalizedUser.id
          : typeof normalizedUser.id === "number"
            ? String(normalizedUser.id)
            : `user-${Date.now()}`;

      const firstName = typeof normalizedUser.first_name === "string"
        ? normalizedUser.first_name
        : typeof normalizedUser.firstName === "string"
          ? normalizedUser.firstName
          : undefined;

      const lastName = typeof normalizedUser.last_name === "string"
        ? normalizedUser.last_name
        : typeof normalizedUser.lastName === "string"
          ? normalizedUser.lastName
          : undefined;

      const nameValue =
        [firstName, lastName].filter(Boolean).join(" ") ||
        (typeof normalizedUser.name === "string" ? normalizedUser.name : undefined) ||
        (typeof normalizedUser.fullName === "string" ? normalizedUser.fullName : undefined) ||
        email.split("@")[0];

      const profile: UserProfile = {
        id: stringId,
        name: nameValue,
        email: typeof normalizedUser.email === "string" ? normalizedUser.email : email,
        plan: typeof normalizedUser.plan === "string" ? normalizedUser.plan : (role === "vendor" ? "Vendor Pro" : "Student"),
        joined:
          typeof normalizedUser.joined === "string"
            ? normalizedUser.joined
            : typeof normalizedUser.created_at === "string"
              ? normalizedUser.created_at
              : new Date().toISOString().slice(0, 10),
        role:
          normalizedUser.role === "vendor"
            ? "vendor"
            : normalizedUser.role === "admin"
              ? "admin"
              : "customer",
        avatarUrl:
          typeof normalizedUser.avatarUrl === "string"
            ? normalizedUser.avatarUrl
            : typeof normalizedUser.avatar_url === "string"
              ? normalizedUser.avatar_url
              : undefined,
      };

      const { accessToken, refreshToken } = extractTokens(payload);
      persistAuth(profile, { accessToken, refreshToken });
      return { user: profile, accessToken, refreshToken };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Unable to create account.");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthSession: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
      clearAuthStorage();
    },
    hydrateAuth: (state) => {
      const persisted = readStorage<{ user: UserProfile | null } | null>(AUTH_STORAGE_KEY, null);
      const accessToken = readStorage<string | null>(AUTH_ACCESS_TOKEN_STORAGE_KEY, null);
      const refreshToken = readStorage<string | null>(AUTH_REFRESH_TOKEN_STORAGE_KEY, null);

      if (persisted?.user) {
        state.user = persisted.user;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.isAuthenticated = true;
        state.status = "succeeded";
        state.error = null;
        return;
      }

      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
    },
    updateAuthTokens: (state, action: PayloadAction<{ accessToken?: string | null; refreshToken?: string | null }>) => {
      const { accessToken, refreshToken } = action.payload;

      if (accessToken !== undefined) {
        state.accessToken = accessToken;
        if (accessToken) {
          writeStorage(AUTH_ACCESS_TOKEN_STORAGE_KEY, accessToken);
        } else {
          removeStorage(AUTH_ACCESS_TOKEN_STORAGE_KEY);
        }
      }

      if (refreshToken !== undefined) {
        state.refreshToken = refreshToken;
        if (refreshToken) {
          writeStorage(AUTH_REFRESH_TOKEN_STORAGE_KEY, refreshToken);
        } else {
          removeStorage(AUTH_REFRESH_TOKEN_STORAGE_KEY);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = typeof action.payload === "string" ? action.payload : "Unable to sign in.";
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.status = "idle";
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.status = "failed";
        state.error = typeof action.payload === "string" ? action.payload : "Unable to sign out.";
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = typeof action.payload === "string" ? action.payload : "Unable to create account.";
      });
  },
});

export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectAccessToken = (state: { auth: AuthState }) => state.auth.accessToken;
export const selectRefreshToken = (state: { auth: AuthState }) => state.auth.refreshToken;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;

export const { clearAuthSession, hydrateAuth, updateAuthTokens } = authSlice.actions;
export default authSlice.reducer;
