const MONTH_ORDER = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

// Orders month names so the current month comes first, followed by the
// following months in calendar order (wrapping into next year), e.g. in
// October: October, November, December, January, ... September.
// Drupal returns Month terms in no useful order. Anything that isn't a
// recognisable month name keeps its relative order at the end.
export function sortMonthsFromCurrent(months, now = new Date()) {
  const current = now.getMonth();
  const rank = (name) => {
    const index = MONTH_ORDER.indexOf(String(name).trim().toLowerCase());
    return index === -1 ? 12 : (index - current + 12) % 12;
  };
  return [...months].sort((a, b) => rank(a) - rank(b));
}
