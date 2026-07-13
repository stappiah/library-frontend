/**
 * Merges Tailwind classes safely
 */
export function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(" ");
}

/**
 * Simple input sanitization for search
 */
export const sanitizeInput = (input: string) => input.replace(/[<>]/g, "").trim();