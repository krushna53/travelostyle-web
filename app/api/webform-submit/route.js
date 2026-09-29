import { API_BASE_URL } from "@/lib/config";

// Same-origin write proxy to Drupal for webform submissions made FROM THE
// BROWSER.
//
// Client components can't call the backend directly: Drupal sends no
// Access-Control-Allow-Origin header, so the browser blocks the response
// (or the CSRF-token redirect that a trailing slash in the base URL can
// trigger) before the calling code ever sees it. This handler does the
// CSRF-token fetch and the authenticated submit from the Next.js server
// instead, which isn't subject to CORS, and just forwards Drupal's
// response/status back to the client.
//
// Every form posts its own Drupal-shaped payload (webform_id + fields)
// straight through as the request body — this route doesn't know or care
// about individual webforms.
export async function POST(request) {
  const payload = await request.json();

  try {
    const csrfRes = await fetch(`${API_BASE_URL}/session/token`, {
      cache: "no-store",
    });

    if (!csrfRes.ok) {
      return Response.json(
        { message: "Failed to fetch CSRF token" },
        { status: 502 },
      );
    }

    const csrfToken = await csrfRes.text();

    const credentials = Buffer.from(
      `${process.env.NEXT_PUBLIC_DRUPAL_USER}:${process.env.NEXT_PUBLIC_DRUPAL_PASS}`,
    ).toString("base64");

    const upstream = await fetch(`${API_BASE_URL}/webform_rest/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${credentials}`,
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify(payload),
    });

    const data = await upstream.json();
    return Response.json(data, { status: upstream.status });
  } catch (err) {
    console.error("Webform submit proxy failed:", err);
    return Response.json(
      { message: "Unable to submit the form. Please try again." },
      { status: 502 },
    );
  }
}
