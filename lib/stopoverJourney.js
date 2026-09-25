import { API_BASE_URL, buildFileUrl } from "@/lib/config";

const INCLUDE = "field_image,field_location";

// Fetches every "Stopover Journey" node (machine name: stopover_journeys)
// and reduces them to the flat option shape used by the "Take your journey
// a little further" step of the Private Journey Inquiry form. Replaces the
// old hardcoded STOPOVER_OPTIONS list in components/PrivateInquiryForm/constants.js.
// `allowedIds` (optional): when passed, restricts the returned options to
// only the stopover_journeys nodes whose UUID is in the list — used so a
// specific journey's inquiry form only offers the stopovers configured for
// that journey in Drupal (field_stopover_journey), instead of every
// stopover journey node that exists. Omit/pass null for the old
// "show everything" behavior.
export async function getStopoverOptions(allowedIds = null) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/jsonapi/node/stopover_journeys?filter[status][value]=1&include=${INCLUDE}`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      console.error("Failed to fetch stopover_journeys collection");
      return [];
    }

    const { data = [], included = [] } = await res.json();

    const filteredData =
      Array.isArray(allowedIds) && allowedIds.length
        ? data.filter((item) => allowedIds.includes(item.id))
        : data;

    return filteredData.map((item) => {
      const fileId = item.relationships?.field_image?.data?.id;
      const fileEntity = included.find(
        (inc) => inc.type === "file--file" && inc.id === fileId,
      );
      const imageUrl =
        buildFileUrl(fileEntity?.attributes?.uri?.url) ||
        "/placeholder-image.svg";

      const locationId = item.relationships?.field_location?.data?.id;
      const locationEntity = included.find(
        (inc) => inc.id === locationId,
      );
      const locationName =
        locationEntity?.attributes?.title || item.attributes?.title || "";

      const days = Number(item.attributes?.field_days) || 0;
      const nights = Number(item.attributes?.field_nights) || 0;
      const duration = days
        ? `${days} Days, ${nights} Nights`
        : `${nights} Nights`;

      return {
        id: item.id,
        title: locationName,
        duration,
        price: Number(item.attributes?.field_price) || 0,
        image: imageUrl,
      };
    });
  } catch (err) {
    console.error("Failed to load stopover journey options", err);
    return [];
  }
}
