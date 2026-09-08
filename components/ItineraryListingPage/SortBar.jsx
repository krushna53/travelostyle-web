"use client";

import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import ActiveFilters from "./ActiveFilters";

export const SORT_OPTIONS = [
  "Recommended",
  "Price: Low to High",
  "Price: High to Low",
];

export default function SortBar({
  resultCount,
  selected,
  setSelected,
  filters,
  setFilters,
}) {
  const [sortOpen, setSortOpen] = useState(false);

  const hasActiveFilters = Object.entries(filters).some(
    ([, v]) => Array.isArray(v) && v.length > 0
  );

  return (
    <div className="pb-[12px]">
      {/* Row 1: count + sort */}
      <div className="flex items-center justify-between pb-[12px]">
        <span className="font-light text-[14px] leading-[100%] tracking-[0%] text-[#888]">
          {resultCount} trips found
        </span>

        <div className="relative flex items-center gap-[8px]">
          <ArrowUpDown size={13} className="text-[#300905]" />

          <span className="font-semibold text-[16px] leading-[100%] tracking-[0%] text-[#300905]">Sort By :</span>

          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-[6px] text-[16px] leading-[100%] tracking-[0%] font-medium text-ink"
          >
            {selected}

            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path
                d="M1 1l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {sortOpen && (
            <div className="absolute right-0 top-[29px] z-50 min-w-[230px] max-[1910px]:min-w-[229px] max-[1700px]:min-w-[204px] max-[1500px]:min-w-[180px] max-[1281px]:min-w-[153px] max-[1250px]:min-w-[150px] max-[1200px]:min-w-[144px] rounded-[8px] border border-[#E8E8E8] bg-white shadow-lg py-[8px]">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSelected(option);
                    setSortOpen(false);
                  }}
                  className={`w-full px-[15px] py-[10px] text-left text-[14px] ${
                    selected === option
                      ? "bg-[#f5f5ff] text-[#2f2d89] font-semibold"
                      : "text-[#444]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-b-2 border-ink" />

      {/* Row 2: active filter chips */}
      {hasActiveFilters && (
        <div className="pt-[10px]">
          <ActiveFilters filters={filters} setFilters={setFilters} />
        </div>
      )}
    </div>
  );
}
