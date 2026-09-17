"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import FilterSidebar from "./FilterSidebar";
import SortBar from "./SortBar";
import JourneyGrid from "./JourneyGrid";
import Pagination from "./Pagination";
import MobileFilters from "./MobileFilters";
import { matchesBudget } from "@/lib/budgetRanges";

const EMPTY_FILTER_OPTIONS = {
  region: [],
  style: [],
  offer: [],
  category: [],
  month: [],
};

// `initialJourneys`/`initialFilterOptions` are fetched server-side (see
// app/itinerary/page.tsx + lib/allJourneys.js) and handed down as props —
// this used to fetch them itself in a useEffect, which ran in the browser
// and always failed against the ddev backend's self-signed cert
// (ERR_CERT_AUTHORITY_INVALID). The server's fetch honors
// NODE_TLS_REJECT_UNAUTHORIZED, so doing it there works.
export default function AllJourneysPage({
  initialJourneys = [],
  initialFilterOptions = EMPTY_FILTER_OPTIONS,
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [countryFilter, setCountryFilter] = useState(null);

  useEffect(() => {
    const countryParam = searchParams.get("country");
    if (countryParam) {
      setCountryFilter(countryParam);
    }
  }, [searchParams]);

  const [journeys] = useState(initialJourneys);

  const [filters, setFilters] = useState({
    displayAllOffers: true,
    region: [],
    style: [],
    offer: [],
    category: [],
    month: [],
    pricing: [], // ✅ added
    duration: [], // ✅ added
  });

  const [filterOptions] = useState(initialFilterOptions);

  const [sort, setSort] = useState("Recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);
  // ================= FILTER =================

  const filteredJourneys = useMemo(() => {
    let data = [...journeys];

    if (countryFilter) {
      data = data.filter(
        (item) =>
          (item.countryCode || "").toUpperCase() ===
          countryFilter.toUpperCase(),
      );
    }

    if (!filters.displayAllOffers) {
      data = data.filter((item) => !item.offer);
    }

   if (filters.region.length) {
  data = data.filter((item) => {
    const journeyRegion = String(item.region || "")
      .trim()
      .toLowerCase();

    return filters.region.some(
      (region) =>
        String(region || "").trim().toLowerCase() === journeyRegion
    );
  });
}

    if (filters.style.length) {
      data = data.filter((item) =>
        item.tags?.some((t) => filters.style.includes(t)),
      );
    }

    if (filters.offer.length) {
      data = data.filter((item) => filters.offer.includes(item.offer));
    }

    if (filters.category.length) {
      data = data.filter((item) =>
        item.category?.some((c) => filters.category.includes(c)),
      );
    }

    if (filters.month.length) {
      data = data.filter((item) =>
        item.month?.some((m) => filters.month.includes(m)),
      );
    }

    if (filters.pricing.length) {
      data = data.filter((item) =>
        filters.pricing.some((range) => matchesBudget(item.price, range)),
      );
    }

    if (filters.duration.length) {
      data = data.filter((item) => {
        const days = parseInt(item.days?.split(" ")[0] || 0);

        return filters.duration.some((range) => {
          if (range === "5–8 Days") return days >= 5 && days <= 8;
          if (range === "8–15 Days") return days >= 8 && days <= 15;
          if (range === "15–25 Days") return days >= 15 && days <= 25;
          if (range === "25+ Days") return days >= 25;
          return true;
        });
      });
    }

    // SORTING
    if (sort === "Price: Low to High") {
      data.sort((a, b) => a.price - b.price);
    }

    if (sort === "Price: High to Low") {
      data.sort((a, b) => b.price - a.price);
    }

    return data;
  }, [journeys, filters, sort, countryFilter]);
  const hasActiveFilters =
  filters.region.length > 0 ||
  filters.style.length > 0 ||
  filters.offer.length > 0 ||
  filters.category.length > 0 ||
  filters.month.length > 0 ||
  filters.pricing.length > 0 ||
  filters.duration.length > 0 ||
  !!countryFilter;
  const isNoResults = filteredJourneys.length === 0 && hasActiveFilters;
  const totalPages = Math.ceil(filteredJourneys.length / itemsPerPage);

  const paginatedJourneys = filteredJourneys.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const popularJourneys = journeys.slice(0, 6);

  const clearAllFilters = () => {
    setFilters({
      displayAllOffers: true,
      region: [],
      style: [],
      offer: [],
      category: [],
      month: [],
      pricing: [],
      duration: [],
    });
    setCountryFilter(null);
    if (searchParams.get("country")) {
      router.replace(pathname);
    }
  };

  return (
    <div className="min-h-screen bg-white md:bg-[#fafafa] font-sans px-4 pb-24 md:px-[108px] md:pb-0">
      {/* White on mobile: the journey cards' surface is #FAFAFA (card-bg), the
          same as this page's desktop background, so on #fafafa they vanished
          into the page. On white they read the way they do on the home page. */}
      {/* MOBILE-ONLY: breadcrumb + result count + clear all */}
      {/* --fig-u is the 390 board's unit (1px at 390, growing with the phone
          up to the md breakpoint), so the script heading and its bars keep
          the board's proportions on wider phones instead of sitting at a
          fixed 40px in the corner of a 754px screen. */}
      <div
        className="pt-4 pb-3 md:hidden"
        style={{ "--fig-u": "calc(100vw / 390)" }}
      >
        <nav className="text-xs text-[#888]">
          <span>Home</span>
          <span className="mx-1">&gt;</span>
          <span className="text-ink font-medium">All Journeys</span>
        </nav>

        {/* "RES_Itinerary Listing Page", 390 board: Taprom 40/48/5% #1A1A1A,
            left-aligned with the words at x 32 (the page padding is 16), cap
            tops 169/217/265/313. Rectangles 1049-1051 are 336x32 and 1052
            109x32, all from x 27 -- fixed-width bars, not word-hugging ones --
            stepping down 51px apiece, so each sits a little lower on its line
            than the one before (.hero-bar-itin-m1..4). */}
        {/* "RES_No Search Hits" swaps the heading for "Hear from those who've
            travelled with us" (Rectangles 1049-1051: 275, 275 and 131 wide,
            tops 155/206/257), sitting 12px higher, with the results rule
            5px closer under it. On that board the words start at x 27, flush
            with their bars -- not 32 as on the listing -- which is what leaves
            the room after "those", "travelled" and "us". */}
        <h1 className={`relative z-10 font-taprom text-[calc(40*var(--fig-u))] leading-[calc(48*var(--fig-u))] tracking-[0.05em] font-normal text-[#1A1A1A] ${isNoResults ? "ml-[calc(27*var(--fig-u)-16px)] mt-[calc(12*var(--fig-u))]" : "ml-[calc(32*var(--fig-u)-16px)] mt-[calc(24*var(--fig-u))]"}`}>
          {(isNoResults
            ? ["Hear from those", "who’ve travelled", "with us"]
            : ["We’ve never believed", "in a one-size-fits-", "all approach to the", "world"]
          ).map((line, i) => (
            <span key={line} className="block">
              <span className={`sub-title-bg inline-block whitespace-nowrap ${isNoResults ? `hero-bar-nohits-m hero-bar-nohits-m${i + 1}` : `hero-bar-itin-m hero-bar-itin-m${i + 1}`}`}>
                {line}
              </span>
            </span>
          ))}
        </h1>

        <div className={`${isNoResults ? "mt-[calc(40*var(--fig-u))]" : "mt-[calc(45*var(--fig-u))]"} md:mt-6 flex items-center justify-between border-b-2 border-ink pb-3`}>
          <span className="text-sm text-[#888]">
            {filteredJourneys.length} trips found
          </span>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm font-medium text-ink underline underline-offset-4"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      <div className="hidden md:flex gap-[69px] max-[1910px]:gap-[69px] max-[1700px]:gap-[61px] max-[1500px]:gap-[54px] max-[1281px]:gap-[46px] max-[1250px]:gap-[45px] max-[1200px]:gap-[43px] py-[15px] items-start">
        {/* Breadcrumb — aligns with filter sidebar column */}
        <div className="w-[371px] max-[1910px]:w-[369px] max-[1700px]:w-[328px] max-[1500px]:w-[290px] max-[1281px]:w-[248px] max-[1250px]:w-[242px] max-[1200px]:w-[232px] shrink-0">
          <nav className="font-light text-[14px] leading-[32px] tracking-[5%]  text-[#888]">
            <span>home</span>
            <span className="mx-[6px]">&gt;</span>
            <span className="font-light text-[14px] leading-[32px] tracking-[5%] ">all journeys</span>
          </nav>
        </div>
        {/* Sort bar aligned with grid column */}
        <div className="flex-1 min-w-0">
          <SortBar
            resultCount={filteredJourneys.length}
            selected={sort}
            setSelected={setSort}
            filters={filters}
            setFilters={setFilters}
          />
        </div>
      </div>

      <div className="flex gap-[69px] max-[1910px]:gap-[69px] max-[1700px]:gap-[61px] max-[1500px]:gap-[54px] max-[1281px]:gap-[46px] max-[1250px]:gap-[45px] max-[1200px]:gap-[43px] pb-[58px]">
        <div className="hidden md:block shrink-0 w-[371px] max-[1910px]:w-[369px] max-[1700px]:w-[328px] max-[1500px]:w-[290px] max-[1281px]:w-[248px] max-[1250px]:w-[242px] max-[1200px]:w-[232px]">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            filterOptions={filterOptions}
             journeys={journeys}
            onClearAll={clearAllFilters}
          />
        </div>

        <div className="flex-1 min-w-0">
        {filteredJourneys.length === 0 && hasActiveFilters ? (
            <div className="flex flex-col gap-2 items-start md:items-center justify-center pt-[16px] pb-12 md:py-[115px] text-left md:text-center">
              {/* Mobile spacing is "RES_No Search Hits" (390): illustration
                  176 wide with its drawing 29 under the rule (the SVG carries
                  ~13px of empty space above it, hence pt 16), copy 21/32 then 16/24, OR, a
                  224x37 button, and "Popular Journeys" 108 below it. */}
              <img
                src="/no-results.svg"
                alt="No journeys found"
                className="mb-0 md:mb-8 w-[176px] md:w-[346px] h-auto mx-auto"
              />

              <h3 className="font-medium text-[21px] md:text-[32px] leading-[32px] md:leading-[40px] tracking-[0.05em] text-left md:text-center text-ink mt-[11px] md:mt-8">
                Sorry! We were unable to find{" "}
                <br className="hidden md:inline" />the trip you requested.
              </h3>
              <p className="max-w-[321px] md:max-w-[520px] font-normal text-[16px] leading-[24px] md:leading-[100%] tracking-[0.05em] text-left md:text-center text-ink mt-[5px] md:mt-2">
                Please adjust your filters to find a trip{" "}
                <br className="hidden md:inline" />
                that fits you
              </p>

              <div className="mt-4 mb-[10px] md:my-4 font-normal text-[16px] leading-[100%] tracking-[0.05em] text-left md:text-center text-ink md:mt-2">
                OR
              </div>

              <button
                onClick={clearAllFilters}
                className="h-[37px] w-[224px] font-semibold tracking-[0.05em] text-[18px] md:w-auto md:font-normal md:tracking-normal md:px-6 md:h-[43px] md:min-w-[202px] rounded-full bg-[#2C3078] md:bg-[#2E348D] md:text-[17px] text-white transition hover:bg-[#252b78] mt-0 md:mt-2"
              >
                Explore All Journeys
              </button>
              <div className="w-full mt-[100px] md:mt-16">
                <div className="border-b-2 border-ink mb-6">
                  <h2 className="text-left font-normal text-[16px] md:text-[21px] leading-[100%] tracking-[0.05em] pb-[14px] md:pb-2">
                    Popular Journeys
                  </h2>
                </div>

                <JourneyGrid journeys={popularJourneys} />
              </div>
            </div>
         ) : (
  <div>
    <JourneyGrid journeys={paginatedJourneys} />

    <Pagination
      totalPages={totalPages}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    />
  </div>
)}
        </div>
      </div>

      <MobileFilters
        filters={filters}
        setFilters={setFilters}
        filterOptions={filterOptions}
        journeys={journeys}
        sort={sort}
        setSort={setSort}
        resultCount={filteredJourneys.length}
        onClearAll={clearAllFilters}
      />
    </div>
  );
}