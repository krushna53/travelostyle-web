import { API_BASE_URL } from "@/lib/config";

// Same-origin read proxy to Drupal for requests made FROM THE BROWSER.
//
// Client components can't call the backend directly: the local DDEV site's
// mkcert certificate isn't trusted by the browser, and Drupal sends no
// Access-Control-Allow-Origin header, so either one alone turns the request
// into "Failed to fetch". This handler makes the upstream call from the Next
// server instead, whose fetch honours NODE_TLS_REJECT_UNAUTHORIZED from .env.
// (A next.config rewrite can't do this: its proxy verifies certificates
// regardless of that variable and answers 500.)
//
// GET only -- it exists for JSON:API reads. Use API_CLIENT_BASE from
// lib/config to build URLs that work on both server and client.
export async function GET(request, { params }) {
  const { path } = await params;
  const { search } = new URL(request.url);
  const upstream = `${API_BASE_URL}/${path.map(encodeURIComponent).join("/")}${search}`;

  try {
    const res = await fetch(upstream, {
      cache: "no-store",
      headers: { Accept: request.headers.get("accept") || "application/vnd.api+json" },
    });
    return new Response(res.body, {
      status: res.status,
      headers: {
        "content-type": res.headers.get("content-type") || "application/json",
      },
    });
  } catch (err) {
    console.error("Drupal proxy request failed:", upstream, err);
    return Response.json({ error: "Upstream request failed" }, { status: 502 });
  }
}
