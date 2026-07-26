export interface ClearExpiredSessionOptions {
  storage?: Pick<Storage, "removeItem">;
  dispatch?: () => void;
  redirectTo?: string;
  storageKeys?: string[];
}

const AUTH_STORAGE_KEYS = ["luma-auth", "luma-auth-access-token", "luma-auth-refresh-token"];

export function clearExpiredSession({
  storage,
  dispatch,
  redirectTo = "/login",
  storageKeys = AUTH_STORAGE_KEYS,
}: ClearExpiredSessionOptions = {}) {
  if (typeof window !== "undefined") {
    const targetStorage = storage ?? window.localStorage;

    if (targetStorage) {
      for (const key of storageKeys) {
        targetStorage.removeItem(key);
      }
    }

    if (typeof dispatch === "function") {
      dispatch();
    }

    if (redirectTo && typeof window.location?.assign === "function" && window.location.pathname !== redirectTo) {
      window.location.assign(redirectTo);
    }
  } else if (typeof dispatch === "function") {
    dispatch();
  }
}
