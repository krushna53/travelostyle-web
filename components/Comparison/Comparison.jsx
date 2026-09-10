"use client";

import Image from "next/image";
import { API_BASE_URL } from "@/lib/config";
import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { isInspirationalJourney } from "@/lib/journeyExperienceType";
import { pickPriorityDeparture } from "@/lib/departures";
import PrivateInquiryForm from "@/components/PrivateInquiryForm";
import iso3166 from "iso-3166-2";

/* ---------------- data helpers (unchanged) ---------------- */
function getLocation(id, included) {
  const node = included.find((i) => i.type === "node--location" && i.id === id);
  return node?.attributes?.title || "";
}

function getStartCity(journey, included) {
  const id = journey.relationships?.field_starts_in?.data?.id;
  return getLocation(id, included);
}

function getEndCity(journey, included) {
  const id = journey.relationships?.field_ends_in?.data?.id;
  return getLocation(id, included);
}

// City, State for a day's field_stay -> node--hotel -> field_location
// (node--location) -> field_address. field_stay references the hotel
// itself, not the location directly — the address lives one hop further.
function getStayCityState(day, included) {
  const hotelId = day.relationships?.field_stay?.data?.id;
  const hotelNode = included.find(
    (i) => i.type === "node--hotel" && i.id === hotelId,
  );
  const locationId = hotelNode?.relationships?.field_location?.data?.id;
  const locationNode = included.find(
    (i) => i.type === "node--location" && i.id === locationId,
  );
  const address = locationNode?.attributes?.field_address;
  const city = address?.locality || "";
  const stateCode = address?.administrative_area || "";
  const countryCode = address?.country_code || "";
  const state =
    (stateCode &&
      countryCode &&
      iso3166.subdivision(countryCode, stateCode)?.name) ||
    stateCode;
  return [city, state].filter(Boolean).join(", ");
}

function getItinerary(journey, included) {
  const containerId =
    journey.relationships?.field_journey_tabs_section?.data?.[0]?.id;
  const container = included.find((i) => i.id === containerId);
  const tabRefs = container?.relationships?.field_section_tabs?.data || [];
  const itineraryTab = tabRefs
    .map((r) => included.find((i) => i.id === r.id))
    .find((t) => t?.type === "paragraph--itinerary_tab");
  if (!itineraryTab) return [];

  const dayRefs = itineraryTab.relationships?.field_days?.data || [];
  return dayRefs
    .map((d) => included.find((i) => i.id === d.id))
    .filter(Boolean)
    .map((day) => ({
      day: day.attributes?.field_day_number,
      title: day.attributes?.field_day_title || "",
      stayCityState: getStayCityState(day, included),
    }));
}

// {id, label} pairs for field_journey_tag ("Journey Style") terms — same
// resolution as JourneyDetailClient's resolveJourneyStyleTerms, needed to
// build the "journeytype" value the Private Inquiry webform expects.
function getTagIds(journey, included) {
  const data = journey.relationships?.field_journey_tag?.data;
  const arr = Array.isArray(data) ? data : data ? [data] : [];

  // Only forward a tag id when the referenced term is actually present in
  // `included` (i.e. it resolves to a real, published term). A relationship
  // can point at a deleted/unpublished term while still carrying a
  // drupal_internal__target_id in its meta — sending that dangling id
  // straight to the inquiry webform is what produced "The referenced
  // entity (taxonomy_term: X) does not exist" validation errors on
  // submit. Same fix already applied in AllJourneysPage.jsx / journeyCard.js.
  // Only the "journey_style" vocabulary bundle is accepted by the
  // webform's `journeytype` target field — a taxonomy_term--tags id can
  // resolve fine here (real, published term) yet still get rejected by
  // Drupal on submit with "The referenced entity (taxonomy_term: X)
  // does not exist.", because that validation is bundle-scoped, not
  // just existence-scoped. So this only matches taxonomy_term--journey_style.
  return arr
    .map((t) => {
      const tagEntity = included.find(
        (inc) => inc.type === "taxonomy_term--journey_style" && inc.id === t.id,
      );
      if (!tagEntity) return null;
      const id = t.meta?.drupal_internal__target_id;
      return id != null ? Number(id) : null;
    })
    .filter((id) => id != null);
}

