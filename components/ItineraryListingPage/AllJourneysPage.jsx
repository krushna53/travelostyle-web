"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import FilterSidebar from "./FilterSidebar";
import SortBar from "./SortBar";
import JourneyGrid from "./JourneyGrid";
import Pagination from "./Pagination";
import MobileFilters from "./MobileFilters";
import { slugify } from "@/lib/slugify";
import { API_BASE_URL, buildFileUrl } from "@/lib/config";
import { matchesBudget } from "@/lib/budgetRanges";

// Resolves the ISO country code from a journey's starting-location
// reference (node--location -> field_address.country_code), used only
// to filter journeys clicked from the homepage map — not shown as a
// filter option in the sidebar.
function resolveCountryCode(rel, included) {
  const id = rel?.data?.id;

  if (!id) return "";

  const node = included.find(
    (inc) => inc.type === "node--location" && inc.id === id,
  );

  return node?.attributes?.field_address?.country_code || "";
}

export default function AllJourneysPage() {
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

  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const [filterOptions, setFilterOptions] = useState({
    region: [],
    style: [],
    offer: [],
    category: [],
    month: [],
  });

  const [sort, setSort] = useState("Recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // ================= JOURNEYS FETCH =================
  useEffect(() => {
    async function loadJourneys() {
      try {
        setLoading(true);

        // Drupal's JSON:API caps a single response at 50 resources by
        // default. A one-shot fetch (the old code) silently drops every
        // journey past that first page — on a dev/test site with a lot
        // of seed content, newly-created journeys are exactly the ones
        // most likely to land past that cutoff and vanish from every
        // listing/filter with no error anywhere. Follow `links.next`
        // until Drupal stops returning one, merging `data` + `included`
        // from every page.
        let nextUrl = `${API_BASE_URL}/jsonapi/node/journey?include=field_journey_image.field_media_image,field_journey_tag,field_month,field_category,field_region,field_starts_in`;
        let allData = [];
        let allIncluded = [];

        while (nextUrl) {
          const res = await fetch(nextUrl);
          const pageJson = await res.json();

          allData = allData.concat(pageJson.data || []);
          allIncluded = allIncluded.concat(pageJson.included || []);
          nextUrl = pageJson.links?.next?.href || null;
        }

        const json = { data: allData, included: allIncluded };

        console.log(
  "Relationships:",
  json.data?.[0]?.relationships
);
        console.log("Journey API (all pages):", json.data.length, "journeys");
        const included = json.included || [];
        console.log(
  "Region terms:",
  included.filter(
    (i) => i.type === "taxonomy_term--region"
  )
);

const drupalJourneys = (json.data || []).map((item, index) => {
            const mediaId = item.relationships?.field_journey_image?.data?.id;

          const mediaEntity = included.find(
            (inc) => inc.type === "media--image" && inc.id === mediaId,
          );
          // field_month can be a multi-value taxonomy reference (a
          // journey may run across several months), so `.data` can be
          // either a single relationship object or an array — reading it
          // as `.data?.id` unconditionally (the old code) silently broke
          // for any multi-value field: `.id` on an array is undefined,
          // so monthId was always undefined and monthName was always ""
          // for every journey, which made the month filter match nothing.
          const monthRelationship = item.relationships?.field_month?.data;
          const monthRefs = Array.isArray(monthRelationship)
            ? monthRelationship
            : monthRelationship
              ? [monthRelationship]
              : [];

          const monthNames = monthRefs
            .map((ref) => {
              const monthEntity = included.find(
                (inc) => inc.type === "taxonomy_term--month" && inc.id === ref.id,
              );
              return monthEntity?.attributes?.name || "";
            })
            .filter(Boolean);
          const fileId =
            mediaEntity?.relationships?.field_media_image?.data?.id;

          const fileEntity = included.find(
            (inc) => inc.type === "file--file" && inc.id === fileId,
          );

          const rawUrl = fileEntity?.attributes?.uri?.url;

         const imageUrl = buildFileUrl(rawUrl) || "/GoldenTriange.svg";

          const tagData = item.relationships?.field_journey_tag?.data;

          const tagArray = Array.isArray(tagData)
            ? tagData
            : tagData
              ? [tagData]
              : [];

          // field_journey_tag references the "Journey Style" vocabulary,
          // whose JSON:API resource type is taxonomy_term--journey_style —
          // taxonomy_term--tags is also accepted for safety. Resolve name
          // and id together from the matched `included` entity so a
          // dangling reference to a deleted/unpublished term (present in
          // the relationship but absent from `included`) never makes it
          // into tagIds — that's what was getting forwarded to the
          // inquiry-form webform and triggering its "referenced entity
          // does not exist" validation error.
          const resolvedTags = tagArray
            .map((tag) => {
              const tagEntity = included.find(
                (inc) =>
                  (inc.type === "taxonomy_term--tags" ||
                    inc.type === "taxonomy_term--journey_style") &&
                  inc.id === tag.id,
              );
              const name = tagEntity?.attributes?.name;
              const id =
                tag.meta?.drupal_internal__target_id ??
                tagEntity?.attributes?.drupal_internal__tid;
              return name ? { id, name } : null;
            })
            .filter(Boolean);

          const tagNames = resolvedTags.map((t) => t.name);
          const tagIds = resolvedTags.map((t) => t.id).filter((id) => id != null);

          const cta = item.attributes?.field_cta;

          // Use Drupal's real Pathauto-generated alias as-is (already present
          // on every node's JSON:API "path" attribute, no include needed) so
          // this link always matches whatever URL pattern Drupal is
          // currently configured with, without hardcoding a prefix here.
          // Fall back to a client-computed slug only if path/alias is missing.
          const alias = item.attributes?.path?.alias || "";
          let viewTripUrl = alias || `/journey/${slugify(item.attributes.title || "")}`;

          if (cta?.uri && !cta.uri.startsWith("entity:")) {
            viewTripUrl = cta.uri;
          }
          const regionRelationship =
  item.relationships?.field_region?.data ||
  item.relationships?.field_country?.data;

const regionArray = Array.isArray(regionRelationship)
  ? regionRelationship
  : regionRelationship
    ? [regionRelationship]
    : [];

const regionNames = regionArray
  .map((relation) => {
    const regionEntity = included.find(
      (inc) =>
        inc.id === relation.id &&
        (
          inc.type === "taxonomy_term--region" ||
          inc.type === "taxonomy_term--country"
        )
    );

    return regionEntity?.attributes?.name || "";
  })
  .filter(Boolean);

const regionName = regionNames[0] || "";

console.log("REGION DEBUG:", {
  title: item.attributes?.title,
  fieldRegion: item.relationships?.field_region,
  fieldCountry: item.relationships?.field_country,
  regionName,
  includedRegions: included.filter(
    (inc) =>
      inc.type === "taxonomy_term--region" ||
      inc.type === "taxonomy_term--country"
  ),
});

          // field_category is a taxonomy-term relationship, not a plain
          // attribute — resolved the same way as region/tags above (a
          // journey can carry more than one category).
          const categoryRelationship = item.relationships?.field_category?.data;

          const categoryArray = Array.isArray(categoryRelationship)
            ? categoryRelationship
            : categoryRelationship
              ? [categoryRelationship]
              : [];

          const categoryNames = categoryArray
            .map((relation) => {
              const categoryEntity = included.find(
                (inc) =>
                  inc.id === relation.id &&
                  inc.type === "taxonomy_term--category"
              );

              return categoryEntity?.attributes?.name || "";
            })
            .filter(Boolean);

          return {
            id: item.id,
            title: item.attributes.title || "",
            desc: item.attributes.field_short_description || "",

            days: `${item.attributes.field_duration_days || 0} Days | ${
              item.attributes.field_duration_nights || 0
            } Nights`,

            destinations: `${
              item.attributes.field_destinations_count || 0
            } Destinations`,

           price: Number(item.attributes.field_offer_price) || 0,
originalPrice: Number(item.attributes.field_original_price) || 0,
offer: item.attributes.field_offer_message || "",
            image: imageUrl,

            tags: tagNames,
            style: tagNames[0] || "Group Journey",
            region: regionName,
            countryCode: resolveCountryCode(
              item.relationships?.field_starts_in,
              included,
            ),
            category: categoryNames,
            month: monthNames,

            viewTripUrl,
            viewTripText: cta?.title || "View Trip",

            active: index === 0,
          };
        });

        setJourneys(drupalJourneys);
        console.log("Final journeys:", drupalJourneys);
        
      } catch (error) {
        console.error("API ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    loadJourneys();
  }, []);

  // ================= FILTER OPTIONS =================
  useEffect(() => {
    async function loadFilters() {
      try {
        const endpoints = {
   region: `${API_BASE_URL}/jsonapi/taxonomy_term/region?sort=-drupal_internal__tid`,
  style: `${API_BASE_URL}/jsonapi/taxonomy_term/tags?sort=-drupal_internal__tid`,
  offer: `${API_BASE_URL}/jsonapi/taxonomy_term/offers?sort=-drupal_internal__tid`,
  category: `${API_BASE_URL}/jsonapi/taxonomy_term/category?sort=-drupal_internal__tid`,
  month: `${API_BASE_URL}/jsonapi/taxonomy_term/month?sort=-drupal_internal__tid`,
};

        const results = {};
        console.log(endpoints);
        for (const key in endpoints) {
          const res = await fetch(endpoints[key]);
          const json = await res.json();

          results[key] = (json.data || []).map(
            (item) => item?.attributes?.name,
          );
        }

        setFilterOptions(results);
      } catch (err) {
        console.error("Filter API error:", err);
      }
    }

    loadFilters();
  }, []);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading journeys...
      </div>
    );
  }

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
    <div className="min-h-screen bg-[#fafafa] font-sans px-4 pb-24 md:px-14 md:pb-0">
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

      <div className="hidden md:flex gap-[2vw] py-[0.8vw] items-start">
        {/* Breadcrumb — aligns with filter sidebar column */}
        <div className="w-[300px] shrink-0">
          <nav className="text-[0.72vw] text-[#888]">
            <span>home</span>
            <span className="mx-[0.3vw]">&gt;</span>
            <span className="text-ink font-medium">all journeys</span>
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

      <div className="flex gap-[2vw] pb-[3vw]">
        <div className="hidden md:block">
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
            <div className="flex flex-col gap-2 items-start md:items-center justify-center py-12 md:py-[6vw] text-left md:text-center">
              <img
                src="/no-results.svg"
                alt="No journeys found"
                className="mb-8 w-40 md:w-[18vw] h-auto mx-auto"
              />

              <h3 className="font-[Nohemi] font-medium text-[20px] md:text-[32px] leading-[28px] md:leading-[40px] tracking-[0.05em] text-left md:text-center text-ink mt-4 md:mt-8">
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
                className="h-11 px-6 md:h-[2.25vw] md:min-w-[10.5vw] rounded-full bg-[#2E348D] text-sm md:text-[0.9vw] text-white transition hover:bg-[#252b78] mt-2"
              >
                Explore All Journeys
              </button>
              <div className="w-full mt-10 md:mt-16 bg-white">
                <div className="border-b-2 border-ink mb-6">
                  <h2 className="text-left text-lg md:text-[24px] font-medium pb-2 border-b-2">
                    Popular Journeys
                  </h2>
                </div>

                <JourneyGrid journeys={popularJourneys} />
              </div>
            </div>
         ) : (
  <div className="bg-white">
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