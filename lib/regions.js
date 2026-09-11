import { API_BASE_URL, buildFileUrl } from "@/lib/config";

// Fetches every region taxonomy term for the Destinations page. Server-side
// (called from app/destination/page.jsx) so it goes through Node's fetch —
// which honors NODE_TLS_REJECT_UNAUTHORIZED for the ddev backend's
// self-signed cert — instead of the browser's fetch, which was failing
// every load with ERR_CERT_AUTHORITY_INVALID.
export async function getRegions() {
  const res = await fetch(
    `${API_BASE_URL}/jsonapi/taxonomy_term/region?sort=-drupal_internal__tid&include=field_region_image.field_media_image`,
    { cache: "no-store" },
  );
  const json = await res.json();
  const included = json.included || [];

  return (json.data || []).map((item) => {
    const mediaId = item.relationships?.field_region_image?.data?.id;
    const mediaEntity = included.find(
      (inc) => inc.type === "media--image" && inc.id === mediaId,
    );
    const fileId = mediaEntity?.relationships?.field_media_image?.data?.id;
    const fileEntity = included.find((inc) => inc.type === "file--file" && inc.id === fileId);
    const image = buildFileUrl(fileEntity?.attributes?.uri?.url) || "/placeholder-image.svg";

    return {
      id: item.id,
      name: item.attributes?.name || "",
      description:
        item.attributes?.description?.processed || item.attributes?.description?.value || "",
      image,
    };
  });
}
