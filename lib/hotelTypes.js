import { API_BASE_URL } from "@/lib/config";

// Fetches every term of the "Hotel Type" vocabulary (machine name
// hotel_type). These terms are the hotels picked per day / per stays tab via
// the paragraph field field_private_tailor_hotel, used only on Private and
// Tailor-made journeys.
//
// Why a separate fetch instead of adding to the journey `include`: the
// paragraph's relationship already carries the term id without any include,
// and adding include paths for a field that isn't on every paragraph bundle
// makes Drupal JSON:API reject the whole journey request (400). Fetching the
// vocabulary on its own keeps the journey page safe.
//
// Image fields on the term are discovered at runtime: any relationship that
// points at media--image (e.g. field_featured_image, field_gallery) is
// included with its file in a second request, so whatever image fields the
// vocabulary has show up on the Stays cards without hardcoding names.
async function fetchAllPages(url) {
  let nextUrl = url;
  let data = [];
  let included = [];
  while (nextUrl) {
    const res = await fetch(nextUrl, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`Hotel type request failed (${res.status})`);
    const json = await res.json();
    data = data.concat(json.data || []);
    included = included.concat(json.included || []);
    const nextHref = json.links?.next?.href || null;
    const idx = nextHref ? nextHref.indexOf("/jsonapi/") : -1;
    nextUrl = idx >= 0 ? `${API_BASE_URL}${nextHref.slice(idx)}` : null;
  }
  return { data, included };
}

export async function getHotelTypeTerms() {
  const base = `${API_BASE_URL}/jsonapi/taxonomy_term/hotel_type?filter[status][value]=1`;

  try {
    const plain = await fetchAllPages(base);

    const mediaFields = new Set();
    plain.data.forEach((term) => {
      Object.entries(term.relationships || {}).forEach(([key, rel]) => {
        const refs = Array.isArray(rel?.data) ? rel.data : rel?.data ? [rel.data] : [];
        if (refs.some((r) => r?.type === "media--image")) mediaFields.add(`${key}.field_media_image`);
        else if (refs.some((r) => r?.type === "file--file")) mediaFields.add(key);
      });
    });

    if (mediaFields.size === 0) return plain;

    const include = [...mediaFields].join(",");
    try {
      return await fetchAllPages(`${base}&include=${include}`);
    } catch {
      return plain;
    }
  } catch (err) {
    console.error("Failed to load hotel type terms", err);
    return { data: [], included: [] };
  }
}
