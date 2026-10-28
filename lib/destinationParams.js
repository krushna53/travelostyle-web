// Country suggestions carry country metadata; region suggestions keep region values.
export function destinationParams(selected, options = [], query = "") {
  const params = new URLSearchParams();
  const countries = [];
  const regions = [];
  for (const value of selected) {
    const country = options.find((item) => item.value === value && item.country && !item.city && !item.region);
    (country ? countries : regions).push(value);
  }
  if (countries.length) params.set("country", countries.join(","));
  if (regions.length) params.set("region", regions.join(","));
  if (!selected.length && query.trim()) params.set("search", query.trim());
  return params;
}

export function matchesCountry(journey, value) {
  const values = value.split(",").map((item) => item.trim().toLowerCase());
  const code = String(journey.countryCode || "");
  let name = "";
  try { if (code) name = new Intl.DisplayNames(["en"], { type: "region" }).of(code.toUpperCase()); } catch { /* Unrecognized code. */ }
  return [code, name, journey.country].filter(Boolean).some((item) => values.includes(item.toLowerCase()));
}