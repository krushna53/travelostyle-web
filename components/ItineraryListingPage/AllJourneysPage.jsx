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
    <div className="min-h-screen bg-[#fafafa] font-sans px-4 pb-24 md:px-[108px] md:pb-0">
      {/* MOBILE-ONLY: breadcrumb + result count + clear all */}
      <div className="pt-4 pb-3 md:hidden">
        <nav className="text-xs text-[#888]">
          <span>Home</span>
          <span className="mx-1">&gt;</span>
          <span className="text-ink font-medium">All Journeys</span>
        </nav>

        {/* Script heading with the beige highlight sitting behind each line
            (per Figma). inline decoration-clone keeps the band tight to the
            glyphs and wrapping onto three lines, rather than one flat block. */}
        <h1 className="ml-5 mt-5 w-full font-taprom text-[40px] relative z-0 font-normal leading-[1.3] tracking-[0.02em] text-ink flex flex-col items-start gap-3">
          <span className="inline-block" style={{ backgroundColor: "#f6dbc9", padding: "2px 4px" }}>
            We&apos;ve never believed
          </span>
          <span className="inline-block" style={{ backgroundColor: "#f6dbc9", padding: "2px 4px" }}>
            in a one-size-fits-
          </span>
          <span className="inline-block" style={{ backgroundColor: "#f6dbc9", padding: "2px 4px" }}>
           all approach to the
          </span>
          <span className="inline-block" style={{ backgroundColor: "#f6dbc9", padding: "2px 4px" }}>
            world
          </span>
        </h1>

        <div className="mt-[48px] md:mt-6 flex items-center justify-between border-b-2 border-ink pb-3">
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
            <div className="flex flex-col gap-2 items-start md:items-center justify-center py-12 md:py-[115px] text-left md:text-center">
              <img
                src="/no-results.svg"
                alt="No journeys found"
                className="mb-8 w-40 md:w-[346px] h-auto mx-auto"
              />

              <h3 className="font-medium text-[20px] md:text-[32px] leading-[28px] md:leading-[40px] tracking-[0.05em] text-left md:text-center text-ink mt-4 md:mt-8">
                Sorry! We were unable to find the{" "}
                <br className="hidden md:inline" />the trip you requested.
              </h3>
              <p className="max-w-[520px] font-normal text-[14px] md:text-[16px] leading-[22px] md:leading-[100%] tracking-[0.05em] text-left md:text-center text-ink md:mt-2">
                Please adjust your filters to find a trip 
                <br />
                that fits you
              </p>

              <div className="my-4 font-normal text-[14px] md:text-[16px] leading-[100%] tracking-[0.05em] text-left md:text-center text-ink md:mt-2">
                OR
              </div>

              <button
                onClick={clearAllFilters}
                className="h-11 px-6 md:h-[43px] md:min-w-[202px] rounded-full bg-[#2E348D] text-sm md:text-[17px] text-white transition hover:bg-[#252b78] mt-2"
              >
                Explore All Journeys
              </button>
              <div className="w-full mt-10 md:mt-16 ">
                <div className="border-b-2 border-ink mb-6">
                  <h2 className="text-left font-normal text-[21px] leading-[100%] tracking-[5%] pb-2 border-b-2">
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