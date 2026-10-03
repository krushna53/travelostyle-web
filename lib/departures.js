// Shared helper for picking which upcoming "book_your_journey" departure to
// pre-fill the Private Inquiry form with, when the user clicks "Request a
// Private Journey" from a Group journey's summary card (rather than picking
// a specific date from the Dates & Pricing tab themselves).
//
// Priority: the soonest upcoming departure that currently has an active
// offer (field_offer > 0); if none of the upcoming departures have an
// offer, fall back to the soonest upcoming departure overall. Sold-out
// departures are skipped either way. Mirrors the same field mapping used in
// DatePricing.jsx's `trips` list so the two stay consistent.

export function pickPriorityDeparture(departures = []) {
  const upcoming = (departures || [])
    .map((item) => {
      const startDate = item.attributes?.field_departure_date;
      if (!startDate) return null;

      // Original price from Drupal
      const originalPrice = Number(
        item.attributes?.field_original_price || 0
      );

      // Manually entered offer price from Drupal
      const offerPrice = Number(
        item.attributes?.field_offer || 0
      );

      // Use the actual offer price instead of calculating a discount
      const discountedPrice =
        offerPrice > 0 ? offerPrice : originalPrice;

      const isSoldOut =
        item.attributes?.field_status === "soldout";

      return {
        id: item.id,
        nodeId: item.attributes?.drupal_internal__nid ?? null,
        title: item.attributes?.title || "",
        startDate,
        endDate: item.attributes?.field_return_date,
        originalPrice,
        offerPrice,
        discountedPrice,
        hasOffer: offerPrice > 0,
        isSoldOut,
      };
    })
    .filter(Boolean)
    .filter(
      (trip) =>
        !trip.isSoldOut &&
        new Date(trip.startDate) >= new Date()
    )
    .sort(
      (a, b) =>
        new Date(a.startDate) - new Date(b.startDate)
    );

  if (!upcoming.length) return null;

  const closestWithOffer = upcoming.find(
    (trip) => trip.hasOffer
  );

  const chosen = closestWithOffer || upcoming[0];

  return {
    id: chosen.id,
    nodeId: chosen.nodeId,
    title: chosen.title,
    startDate: chosen.startDate,
    endDate: chosen.endDate,
    originalPrice: chosen.originalPrice,
    offerPrice: chosen.offerPrice,
    discountedPrice: chosen.discountedPrice,
  };
}