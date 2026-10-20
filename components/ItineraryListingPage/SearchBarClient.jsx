"use client";
import { useEffect, useRef, useState } from "react";
import Image from "@/components/SafeImage";
import Link from "next/link";
import TalkToAdvisorButton from "@/components/GeneralInquiryForm/TalkToAdvisorButton";
import { destinationParams } from "@/lib/destinationParams";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import FindJourneyMobile from "@/components/HomePage/FindYourJourney/FindYourJourneyMobile";
import { BUDGET_RANGES } from "@/lib/budgetRanges";
import { matchesDestinationSearch } from "@/lib/destinationSearch";
import { sortMonthsFromCurrent } from "@/lib/months";

// Same options as the homepage's TravelForm "How long do you want to
// travel?" picker.
const durations = ["5–8 Days", "8–15 Days", "15–25 Days", "25+ Days"];

// Carries a selection made on the homepage's "Find Your Journey" widget
// over to this page's own search bar, so it doesn't look like that
// selection was lost on arrival. FilterSidebar reads the same
// sessionStorage payload to actually filter the results; this only
// syncs what the bar itself displays/keeps editable. Read once via each
// field's useState initializer (not a useEffect) so the bar doesn't render
// the "nothing selected" state for a frame before correcting itself.
function readStoredJourneyData() {
  if (typeof window === "undefined") return {};
  const raw = sessionStorage.getItem("journeyData");
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed.filters || parsed;
  } catch (error) {
    console.error("Error reading journeyData from sessionStorage:", error);
    return {};
  }
}

