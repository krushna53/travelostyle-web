// Decides whether a journey's offer message (field_offer_message) should be
// shown. Every message is shown by default, except one that mentions
// "Early Bird" while Early Bird is off for that journey — that message is
// stale, so it's hidden everywhere (cards, Exclusive Deals, listing, journey
// detail desktop + mobile, comparison).
//
// Early Bird counts as ON when it's ticked on the journey node itself
// (field_early_bird) OR on any of its published "book_your_journey"
// departures (field_early_bird) — editors usually tick it on the departure,
// which is also what the Dates & Pricing tab reads.
const EARLY_BIRD_PATTERN = /early[\s-]*bird/i;

export function getVisibleOfferMessage(message, isEarlyBird) {
  const text = String(message ?? "").trim();
  if (!text) return "";
  if (!isEarlyBird && EARLY_BIRD_PATTERN.test(text)) return "";
  return text;
}

// Set of journey UUIDs that have at least one departure with Early Bird ticked.
export function getEarlyBirdJourneyIds(departures = []) {
  const ids = new Set();
  (departures || []).forEach((departure) => {
    const journeyId = departure?.relationships?.field_journey?.data?.id;
    if (journeyId && departure?.attributes?.field_early_bird === true) {
      ids.add(journeyId);
    }
  });
  return ids;
}

// True when Early Bird is ticked on the journey itself or on any departure.
export function isJourneyEarlyBird(journeyItem, earlyBirdJourneyIds) {
  if (journeyItem?.attributes?.field_early_bird === true) return true;
  return Boolean(journeyItem?.id && earlyBirdJourneyIds?.has(journeyItem.id));
}

// Fetches every published departure (following JSON:API pagination) and
// returns the Set from getEarlyBirdJourneyIds(). Never throws — on failure
// it returns an empty Set, so only the journey-level flag is used.
export async function fetchEarlyBirdJourneyIds(baseUrl) {
  try {
    let nextUrl = `${baseUrl}/jsonapi/node/book_your_journey?filter[status][value]=1`;
    let all = [];
    while (nextUrl) {
      const res = await fetch(nextUrl, { next: { revalidate: 60 } });
      if (!res.ok) break;
      const json = await res.json();
      all = all.concat(json.data || []);
      nextUrl = json.links?.next?.href || null;
    }
    return getEarlyBirdJourneyIds(all);
  } catch (err) {
    console.error("Failed to load departures for Early Bird check", err);
    return new Set();
  }
}
