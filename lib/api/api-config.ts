export const DEFAULT_API_BASE = "https://library-backend-a3sj.onrender.com/api";

export function getApiBaseUrl() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  const raw = base && base.trim().length > 0 ? base : DEFAULT_API_BASE;
  return raw.replace(/\/+$/, "");
}
