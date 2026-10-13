export function matchesDestinationSearch(journey, query) {
  const term = String(query || "").trim().toLowerCase();
  if (!term) return true;
  const code = journey.countryCode;
  let country = "";
  if (code) {
    try { country = new Intl.DisplayNames(["en"], { type: "region" }).of(code.toUpperCase()); } catch { country = code; }
  }
  return [journey.title, journey.region, ...(journey.regions || []), country, code,
    journey.country, journey.city, journey.state, ...(journey.locationNames || [])]
    .filter(Boolean).some((value) => String(value).toLowerCase().includes(term));
}