// Capitalizes just the first character (e.g. "puna, Maharashtra" ->
// "Puna, Maharashtra") without touching the rest of the string, since
// city names arrive from Drupal with inconsistent casing.
function capitalizeFirst(text) {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Trip price can arrive already formatted with a "$" (from one
// "Add to Compare" entry point) or as a raw number/string (from another),
// so this strips any existing currency symbol/commas before reformatting —
// re-prefixing a value that already has "$" would show it twice.
function formatPrice(price) {
  if (price == null || price === "") return "";
  const numeric = Number(String(price).replace(/[^0-9.-]/g, ""));
  return Number.isNaN(numeric) ? String(price) : `$${numeric.toLocaleString()}`;
}

function getStays(journey, included) {
  const containerId =
    journey.relationships?.field_journey_tabs_section?.data?.[0]?.id;
  const container = included.find((i) => i.id === containerId);
  const tabRefs = container?.relationships?.field_section_tabs?.data || [];
  const staysTab = tabRefs
    .map((r) => included.find((i) => i.id === r.id))
    .find((t) => t?.type === "paragraph--stays_tab");
  if (!staysTab) return [];

  const hotelRefs = staysTab.relationships?.field_hotels?.data || [];
  return hotelRefs
    .map((h) => included.find((i) => i.id === h.id))
    .filter(Boolean)
    .map((hotel) => ({
      name: hotel.attributes?.title || "",
    }));
}

/* ---------------- row config ----------------
   One source of truth for row heights. The label column (desktop) and
   every card cell read the SAME height classes, so everything stays
   aligned automatically — no magic pt-[300px] offsets. Change a height
   here and both sides update together. */
const ROWS = [
  { key: "duration", label: "Duration", h: "h-10 md:h-10" },
  { key: "destinations", label: "No. of Destinations", h: "h-10 md:h-10" },
  // Height set dynamically per render (see itineraryRowHeight) so a longer
  // itinerary never needs an inner scrollbar — every card just grows.
  { key: "itinerary", label: "Itinerary", h: "" },
  { key: "stays", label: "Stays", h: "" },
  { key: "region", label: "Region", h: "h-10 md:h-10" },
  { key: "offer", label: "Available Offers", h: "h-14 md:h-14" },
  { key: "price", label: "Price", h: "h-32 md:h-20" },
  { key: "travel", label: "Ways to Travel", h: "h-32 md:h-32" },
];

/* Height of the card header (image + title) so the desktop label column
   can offset itself by the same amount. Scaled from the 1920px Figma
   frame (288px header ≈ 15vw) between a phone-sized floor and the
   original design value. */
const CARD_HEADER = "h-[248px] md:h-[288px]";

/* Max trips allowed in comparison. Header copy says "up to 3" — badhana
   ho to yahan change karo aur heading text bhi update karo. */
const MAX_COMPARE_TRIPS = 30;

const INCLUDE = [
  "field_journey_image.field_media_image",
  "field_journey_tag",
  // Entity reference to the "Journey Experience Type" taxonomy vocabulary
  // (Group / Inspirational) — same field the journey detail page reads to
  // decide between "Check Availability" and "Request a Private Journey"
  // only.
  "field_journey_experience_type",
  "field_month",
  "field_starts_in",
  "field_ends_in",
  "field_best_seasons",
  "field_pace",
  "field_journey_tabs_section",
  "field_journey_tabs_section.field_section_tabs",
  "field_journey_tabs_section.field_section_tabs.field_days",
  "field_journey_tabs_section.field_section_tabs.field_days.field_stay",
  "field_journey_tabs_section.field_section_tabs.field_days.field_stay.field_location",
  "field_journey_tabs_section.field_section_tabs.field_hotels",
  "field_journey_tabs_section.field_section_tabs.field_hotels.field_featured_image.field_media_image",
  "field_journey_tabs_section.field_section_tabs.field_hotels.field_gallery.field_media_image",
].join(",");

export default function TripComparison() {
  const [trips, setTrips] = useState([]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  // Which trip's "Request a Private Journey" / "Tailor This Journey"
  // opened the form, so one shared PrivateInquiryForm instance can serve
  // every card instead of rendering one per trip.
  const [activeFormTrip, setActiveFormTrip] = useState(null);
  const router = useRouter();
  const scrollRef = useRef(null);

  // Itinerary/Stays rows are sized to fit the tallest trip's actual
  // rendered content (measured, not estimated) so every card's row stays
  // aligned without either clipping wrapped text or leaving a fixed
  // per-line budget that overshoots when most lines don't wrap.
  const itineraryElRefs = useRef({});
  const staysElRefs = useRef({});
  const [itineraryRowHeight, setItineraryRowHeight] = useState(0);
  const [staysRowHeight, setStaysRowHeight] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadComparisonTrips() {
      try {
        // Read the latest value from localStorage
        const storedTrips = JSON.parse(
          localStorage.getItem("compareTrips") || "[]",
        );
        console.log("Comparison page - localStorage trips:", storedTrips);

        if (!storedTrips.length) {
          if (!cancelled) {
            setTrips([]);
          }
          return;
        }

        const [res, departureRes] = await Promise.all([
          fetch(`${API_BASE_URL}/jsonapi/node/journey?include=${INCLUDE}`),
          // Needed for Group journeys' "Request a Private Journey" — same
          // closest-offer/closest-date pre-fill logic as the journey detail
          // page's hero card.
          fetch(`${API_BASE_URL}/jsonapi/node/book_your_journey`),
        ]);

        const json = await res.json();
        const departureJson = departureRes.ok
          ? await departureRes.json()
          : { data: [] };

        const data = json.data || [];
        const included = json.included || [];
        const allDepartures = departureJson.data || [];

        const enrichedTrips = storedTrips.map((trip) => {
          const journey = data.find((item) => item.id === trip.id);

          // If Drupal doesn't return this journey,
          // keep the locally saved trip.
          if (!journey) {
            return trip;
          }

          const isInspirational = isInspirationalJourney(journey, included);
          const journeyDepartures = allDepartures.filter(
            (d) => d.relationships?.field_journey?.data?.id === journey.id,
          );

          return {
            ...trip,
            startCity: getStartCity(journey, included),
            endCity: getEndCity(journey, included),
            tabItinerary: getItinerary(journey, included),
            tabStays: getStays(journey, included),
            isInspirational,
            // A trimmed journey object shaped for PrivateInquiryForm /
            // JourneySummaryCard — the comparison card's own `trip` fields
            // (e.g. `price` as a pre-formatted "$5,000" string) aren't the
            // right shape for those.
            formJourney: {
              id: journey.id,
              nodeId: journey.attributes?.drupal_internal__nid ?? null,
              title: journey.attributes?.title || trip.title,
              image: trip.image,
              days: trip.days,
              destinations: trip.destinations,
              offerPrice: journey.attributes?.field_offer_price,
              originalPrice: journey.attributes?.field_original_price,
              earlyBird: Boolean(journey.attributes?.field_early_bird),
              tagIds: getTagIds(journey, included),
            },
            priorityDeparture: isInspirational
              ? null
              : pickPriorityDeparture(journeyDepartures),
          };
        });

        if (!cancelled) {
          setTrips(enrichedTrips);
        }
        console.log("Comparison page - enriched trips:", enrichedTrips);
      } catch (err) {
        console.error("Comparison trips loading error:", err);
        // Important:
        // Even if Drupal API fails, show the trips
        // that were already saved in localStorage.
        const fallbackTrips = JSON.parse(
          localStorage.getItem("compareTrips") || "[]",
        );
        if (!cancelled) {
          setTrips(fallbackTrips);
        }
      }
    }

    loadComparisonTrips();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const updateArrows = () => {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft <
          container.scrollWidth - container.clientWidth - 5,
      );
    };

    updateArrows();
    container.addEventListener("scroll", updateArrows);
    window.addEventListener("resize", updateArrows);

    return () => {
      container.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [trips]);

  const scrollLeft = () =>
    scrollRef.current?.scrollBy({ left: -340, behavior: "smooth" });
  const scrollRight = () =>
    scrollRef.current?.scrollBy({ left: 340, behavior: "smooth" });

  const removeTrip = (tripId) => {
    const updatedTrips = trips.filter((trip) => trip.id !== tripId);
    setTrips(updatedTrips);
    localStorage.setItem("compareTrips", JSON.stringify(updatedTrips));
  };

  const ROW_GAP = 16;

  useLayoutEffect(() => {
    const measure = () => {
      const itineraryHeights = Object.values(itineraryElRefs.current).map(
        (el) => el?.scrollHeight || 0,
      );
      const staysHeights = Object.values(staysElRefs.current).map(
        (el) => el?.scrollHeight || 0,
      );
      const maxItinerary = Math.max(0, ...itineraryHeights);
      const maxStays = Math.max(0, ...staysHeights);
      setItineraryRowHeight(maxItinerary && maxItinerary + ROW_GAP);
      setStaysRowHeight(maxStays && maxStays + ROW_GAP);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [trips]);

  const rowHeightStyle = (key) => {
    if (key === "itinerary") return { height: itineraryRowHeight };
    if (key === "stays") return { height: staysRowHeight };
    return undefined;
  };

  /* Renders the content of one comparison row for a trip. The MOBILE
     label lives inside the cell (md:hidden), so on phones every value is
     self-explanatory without the side column. */
  const renderRowContent = (trip, key) => {
    switch (key) {
      case "duration":
        return (
          <div className="text-sm md:w-[156px] md:h-[13px] justify-center md:leading-[13px] md:overflow-hidden">
            {trip.days}
          </div>
        );

      case "destinations":
        return (
          <div className="text-sm md:w-[135px] md:h-[13px] md:leading-[13px] md:overflow-hidden">
            {trip.destinations}
          </div>
        );

      case "itinerary":
        return (
          <div
            ref={(el) => {
              itineraryElRefs.current[trip.id] = el;
            }}
            className="text-sm space-y-0.5 pr-1"
          >
            {trip.tabItinerary?.map((day) => (
              <div
                key={day.day}
                className="break-words text-[18px] leading-[18px] tracking-[0.05em]"
              >
                <span className="font-semibold">Day {day.day}:</span>{" "}
                <span className="font-nohemi">
                  {capitalizeFirst(day.stayCityState)}
                </span>
              </div>
            ))}
          </div>
        );

      case "stays":
        return (
          <div
            ref={(el) => {
              staysElRefs.current[trip.id] = el;
            }}
            className="text-sm space-y-0.5 pr-1"
          >
            {trip.tabStays?.map((stay) => (
              <div
                key={stay.name}
                className="break-words md:w-[224px] md:leading-[13px]"
              >
                {stay.name}
              </div>
            ))}
          </div>
        );

      case "region": {
        const regionText = (trip.region || "").trim();
        return <div className="text-sm">{regionText}</div>;
      }

      case "offer":
        return (
          <div className="text-sm md:w-[298px] md:h-[37px] md:overflow-hidden">
            {trip.offerprice}
          </div>
        );

      case "price":
        return (
          <div className="bg-[#F2E2DA] px-3 py-3 md:p-8 flex flex-col md:flex-row md:justify-between md:items-center gap-2 h-full w-[calc(100%+24px)] -ml-3 md:w-[calc(100%+32px)] md:-ml-4 md:h-[61px]">
            <div className="text-left min-w-0">
              <div className="text-xs text-gray-600">from</div>
              <div className="font-bold text-lg leading-tight truncate">
                {formatPrice(trip.price)}* / Person
              </div>
              <div className="text-xs text-gray-600 mt-1">
                double occupancy*
              </div>
            </div>
            {trip.viewTripUrl && (
              <a
                href={trip.viewTripUrl}
                className="inline-flex items-center justify-center bg-[#2C3078] hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shrink-0 self-start md:self-auto"
              >
                View Trip
              </a>
            )}
          </div>
        );

      case "travel":
        // Same Group vs Inspirational split as the journey detail page's
        // hero card: Group gets "Check Availability" (→ the journey page,
        // which has the full Dates & Pricing tab) plus "Request a Private
        // Journey" pre-filled with the closest offer/upcoming departure;
        // Inspirational only gets "Request a Private Journey" (the
        // Inspirational Itineraries webform) + "Tailor This Journey For
        // You" — no availability/dates at all. Same markup renders for
        // both desktop and mobile (layout only differs via the md: classes
        // here), so this fix applies to both automatically.
        return (
          <div className="text-sm">
            {trip.isInspirational ? (
              <>
                <div className="flex flex-col items-center md:items-start md:flex-row md:flex-wrap gap-1 md:gap-x-2 md:gap-y-1 py-1 text-center md:text-left">
                  <span className="font-medium whitespace-nowrap">
                    Private Journey
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveFormTrip(trip)}
                    className="font-bold underline text-sm md:whitespace-nowrap"
                  >
                    Request Private Journey
                  </button>
                </div>
                <hr className="border-2 border-[#1A1A1A]" />
                <div className="flex flex-col items-center md:items-center md:flex-row gap-1 md:gap-2 py-1 text-center md:text-left">
                  <span className="font-medium whitespace-nowrap">
                    Tailor-Made
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveFormTrip(trip)}
                    className="font-bold underline text-sm md:whitespace-nowrap"
                  >
                    Tailor This Journey For You
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center md:items-start md:flex-row md:flex-wrap gap-1 md:gap-x-2 md:gap-y-1 py-1 text-center md:text-left">
                  <span className="font-medium">Group Journey</span>
                  <a
                    href={trip.viewTripUrl || `/journey/${trip.id}`}
                    className="font-bold underline text-sm"
                  >
                    Check Availability
                  </a>
                </div>
                <hr className="border-2 border-[#1A1A1A]" />
                <div className="flex flex-col items-center md:items-center md:flex-row gap-1 md:gap-2 py-1 text-center md:text-left">
                  <span className="font-medium whitespace-nowrap">
                    Private Journey
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveFormTrip(trip)}
                    className="font-bold underline text-sm md:whitespace-nowrap"
                  >
                    Request Private Journey
                  </button>
                </div>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mb-8 font-nohemi">
      <nav className="px-4 pt-6 text-[12px] font-light leading-[32px] tracking-[0.05em] text-ink max-w-[95%] md:max-w-[88.75%] mx-auto">
        <a href="/" className="hover:underline">
          Home
        </a>{" "}
        {" > "} <span>Compare Trips</span>
      </nav>

      <h1 className="text-[32px] font-semibold tracking-[0.05em] text-ink md:text-2xl md:font-bold md:tracking-normal mb-4 md:pt-8 px-4 max-w-[95%] md:max-w-[88.75%] mx-auto">
        Compare Trips
      </h1>

      <div className="w-full max-w-[95%] md:max-w-[88.75%] border-2 border-[#1A1A1A] rounded-[10px] bg-[#FAFAFA] shadow-[5px_10px_24px_rgba(26,26,26,0.1)] mb-6 mx-auto">
        {/* Header */}
        <div className="w-full md:gap-4 mt-4 md:mt-1 px-2 md:px-4 pb-3 pt-3 ml-7">
          <h2 className="text-[18px] font-medium tracking-[0.05em] text-black md:text-[20px] md:font-semibold md:tracking-normal md:text-gray-800">
            Selected Trips
          </h2>
          <p className="text-[14px] leading-[28px] tracking-[0.05em] text-[#757575]">
            Choose up to 3 trips to compare
          </p>
        </div>

        <p className="md:hidden px-2 pb-4 ml-7 text-[14px] leading-[28px] tracking-[0.05em] text-[#757575]">
          Swipe to compare between selected trips
        </p>

        <hr className="border-2 border-[#1A1A1A]" />

        <div className="flex gap-2 md:gap-4 md:mt-4 md:mt-1 md:px-2 md:px-8 pb-6">
          {/* Desktop label column — same ROWS config as the cards, so it
              can never drift out of alignment */}
          <div className="hidden md:block md:h-[700px] w-[102px] md:pl-2 shrink-0 md:w-[190px] min-[1024px]:w-[220px] min-[1280px]:w-[260px] min-[1366px]:w-[280px] min-[1440px]:w-[300px] min-[1920px]:w-[355px] md:pt-[30px]">
            {/* spacer matching card header (image + title) */}
            <div className={CARD_HEADER} />
            {ROWS.map((row) => (
              <div
                key={row.key}
                style={rowHeightStyle(row.key)}
                className={`${row.h} flex text-[13px] font-bold items-start pt-4`}
              >
                {row.label}
              </div>
            ))}
          </div>

          <div className="md:hidden w-[102px] min-w-[102px] px-2 pt-[13px] shrink-0 sticky left-0 z-20 rounded-bl-[5px] bg-[#FAFAFA] shadow-[4px_0px_15px_5px_#0000001A]">
            <div className={CARD_HEADER} />
            {ROWS.map((row) => (
              <div
                key={row.key}
                style={rowHeightStyle(row.key)}
                className={`${row.h} md:flex items-start`}
              >
                <span className="text-[12px] font-semibold leading-[18px] tracking-[0.05em] text-black">
                  {row.label}
                </span>
              </div>
            ))}
          </div>

          {/* Scroll area */}
          <div className="relative flex-1 min-w-0 w-0 flex items-center gap-2">
            {showLeftArrow && (
              <button
                onClick={scrollLeft}
                aria-label="Scroll left"
                className="hidden md:block shrink-0 cursor-pointer z-10 absolute left-0 top-1/2 -translate-y-1/2 md:static md:translate-y-0"
              >
                <Image src="/LeftArrow.svg" alt="" width={40} height={24} />
              </button>
            )}

            <div
              ref={scrollRef}
              style={{ WebkitOverflowScrolling: "touch", overflowAnchor: "none" }}
              className={`w-0 min-w-0 flex-1 flex gap-3 md:gap-[48px] overflow-x-auto md:snap-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
              
                trips.length > 0 ? "snap-x snap-mandatory" : ""
              }`}
            >
              {/* Trip Cards */}
              {trips.map((trip) => (
                <div
                  key={trip.id}
                  className="relative snap-start shrink-0 w-[248px] sm:w-[320px] md:w-[392px] bg-[#FAFAFA] border border-gray-300 shadow-[0_0_15px_rgba(0,0,0,0.1)] rounded-[10px] p-3 md:p-4 md:pt-10"
                >
                  <button
                    onClick={() => removeTrip(trip.id)}
                    aria-label={`Remove ${trip.title}`}
                    className="absolute top-1 right-[14px] z-20 w-6 h-6 rounded-full bg-[#F2E2DA] text-[#00000] flex items-center justify-center"
                  >
                    <Image src="/close.svg" alt="" width={10} height={10} />
                  </button>

                  {/* Card header: image + title, fixed height shared with
                      the label-column spacer */}
                  <div className={`${CARD_HEADER} flex flex-col`}>
                    <div className="relative h-[170px] md:h-[213px] rounded-lg overflow-hidden shrink-0 pt-[30px] md:pt-0">
                      <div className="relative h-[140px] md:w-[349px] md:h-[213px] overflow-hidden shrink-0 mx-auto">
                        <Image
                          src={trip.image}
                          alt={trip.title}
                          fill
                          sizes="(max-width: 768px) 82vw, 349px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </div>
                    <h3 className="text-left font-semibold text-[21px] leading-[32px] tracking-[0.05em] mt-2 line-clamp-2">
                      {trip.title}
                    </h3>
                  </div>

                  {/* Comparison rows */}
                  {ROWS.map((row) => (
                    <div
                      key={row.key}
                      style={rowHeightStyle(row.key)}
                      className={`${row.h} ${
                        row.key === "itinerary" ||
                        row.key === "stays" ||
                        row.key === "travel" ||
                        row.key === "price"
                          ? "overflow-visible"
                          : "overflow-hidden"
                      }`}
                    >
                      {renderRowContent(trip, row.key)}
                    </div>
                  ))}
                </div>
              ))}

              {/* Add trip card */}
              {trips.length < MAX_COMPARE_TRIPS && (
                <div
                  // for navigating to previous page from compare trips
                  // onClick={() => {
                  //   localStorage.setItem("isAddingTrip", "true");
                  //   const returnPage =
                  //     sessionStorage.getItem("comparisonReturnPage") ||
                  //     localStorage.getItem("compareSourcePage") ||
                  //     "/itinerary";
                  //   console.log("comparisonReturnPage:", sessionStorage.getItem("comparisonReturnPage"));
                  //   console.log("compareSourcePage:", localStorage.getItem("compareSourcePage"));
                  //   console.log("returnPage:", returnPage);
                  //   router.push(returnPage);
                  // }}
                  onClick={() => {
                    localStorage.setItem("isAddingTrip", "true");
                    router.push("/itinerary");
                  }}
                  className="relative snap-start shrink-0 w-[82vw] sm:w-[320px] md:w-[392px] min-h-[400px] border-2 border-dashed border-[#1A1A1A] rounded-[10px] shadow-[0px_10px_15px_rgba(0,0,0,0.1)] flex flex-col items-center justify-start gap-[120px] cursor-pointer"
                >
                  <p className="font-semibold text-lg text-center mt-[12rem] px-4">
                    + Add trip to compare
                  </p>
                </div>
              )}
            </div>

            {showRightArrow && (
              <button
                onClick={scrollRight}
                aria-label="Scroll right"
                className="hidden md:block shrink-0 cursor-pointer z-10 absolute right-0 top-1/2 -translate-y-1/2 md:static md:translate-y-0"
              >
                <Image src="/RightArrow.svg" alt="" width={40} height={24} />
              </button>
            )}
          </div>
        </div>
      </div>

      <PrivateInquiryForm
        isOpen={Boolean(activeFormTrip)}
        onClose={() => setActiveFormTrip(null)}
        onSubmit={(data) =>
          console.log("Private journey inquiry submitted:", data)
        }
        journey={activeFormTrip?.formJourney}
        departure={
          activeFormTrip?.isInspirational
            ? undefined
            : activeFormTrip?.priorityDeparture
        }
        showDepartureDate={!activeFormTrip?.isInspirational}
        label={
          activeFormTrip?.isInspirational
            ? "Inspirational Itineraries Form"
            : undefined
        }
      />
    </div>
  );
}