function ListingSearchForm({
  destinations = [],
  months = [],
  allDestinations = [],
  popularDestinations = [],
  popularMonths = [],
  journeys = [],
}) {
  const router = useRouter();
  const formRef = useRef(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedDestinations, setSelectedDestinations] = useState(() => {
    const region = readStoredJourneyData().region
      ?? readStoredJourneyData().regions
      ?? readStoredJourneyData().destinations;
    return region ? (Array.isArray(region) ? region : [region]) : [];
  });
  const [selectedMonths, setSelectedMonths] = useState(() => {
    const month = readStoredJourneyData().month ?? readStoredJourneyData().months;
    return month ? (Array.isArray(month) ? month : [month]) : [];
  });
  const [selectedBudget, setSelectedBudget] = useState(() => {
    const pricing = readStoredJourneyData().pricing;
    const value = Array.isArray(pricing) ? pricing[0] : pricing;
    return value || "";
  });
  const [selectedDuration, setSelectedDuration] = useState(() => {
    const duration = readStoredJourneyData().duration;
    const value = Array.isArray(duration) ? duration[0] : duration;
    return value || "";
  });
  // Free-text filter for the "Where" field — same full Location search
  // (city/region/country/state) as the homepage's TravelForm.
  const [destinationQuery, setDestinationQuery] = useState("");
  // true right after opening the field or picking a destination — the
  // input then displays the selected destinations (editable, select-all on
  // focus) instead of whatever was last typed. Typing again flips this
  // back off so the box goes back to being a live search box. Same pattern
  // as the homepage's TravelForm.
  const [showDestinationSelection, setShowDestinationSelection] = useState(false);

  const toggle = (key) => {
    setActiveDropdown((prev) => (prev === key ? null : key));
    setDestinationQuery("");
  };

  // Panels float over the page, so close them on an outside click — same
  // as the homepage's TravelForm. Without this, clicking anywhere else on
  // the itinerary page left the panel open since nothing else here closed
  // it.
  useEffect(() => {
    if (!activeDropdown) return;
    const handleClickOutside = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) {
        setActiveDropdown(null);
        setDestinationQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdown]);

  // Query is left as-is after a pick — clearing it used to snap the panel
  // back to the unrelated "Popular Destinations" pill view mid-search,
  // which looked like the search had been abandoned. Keeping it means the
  // same result list (with a ✓ now on whatever was just picked) stays put,
  // so searching for and picking several destinations in a row stays in
  // one continuous list instead of bouncing between views.
  const toggleDest = (d) => {
    setShowDestinationSelection(true);
    setSelectedDestinations((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  // Goes straight to the journey, unlike picking a destination which only
  // narrows the filter — matching this journey is a direct result, not
  // another thing to add to a multi-select. Same as the homepage TravelForm.
  const handleJourneySelect = (journey) => {
    if (journey.viewTripUrl) router.push(journey.viewTripUrl);
  };

  // Same curated list as the homepage's "Popular Destinations" by default;
  // typing searches every Location (city/region/country/state), falling
  // back to the plain region list if that curated/full fetch hasn't loaded.
  const popularDestinationOptions = popularDestinations.length
    ? popularDestinations
    : destinations.map((d) => ({ id: d, label: d, value: d }));
  const filteredDestinations = destinationQuery.trim()
  ? (() => {
      const q = destinationQuery.trim().toLowerCase();

      const source = allDestinations.length
        ? allDestinations
        : destinations.map((d) => ({
            id: d,
            label: d,
            value: d,
          }));

      const matches = source.filter((item) =>
        (item.searchText || item.label.toLowerCase()).includes(q)
      );

      const exactMatches = matches.filter(
        (item) => item.label.toLowerCase() === q
      );

      // If the exact country, city, or region exists,
      // show only that exact match.
      const results = exactMatches.length ? exactMatches : matches;

      const seen = new Set();

      return results.filter((item) => {
        const key = item.label.toLowerCase();

        if (seen.has(key)) return false;

        seen.add(key);
        return true;
      });
    })()
  : popularDestinationOptions;

  // Journeys whose title/region/city/country/state match what's typed —
  // same matcher the results page itself uses, so a search that happens to
  // match an actual trip surfaces it directly (image + title), not just as
  // a destination filter chip.
  const matchingJourneys = destinationQuery.trim()
    ? journeys.filter((journey) => matchesDestinationSearch(journey, destinationQuery))
    : [];

  // Shows which city/region actually matched the typed query under a
  // journey's title — prefers whichever of start/end city contains the
  // query so "Varanasi" shows "Varanasi" rather than the journey's other
  // endpoint; falls back to region, then start city, when the match came
  // from the title itself.
  const getJourneyMatchCity = (journey, query) => {
    const term = query.trim().toLowerCase();
    const candidates = [journey.startCity, journey.endCity, journey.region].filter(Boolean);
    if (!term) return candidates[0] || "";
    return candidates.find((value) => value.toLowerCase().includes(term)) || candidates[0] || "";
  };

  const toggleMonth = (m) =>
    setSelectedMonths((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );

  // Same curated "popular" months as the homepage's TravelForm, falling
  // back to the full month taxonomy only if none are flagged popular yet.
  const monthOptions = sortMonthsFromCurrent(
    popularMonths.length ? popularMonths : months,
  );

  const handleDurationSelect = (duration) => setSelectedDuration(duration);

  const destLabel = selectedDestinations.length
    ? selectedDestinations.slice(0, 2).join(", ") +
      (selectedDestinations.length > 2 ? ` +${selectedDestinations.length - 2}` : "")
    : "Where do you want to go?";

  const whenLabel = selectedMonths.length || selectedDuration
    ? `${selectedMonths.slice(0, 2).join(", ")}${
        selectedMonths.length > 2 ? ` +${selectedMonths.length - 2}` : ""
      }${selectedMonths.length && selectedDuration ? ", " : ""}${selectedDuration}`
    : "When do you want to travel?";

  const budgetLabel =
    BUDGET_RANGES.find((b) => b.value === selectedBudget)?.label ||
    "How much do you want to spend?";

  // FilterSidebar (rendered by AllJourneysPage on /itinerary) already
  // knows how to pick filters up from two places on mount: the `region`
  // query param, and a "journeyData" sessionStorage payload for
  // everything else — the same mechanism the homepage's TravelForm /
  // FindJourneyMobile widgets use. Reusing it here (rather than inventing
  // separate ?month=/?pricing= params nothing reads) is what makes
  // "Find Your Journey" actually filter the results.
  const handleFindJourney = () => {
    sessionStorage.setItem(
      "journeyData",
      JSON.stringify({
        region: selectedDestinations,
        month: selectedMonths,
        pricing: selectedBudget ? [selectedBudget] : [],
        duration: selectedDuration ? [selectedDuration] : [],
      }),
    );
    setActiveDropdown(null);
    const params = destinationParams(selectedDestinations, allDestinations);
    router.push(`/itinerary${params.size ? `?${params.toString()}` : ""}`);
  };

  return (
    // Sizes clamp between a readable floor and the 1920 Figma values (46px
    // fields, 210px CTA, 18px label) instead of pure vw, which left the CTA
    // label overflowing its pill on smaller desktops. Below 1200 there isn't
    // room for three fields + CTA in one row, so it drops to a 2x2 grid.
    <div
      ref={formRef}
      className="relative border-2 border-ink rounded-lg px-[clamp(12px,1.25vw,24px)] py-[clamp(12px,0.83vw,16px)] my-6 bg-white"
    >
      <div className="grid grid-cols-2 gap-[clamp(8px,1vw,19px)] min-[1200px]:grid-cols-[1fr_1fr_1fr_auto]">
         {/* WHEN */}
        <button
          onClick={() => toggle("when")}
          className="flex h-[clamp(38px,2.4vw,46px)] min-w-0 items-center justify-between gap-2 rounded border border-gray-300 bg-white px-[clamp(10px,0.83vw,16px)]"
        >
          <span className={`min-w-0 truncate text-[clamp(13px,0.73vw,14px)] ${!selectedMonths.length && !selectedDuration ? "text-gray-400" : "text-ink"}`}>
            {whenLabel}
          </span>
          {activeDropdown === "when" ? <ChevronUp size={16} className="shrink-0" /> : <ChevronDown size={16} className="shrink-0" />}
        </button>
        {/* WHERE */}
        <div className="relative min-w-0">
          {activeDropdown === "dest" ? (
            <div className="flex h-[clamp(38px,2.4vw,46px)] min-w-0 items-center gap-2 rounded border border-gray-300 bg-white px-[clamp(10px,0.83vw,16px)]">
              <input
                autoFocus
                type="text"
                value={showDestinationSelection ? selectedDestinations.join(", ") : destinationQuery}
                onFocus={(e) => {
                  if (showDestinationSelection) e.target.select();
                }}
                onChange={(e) => {
                  setShowDestinationSelection(false);
                  setDestinationQuery(e.target.value);
                }}
                placeholder="Search by city, region or country"
                className="min-w-0 flex-1 truncate bg-transparent text-[clamp(13px,0.73vw,14px)] placeholder:text-gray-400 focus:outline-none"
              />
              {(destinationQuery.trim() || selectedDestinations.length > 0) && (
                <button
                  type="button"
                  onClick={() => {
                    setDestinationQuery("");
                    setSelectedDestinations([]);
                    setShowDestinationSelection(false);
                  }}
                  className="shrink-0 text-gray-400 hover:text-gray-600"
                  aria-label="Clear destination"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                setShowDestinationSelection(true);
                toggle("dest");
              }}
              className="flex h-[clamp(38px,2.4vw,46px)] w-full min-w-0 items-center justify-between gap-2 rounded border border-gray-300 bg-white px-[clamp(10px,0.83vw,16px)]"
            >
              <span className={`min-w-0 truncate text-[clamp(13px,0.73vw,14px)] ${!selectedDestinations.length ? "text-gray-400" : "text-ink"}`}>
                {destLabel}
              </span>
              <ChevronDown size={16} className="shrink-0" />
            </button>
          )}

          {/* Search Results — anchored to just this field (not the full
              form width) since typing can return many more rows than the
              curated Popular Destinations list and looked wrong spanning
              the whole bar. */}
          {activeDropdown === "dest" && destinationQuery.trim() && (
            <div className="absolute left-0 right-0 top-full z-40 mt-3 rounded-lg border border-gray-200 bg-white p-4 shadow-md">
              <h3 className="mb-3 text-[18px] font-semibold">Search Results</h3>
              <div className="max-h-[320px] overflow-y-auto rounded-[6px] border border-[#D9D9D9]">
                {matchingJourneys.map((journey) => (
                  <button
                    key={`journey-${journey.id}`}
                    onClick={() => handleJourneySelect(journey)}
                    className="flex w-full items-center gap-3 border-b border-[#EEEEEE] px-4 py-2.5 text-left last:border-b-0 hover:bg-[#F5EFE8]"
                  >
                    <span className="relative h-[36px] w-[36px] shrink-0 overflow-hidden rounded-[4px] bg-[#EEEEEE]">
                      {journey.image && (
                        <Image
                          src={journey.image}
                          alt={journey.title}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      )}
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate text-[14px] font-medium text-[#1A1A1A]">
                        {journey.title}
                      </span>
                      {getJourneyMatchCity(journey, destinationQuery) && (
                        <span className="truncate text-[12px] text-[#757575]">
                          {getJourneyMatchCity(journey, destinationQuery)}
                        </span>
                      )}
                    </span>
                  </button>
                ))}

                {filteredDestinations.length ? (
                  filteredDestinations.map((item) => {
                    const isSelected = selectedDestinations.includes(item.value);
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggleDest(item.value)}
                        className={`flex w-full items-center justify-between gap-2 border-b border-[#EEEEEE] px-4 py-2.5 text-left text-[14px] last:border-b-0 ${
                          isSelected
                            ? "bg-[#F5EFE8] text-[#2E348D]"
                            : "text-[#444] hover:bg-[#F5EFE8]"
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                        {isSelected && <span className="shrink-0 text-[#2E348D]">✓</span>}
                      </button>
                    );
                  })
                ) : matchingJourneys.length ? null : (
                  <p className="px-4 py-3 text-[14px] text-[#757575]">No matching destinations</p>
                )}
              </div>
            </div>
          )}
        </div>


        {/* BUDGET */}
        <button
          onClick={() => toggle("budget")}
          className="flex h-[clamp(38px,2.4vw,46px)] min-w-0 items-center justify-between gap-2 rounded border border-gray-300 bg-white px-[clamp(10px,0.83vw,16px)]"
        >
          <span className={`min-w-0 truncate text-[clamp(13px,0.73vw,14px)] ${!selectedBudget ? "text-gray-400" : "text-ink"}`}>
            {budgetLabel}
          </span>
          {activeDropdown === "budget" ? <ChevronUp size={16} className="shrink-0" /> : <ChevronDown size={16} className="shrink-0" />}
        </button>

        {/* CTA */}
        <button
          onClick={handleFindJourney}
          className="h-[clamp(38px,2.4vw,46px)] min-w-[clamp(160px,10.9vw,210px)] whitespace-nowrap rounded-full bg-[#2E348D] px-6 text-[clamp(15px,0.94vw,18px)] font-medium text-white transition hover:bg-[#252b78]"
        >
          Find Your Journey
        </button>
      </div>

      {/* POPULAR DESTINATIONS — full-width panel under the whole bar,
          absolutely positioned so it floats over the page below instead of
          pushing the layout down. Only the empty-query state renders here;
          once typing starts, the narrower Search Results panel nested in
          the WHERE field above takes over. */}
      {activeDropdown === "dest" && !destinationQuery.trim() && (
        <div className="absolute left-0 right-0 top-full z-40 mt-3 rounded-lg border border-gray-200 bg-white p-4 shadow-md">
          <h3 className="mb-3 text-[18px] font-semibold">Popular Destinations</h3>
          <div className="flex flex-wrap gap-2">
            {filteredDestinations.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleDest(item.value)}
                className={`rounded-full border px-4 py-1 text-[14px] transition-all ${
                  selectedDestinations.includes(item.value)
                    ? "border-[#2E348D] bg-[#F5EFE8] text-[#2E348D]"
                    : "border-gray-300 bg-white text-[#444]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* WHEN DROPDOWN — absolutely positioned so it floats over the page
          below instead of pushing the layout down, same as the WHERE
          dropdown above. */}
      {activeDropdown === "when" && (
        <div className="absolute left-0 right-0 top-full z-40 mt-3 rounded-lg border border-gray-200 bg-white p-4 shadow-md">
          <h3 className="mb-3 text-[18px] font-semibold">Pick Month of Travel</h3>
          <div className="flex flex-wrap gap-2">
            {monthOptions.map((m) => (
              <button
                key={m}
                onClick={() => toggleMonth(m)}
                className={`rounded-full border px-4 py-1 text-[14px] transition-all ${
                  selectedMonths.includes(m)
                    ? "border-[#2E348D] bg-[#F5EFE8] text-[#2E348D]"
                    : "border-gray-300 bg-white text-[#444]"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <h4 className="mb-3 mt-5 text-[18px] font-semibold">
            How long do you want to travel?
          </h4>
          <div className="flex flex-wrap gap-6">
            {durations.map((item) => (
              <label
                key={item}
                className="flex cursor-pointer items-center gap-2 text-[14px]"
              >
                <input
                  type="checkbox"
                  name="duration"
                  checked={selectedDuration === item}
                  onChange={() => handleDurationSelect(item)}
                  className="h-[16px] w-[16px]"
                />
                {item}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* BUDGET DROPDOWN — same floating treatment as WHEN/WHERE above. */}
      {activeDropdown === "budget" && (
        <div className="absolute left-0 right-0 top-full z-40 mt-3 rounded-lg border border-gray-200 bg-white p-4 shadow-md">
          <h3 className="mb-3 text-[18px] font-semibold">Select Budget Range</h3>
          <div className="flex flex-wrap gap-2">
            {BUDGET_RANGES.map((b) => (
              <button
                key={b.value}
                onClick={() => { setSelectedBudget(b.value); setActiveDropdown(null); }}
                className={`rounded-full border px-4 py-1 text-[14px] transition-all ${
                  selectedBudget === b.value
                    ? "border-[#2E348D] bg-[#F5EFE8] text-[#2E348D]"
                    : "border-gray-300 bg-white text-[#444]"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchBar({
  destinations = [],
  months = [],
  allDestinations = [],
  popularDestinations = [],
  popularMonths = [],
  journeys = [],
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFindJourneyMobile, setShowFindJourneyMobile] = useState(false);

  return (
    <section className="w-full">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-[#2E2787] px-4 md:px-[108px] py-2 text-[10px] md:text-[11px] text-white">
        <p className="flex items-center gap-2 truncate md:hidden">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
           <a href="tel:+17735039742">+1773 503 9742</a> | 9am-5pm CST
        </p>
        <p className="hidden md:block truncate">
          Speak to our travel advisor <a href="tel:+17735039742">+1773 503 9742</a> | open  9am-5pm CST
        </p>
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/faqs">FAQs</Link>
          <TalkToAdvisorButton className="hidden md:block">
            Contact Us
          </TalkToAdvisorButton>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 z-50 min-[1191px]:hidden transition-all duration-300 ${
          menuOpen ? "visible" : "invisible"
        }`}
      >
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute left-0 top-0 w-[65%] max-w-[240px] bg-[#2E2787] text-white p-6 flex flex-col justify-between transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div>
            <div className="flex justify-end">
              <button onClick={() => setMenuOpen(false)} className="text-white text-2xl">✕</button>
            </div>
           <div className="mt-3 flex flex-col gap-[12px] text-[15px] font-medium tracking-wide">
  <Link href="/about-us" className="text-left hover:underline">
    About
  </Link>

  <Link href="/group-rtb-journeys" className="text-left hover:underline">
    Group Journeys
  </Link>

  <Link href="/private-rtb-journeys" className="text-left hover:underline">
    Private Journeys
  </Link>

  <Link href="/tailor-made-journeys" className="text-left hover:underline">
    Tailor-Made Journeys
  </Link>

  <Link href="/itinerary" className="text-left hover:underline">
    All Journeys
  </Link>

  <Link href="/special-offers" className="text-left hover:underline">
    Offers
  </Link>

  <Link href="/faqs" className="text-left hover:underline">
    FAQs
  </Link>
  <Link href="https://buy.stripe.com/eVqeV630mf347Gwb3yfjG01" className="text-left hover:underline">
    Pay by Stripe
  </Link>
</div>
            <div className="mt-8">
              <button className="rounded-full bg-white px-6 py-2.5 text-[13px] font-semibold text-[#2E2787]">
                Explore All Journeys
              </button>
            </div>
            <div className="mt-10 flex gap-4 items-center">
              <Image src="/Facebook.svg" alt="Facebook" width={34} height={32} />
              <a
                href="https://www.instagram.com/travelostyle1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src="/Instagram.svg" alt="Instagram" width={34} height={32} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Header + Quote + Search */}
      <div className="bg-[#FAFAFA] py-2">
        {/* Nav row — fixed height on mobile so the icons (centered via
            items-center) and the logo (centered via top-1/2/-translate-y-1/2)
            both center against the exact same band, from just under the
            FAQ bar down to this row's own border line. */}
        <div className="relative flex h-14 items-center justify-between border-b border-[#1A1A1A] min-[1191px]:h-auto min-[1191px]:pb-5 px-4 md:px-[108px]">
          <button onClick={() => setMenuOpen(true)} className="block min-[1191px]:hidden">
            <Image src="/MenuToggle.svg" alt="Menu" width={20} height={20} />
          </button>
          <Link href="/">
  <img
    src="/TravelOStyleBlack.svg"
    alt="TravelOStyle"
    className="h-auto w-[140px] md:w-[184px] min-[1191px]:w-[clamp(220px,16.1vw,309px)] min-[1191px]:static absolute inset-x-0 top-1/2 mx-auto -translate-y-1/2 min-[1191px]:top-auto min-[1191px]:mx-0 min-[1191px]:translate-y-0 cursor-pointer"
  />
</Link>
          {/* Eight links beside a 309px logo only fit from 1191 (the main
              SearchHeader's breakpoint too); below that it's the hamburger.
              Gap/size/logo scale to their 1920 values (36px, 14px, 309px). */}
          <div className="hidden min-[1191px]:flex items-center whitespace-nowrap gap-[clamp(12px,1.875vw,36px)] text-[clamp(12px,0.73vw,14px)] font-medium text-[#1E1E1E]">
           <Link href="/about-us">About</Link>

<Link href="/group-rtb-journeys">
  Group Journeys
</Link>

<Link href="/private-rtb-journeys">
  Private Journeys
</Link>

<Link href="/tailor-made-journeys">
  Tailor-made Journeys
</Link>

<Link href="/itinerary">
  All Journeys
</Link>

<Link href="/destination">
  Destinations
</Link>

<Link href="/special-offers">
  Offers
</Link>

<Link href="/faqs">
  FAQs
</Link>
<Link href="https://buy.stripe.com/eVqeV630mf347Gwb3yfjG01">
  Pay by Stripe
</Link>
          </div>
          <button onClick={() => setShowFindJourneyMobile(true)} className="block min-[1191px]:hidden">
            <Image src="/Search.svg" alt="Search" width={16} height={16} />
          </button>
        </div>

        {/* Hero Quote — desktop only. The mobile itinerary page shows this
            same wording in its own script-styled heading (AllJourneysPage.jsx),
            so repeating it here would duplicate it on mobile. */}
        <div className="hidden md:flex justify-center items-center pt-[91px] pb-[67px]">
          {/* Figma "Itinerary Listing Page", 1920: Taprom 56/72/5%, centred,
              cap-top 222; Rectangle 910 (1198x53) behind line one and 911
              (912x53) behind line two, each starting on its line's cap top.
              Real 53px bars (.hero-bar-itin1/2) rather than a full-line-height
              background on the spans, which also stacked on an extra
              .sub-title-bg bar from the <p>. Leading in em so the bars track
              the size steps. */}
          <p className="relative z-10 text-center whitespace-nowrap font-taprom font-normal text-ink tracking-[0.05em] leading-[1.2857] text-[56px] max-[1910px]:text-[44px] max-[1281px]:text-[38px] max-[1250px]:text-[32px] max-[1200px]:text-[28px]">
            <span className="block">
              <span className="sub-title-bg hero-bar-itin1 inline-block">
                The range is wide because we&apos;ve never believed in a
              </span>
            </span>
            <span className="block">
              <span className="sub-title-bg hero-bar-itin2 inline-block">
                one-size-fits-all approach to the world.
              </span>
            </span>
          </p>
        </div>

        {/* Desktop Search Form */}
        <div className="hidden md:block px-4 md:px-[108px]">
          <ListingSearchForm
            destinations={destinations}
            months={months}
            allDestinations={allDestinations}
            popularDestinations={popularDestinations}
            popularMonths={popularMonths}
            journeys={journeys}
          />
        </div>
      </div>

      {showFindJourneyMobile && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <FindJourneyMobile
            onClose={() => setShowFindJourneyMobile(false)}
            destinations={destinations}
            months={months}
            allDestinations={allDestinations}
            popularDestinations={popularDestinations}
            popularMonths={popularMonths}
            journeys={journeys}
          />
        </div>
      )}
    </section>
  );
}
