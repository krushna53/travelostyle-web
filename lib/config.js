export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(
  /\/+$/,
  "",
);

// Base for fetches that may run in the BROWSER. There the backend can't be
// called directly (untrusted local certificate, no CORS headers), so requests
// go through the same-origin /drupal-api proxy in next.config. On the server
// the real URL is used as before.
export const API_CLIENT_BASE =
  typeof window === "undefined" ? API_BASE_URL : "/drupal-api";

// Safely joins the API base with a Drupal-provided file path, avoiding the
// double-slash bug that breaks next/image's remotePatterns matching.
export function buildFileUrl(rawUrl) {
  if (!rawUrl) return null;
  const decoded = decodeURIComponent(rawUrl).replace(/^\/+/, "/");
  return `${API_BASE_URL}${decoded}`;
}