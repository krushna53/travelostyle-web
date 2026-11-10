// True when Tailormade is the ONLY Journey Style (field_journey_tag) picked
// on a journey, e.g. ["Tailormade Journey"]. Those journeys don't show a
// price or a "Request a Private Journey" CTA. A journey that is also Group
// or Private (e.g. ["Group Journey", "Tailormade Journey"]) keeps both.
export function isTailorMadeOnly(tags) {
  const list = (tags || []).filter(Boolean);
  return list.length > 0 && list.every((tag) => /tailor/i.test(tag));
}
