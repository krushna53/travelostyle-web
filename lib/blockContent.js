import { API_BASE_URL, buildFileUrl } from "@/lib/config";

// Fetches a singleton block_content bundle (one instance expected) with its
// `included` entities, following the same convention as the existing
// find_your_fit / travelostyle_promise blocks.
export async function getBlock(bundle, include, options = {}) {
  const { filter, revalidate = 3600, sort = "-changed" } = options;

  const params = new URLSearchParams();
  if (include) params.set("include", include);
  if (filter) {
    for (const [key, value] of Object.entries(filter)) {
      params.set(`filter[${key}]`, value);
    }
  }
  // When more than one block matches the filter (e.g. a leftover/duplicate
  // entry), always prefer the most recently edited one rather than
  // whatever order the API happens to return.
  if (sort) params.set("sort", sort);

  const res = await fetch(
    `${API_BASE_URL}/jsonapi/block_content/${bundle}?${params.toString()}`,
    { next: { revalidate } },
  );

  if (!res.ok) {
    console.error(`Failed to fetch ${bundle} block`);
    return null;
  }

  const { data = [], included = [] } = await res.json();
  return { block: data[0] || null, included };
}

// Resolves a media--image relationship (via an intermediate media entity)
// down to a usable file URL, matching resolveIcon/resolveImage from the
// existing find_your_fit / travelostyle_promise blocks.
export function resolveMediaImage(entity, included, fieldName, fallback = null) {
  const mediaId = entity.relationships?.[fieldName]?.data?.id;
  const media = included.find((i) => i.type === "media--image" && i.id === mediaId);
  const fileId = media?.relationships?.field_media_image?.data?.id;
  const file = included.find((i) => i.type === "file--file" && i.id === fileId);
  const raw = file?.attributes?.uri?.url;

  return buildFileUrl(raw) || fallback;
}

// Resolves an entity-reference-revisions relationship (paragraphs) into an
// ordered array of the referenced `included` entities, preserving the order
// given by the relationship's `data` array.
export function resolveRefs(entity, included, fieldName) {
  const refs = entity.relationships?.[fieldName]?.data || [];
  return refs
    .map((ref) => included.find((i) => i.id === ref.id))
    .filter(Boolean);
}

// Resolves a Drupal Link field's `uri` into something usable as an <a href>.
// Drupal stores internal paths as "internal:/some-path" and the frontpage
// as "internal:/" or "route:<front>" — none of which are valid hrefs as-is.
// External links (https://...) and mailto:/tel: pass through unchanged.
export function resolveLinkUrl(uri, fallback = "#") {
  if (!uri) return fallback;
  if (uri.startsWith("internal:")) {
    const path = uri.replace(/^internal:/, "");
    return path === "/" || path === "" ? fallback : path;
  }
  if (uri.startsWith("route:<front>")) return "/";
  if (uri.startsWith("entity:")) return fallback;
  return uri;
}
