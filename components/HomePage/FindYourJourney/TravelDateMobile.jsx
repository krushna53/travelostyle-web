"use client";

import { useState } from "react";
import { X } from "lucide-react";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const durations = ["2–5 Days", "6–10 Days", "11–20 Days", "20+ Days"];

export default function TravelDateMobile({ onClose,selectedMonths,setSelectedMonths,selectedDuration,setSelectedDuration, months: monthsFromDrupal = [], popularMonths = [] }) {

  // Months marked popular first; otherwise whatever Month terms actually
  // exist in Drupal; the static 12-month list is a last resort only.
  const monthOptions = popularMonths.length
    ? popularMonths
    : monthsFromDrupal.length
      ? monthsFromDrupal
      : months;

  const toggleMonth = (month) => {
    setSelectedMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month],
    );
  };

  const handleDurationSelect = (duration) => {
    setSelectedDuration(duration);
  };

  return (
    <div className="w-[280px] min-h-[580px] bg-[#F5F5F5] p-4">
      <div className="flex items-start justify-between mb-8">
        <h2 className="text-[18px] font-semibold text-[#333333] leading-[24px] max-w-[190px]">
          When do you want to travel?
        </h2>

        <button onClick={onClose}>
          <X size={22} className="text-[#4A4A4A]" />
        </button>
      </div>

      <div className="mb-10">
        <h3 className="text-[14px] font-semibold text-[#333333] mb-4">
          Pick Month of Travel
        </h3>

        <div className="flex flex-wrap gap-2">
          {monthOptions.map((month) => (
            <button
              key={month}
              onClick={() => toggleMonth(month)}
              className={`h-[24px] px-3 rounded-full border text-[11px] transition-all
                ${
                  selectedMonths.includes(month)
                    ? "bg-[#F2E5DB] border-[#8B8B8B] text-[#333333]"
                    : "bg-white border-[#8B8B8B] text-[#333333]"
                }`}
            >
              {month}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-[14px] font-semibold text-[#333333] mb-4">
          How long do you want to travel?
        </h3>

        <div className="space-y-3">
          {durations.map((item) => (
            <label
              key={item}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedDuration === item}
                onChange={() => handleDurationSelect(item)}
                className="w-[16px] h-[16px] border border-[#555] rounded-sm accent-[#2F2E8B]"
              />

              <span className="text-[14px] text-[#444444]">{item}</span>
            </label>
          ))}
        </div>
      </div>
      <button
        onClick={onClose}
        className="mt-8 h-[34px] px-5 bg-[#2F2E8B] text-white text-[13px] font-medium rounded-full"
      >
        Next
      </button>
    </div>
  );
}
