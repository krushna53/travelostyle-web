import { matchesCountry } from "@/lib/destinationParams";
import { matchesDestinationSearch } from "@/lib/destinationSearch";
import { matchesBudget } from "@/lib/budgetRanges";

// Single source of truth for the listing page's filter logic, used both to
// filter the result grid (AllJourneysPage) and to compute the "(count)"
// badges in FilterSidebar / MobileFilters.

export function matchesDuration(item, range) {
  const days = parseInt(item.days?.split(" ")[0] || 0);
  if (range === "5–8 Days") return days >= 5 && days <= 8;
  if (range === "8–15 Days") return days >= 8 && days <= 15;
  if (range === "15–25 Days") return days >= 15 && days <= 25;
  if (range === "25+ Days") return days >= 25;
  return true;
}

/**
 * Does one journey pass the given filters?
 * `exclude` skips one filter group — used for faceted counts, so e.g. the
 * Region counts reflect every other selection (style, price…) but not the
 * Region selection itself, which would otherwise zero out the other regions.
 */
export function matchesJourneyFilters(item, filters = {}, { countryFilter = null, exclude = null } = {}) {
  const has = (key) => key !== exclude && (filters[key]?.length ?? 0) > 0;

  if (!matchesDestinationSearch(item, filters.destinationSearch)) return false;

  // The ?country= param behaves like a region selection when no region
  // checkbox is ticked, so it's skipped along with the region group.
  if (countryFilter && exclude !== "region" && !filters.region?.length && !matchesCountry(item, countryFilter)) {
    return false;
  }

  if (filters.displayAllOffers === false && item.offer) return false;

  if (has("region") && !filters.region.some((region) => matchesDestinationSearch(item, region))) return false;
  if (has("style") && !item.tags?.some((t) => filters.style.includes(t))) return false;
  if (has("offer") && !filters.offer.includes(item.offer)) return false;
  if (has("category") && !item.category?.some((c) => filters.category.includes(c))) return false;
  if (has("month") && !item.month?.some((m) => filters.month.includes(m))) return false;
  if (has("pricing") && !filters.pricing.some((range) => matchesBudget(item.price, range))) return false;
  if (has("duration") && !filters.duration.some((range) => matchesDuration(item, range))) return false;

  return true;
}

export function applyJourneyFilters(journeys, filters, options) {
  return journeys.filter((item) => matchesJourneyFilters(item, filters, options));
}

// ---------------------------------------------------------------------------
// "Find Your Journey" search bars (homepage TravelForm, mobile
// FindJourneyMobile, listing-page bar). Used to hide options that would
// lead to zero results given what's already picked in the *other* fields,
// so a visitor can't build a dead-end search (e.g. November + 5–8 Days when
// no November trip is that short).

const normalizeStyle = (value) => String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");

const asList = (value) => (Array.isArray(value) ? value : value ? [value] : []);

/**
 * selection: { region, month, duration, pricing, style } — each a value or
 * an array of values. Travel styles are compared loosely ("Tailor-Made
 * Journey" === "Tailormade Journey"), same as FilterSidebar does when it
 * picks the homepage selection up.
 */
export function matchesSearchSelection(item, selection = {}) {
  const region = asList(selection.region);
  const month = asList(selection.month);
  const duration = asList(selection.duration);
  const pricing = asList(selection.pricing);
  const style = asList(selection.style).map(normalizeStyle);

  if (region.length && !region.some((r) => matchesDestinationSearch(item, r))) return false;
  if (month.length && !item.month?.some((m) => month.includes(m))) return false;
  if (duration.length && !duration.some((d) => matchesDuration(item, d))) return false;
  if (pricing.length && !pricing.some((p) => matchesBudget(item.price, p))) return false;
  if (style.length && !item.tags?.some((t) => style.includes(normalizeStyle(t)))) return false;
  return true;
}

/**
 * Returns isAvailable(key, value): true when picking `value` for `key`
 * (replacing whatever is selected in that same field) still leaves at least
 * one journey. Without journey data it allows everything, so a failed fetch
 * never empties the dropdowns.
 */
export function makeOptionAvailability(journeys, selection) {
  if (!journeys?.length) return () => true;
  return (key, value) =>
    journeys.some((item) => matchesSearchSelection(item, { ...selection, [key]: value }));
}
