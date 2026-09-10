"use client";

import { useState } from "react";
import { ListFilter, ArrowUpDown, X, Check } from "lucide-react";
import { BUDGET_RANGES } from "@/lib/budgetRanges";
import {
  CheckboxItem,
  DURATION_OPTIONS,
  getFilterCount,
} from "./FilterSidebar";
import { SORT_OPTIONS } from "./SortBar";

// Tabs shown down the left side of the sheet, in wireframe order. "sort"
// isn't a `filters` key — it's handled separately below — everything else
// maps straight onto `filters[key]` / `filterOptions[key]`.
const TABS = [
  { key: "style", label: "Travel Style" },
  { key: "pricing", label: "Travel Budget" },
  { key: "duration", label: "Duration" },
  { key: "offer", label: "Offers" },
  { key: "region", label: "Region" },
  { key: "category", label: "Category" },
  { key: "month", label: "Month" },
  { key: "sort", label: "Sort By" },
];

export default function MobileFilters({
  filters,
  setFilters,
  filterOptions,
  journeys,
  sort,
  setSort,
  resultCount,
  onClearAll,
}) {
  const [openSheet, setOpenSheet] = useState(null); // "filters" | "sort" | null
  const [activeTab, setActiveTab] = useState("style");
  const [showMoreCategories, setShowMoreCategories] = useState(false);

  const activeFilterCount = [
    "region",
    "style",
    "offer",
    "category",
    "month",
    "pricing",
    "duration",
  ].reduce((total, key) => total + (filters[key]?.length || 0), 0);

  const openFilters = () => {
    setActiveTab("style"); // first tab, per the "Filters" button
    setOpenSheet("filters");
  };

  const openSort = () => {
    setActiveTab("sort"); // "Sort By" tab, per the "Sort by" button
    setOpenSheet("sort");
  };

  const close = () => setOpenSheet(null);

  const toggleFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value],
    }));
  };

  const getCount = (key, value) => getFilterCount(journeys, key, value);

  const renderTabContent = () => {
    switch (activeTab) {
      case "style":
        return (
          <>
            <p className="mb-2 text-sm text-[#888]">Filter by travel style</p>
            {(filterOptions.style || []).map((item) => (
              <CheckboxItem
                key={item}
                label={item}
                count={getCount("style", item)}
                checked={filters.style.includes(item)}
                onChange={() => toggleFilter("style", item)}
                mobile
              />
            ))}
          </>
        );

      case "pricing":
        return (
          <>
            <p className="mb-2 text-sm text-[#888]">Filter by travel budget</p>
            {BUDGET_RANGES.map((range) => (
              <CheckboxItem
                key={range.value}
                label={range.label}
                count={getCount("pricing", range.value)}
                checked={filters.pricing.includes(range.value)}
                onChange={() => toggleFilter("pricing", range.value)}
                mobile
              />
            ))}
          </>
        );

      case "duration":
        return (
          <>
            <p className="mb-2 text-sm text-[#888]">Filter by duration</p>
            {DURATION_OPTIONS.map((item) => (
              <CheckboxItem
                key={item}
                label={item}
                count={getCount("duration", item)}
                checked={filters.duration.includes(item)}
                onChange={() => toggleFilter("duration", item)}
                mobile
              />
            ))}
          </>
        );

      case "offer":
        return (
          <>
            <p className="mb-2 text-sm text-[#888]">Filter by offers</p>
            {(filterOptions.offer || []).map((item) => (
              <CheckboxItem
                key={item}
                label={item}
                count={getCount("offer", item)}
                checked={filters.offer.includes(item)}
                onChange={() => toggleFilter("offer", item)}
                mobile
              />
            ))}
          </>
        );

      case "region":
        return (
          <>
            <p className="mb-2 text-sm text-[#888]">Filter by region</p>
            {(filterOptions.region || []).map((item) => (
              <CheckboxItem
                key={item}
                label={item}
                count={getCount("region", item)}
                checked={filters.region.includes(item)}
                onChange={() => toggleFilter("region", item)}
                mobile
              />
            ))}
          </>
        );

      case "category": {
        const categories = filterOptions.category || [];
        const visible = showMoreCategories ? categories : categories.slice(0, 7);

        return (
          <>
            <p className="mb-2 text-sm text-[#888]">Filter by category</p>
            {visible.map((item) => (
              <CheckboxItem
                key={item}
                label={item}
                count={getCount("category", item)}
                checked={filters.category.includes(item)}
                onChange={() => toggleFilter("category", item)}
                mobile
              />
            ))}

            {categories.length > 7 && (
              <button
                onClick={() => setShowMoreCategories((prev) => !prev)}
                className="mt-2 text-sm text-ink underline"
              >
                {showMoreCategories
                  ? "See Less"
                  : `See ${categories.length - 7} more`}
              </button>
            )}
          </>
        );
      }

      case "month":
        return (
          <>
            <p className="mb-2 text-sm text-[#888]">Filter by month</p>
            {(filterOptions.month || []).map((month) => (
              <CheckboxItem
                key={month}
                label={month}
                count={getCount("month", month)}
                checked={filters.month.includes(month)}
                onChange={() => toggleFilter("month", month)}
                mobile
              />
            ))}
          </>
        );

      case "sort":
        return (
          <>
            <p className="mb-2 text-sm text-[#888]">Sort By</p>
            {SORT_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => setSort(option)}
                className="flex w-full items-center gap-3 py-2 text-left text-sm text-[#333]"
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-[1.5px] ${
                    sort === option ? "border-ink" : "border-[#C9C9C9]"
                  }`}
                >
                  {sort === option && (
                    <span className="h-2 w-2 rounded-full bg-ink" />
                  )}
                </span>
                {option}
              </button>
            ))}
          </>
        );

      default:
        return null;
    }
  };

  const sheetOpen = openSheet === "filters" || openSheet === "sort";

  return (
    <div className="md:hidden">
      {/* FIXED BOTTOM BAR */}
      <div className="fixed bottom-4 right-4 left-0 w-[calc(100%-2px)] z-40 flex divide-x divide-ink overflow-hidden rounded-t-xl border border-ink bg-white shadow-lg">
        <button
          onClick={openFilters}
          className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-ink"
        >
          <ListFilter size={15} />
          Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
        </button>

        <button
          onClick={openSort}
          className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-ink"
        >
          <ArrowUpDown size={15} />
          Sort by
        </button>
      </div>

      {/* SHARED FILTER / SORT SHEET */}
      {sheetOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={close} />

          <div className="absolute bottom-0 left-0 right-0 flex h-[92vh] flex-col overflow-hidden rounded-t-1xl bg-white">
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-[#E8E8E8] px-4 py-2">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <ListFilter size={15} />
                Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={onClearAll}
                  className="font-medium text-[14px] leading-[100%] tracking-[0] underline"
                >
                  Clear All Filters
                </button>
                <button onClick={close}>
                  <X size={18} className="text-[#555]" />
                </button>
              </div>
            </div>

            {/* BODY: left tab list + right content pane */}
            <div className="flex min-h-0 flex-1 gap-2 overflow-hidden">
              <div className="no-scrollbar h-full min-h-0 w-[38%] shrink-0 overflow-y-auto bg-[#F2D5C4] pt-2">
                <label className="flex cursor-pointer items-start gap-2 border-b border-[#B08968] px-3 py-1.5 text-left text-xl text-[#444]">
                  <input
                    type="checkbox"
                    checked={filters.displayAllOffers}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        displayAllOffers: e.target.checked,
                      }))
                    }
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 cursor-pointer accent-[#2f2d89]"
                  />
                  <span className="max-w-[62px] text-xs leading-tight text-[#444]">
                    Display all offers
                  </span>
                </label>

                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`block w-full border-b border-[#B08968] px-3 py-2 text-left text-xs ${
                      activeTab === tab.key
                        ? "bg-white font-semibold text-ink"
                        : "text-[#444]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-3">
                {renderTabContent()}
              </div>
            </div>

            {/* FOOTER — top corners rounded, bottom flush (sits right at
                the bottom of the sheet), no wrapper border/padding. */}
            <div>
              <div className="flex divide-x divide-ink overflow-hidden rounded-t-xl border-2 border-ink">
                <button
                  onClick={close}
                  className="flex-1 py-3 text-sm font-semibold text-ink"
                >
                  Close
                </button>
                <button
                  onClick={close}
                  className="flex-1 py-3 text-sm font-semibold text-ink"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
