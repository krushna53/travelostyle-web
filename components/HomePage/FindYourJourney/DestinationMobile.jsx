"use client";

import { Search, X } from "lucide-react";

// Fallback only — used if Drupal has no popular Locations/Regions yet.
const FALLBACK_DESTINATIONS = [
  "Morocco",
  "Orlando",
  "Las Vegas",
  "Cancun",
  "India",
  "Africa",
  "Punta Cana",
  "Florida",
  "Chicago",
  "Spain",
];

export default function DestinationMobile({
  onClose,
  onNext,
  selectedDestinations,
  setSelectedDestinations,
  openToPossibilities,
  setOpenToPossibilities,
  destinations = [],
  popularDestinations = [],
}) {
  // Popular Locations (city, labeled with their region) + popular Regions
  // from Drupal, falling back to the plain region list, then a static list.
  // `value` (not `label`) is what gets stored/selected — for a popular
  // Location chip that's always its parent Region's name, matching what
  // the itinerary page's region filter actually understands.
  const destinationOptions = popularDestinations.length
    ? popularDestinations
    : destinations.length
      ? destinations.map((name) => ({ id: name, label: name, value: name }))
      : FALLBACK_DESTINATIONS.map((name) => ({ id: name, label: name, value: name }));

  const handleSelect = (value) => {
    setSelectedDestinations((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  return (
    <div className="w-[280px] min-h-[580px] bg-[#F5F5F5] p-5">
      <div className="flex items-start justify-between mb-6">
        <h2 className="text-[18px] font-semibold text-[#333333] leading-[24px] max-w-[190px]">
          Where do you want to go?
        </h2>

        <button onClick={onClose}>
          <X size={20} className="text-[#6B6B6B]" />
        </button>
      </div>

      <div className="relative mb-6">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A0A0]"
        />

        <input
          type="text"
          placeholder="Search by destination"
          className="w-full h-[38px] pl-10 pr-3 text-[13px] bg-transparent border border-[#7A7A7A] rounded-[3px] outline-none placeholder:text-[#9B9B9B]"
        />
      </div>

      <div className="text-center text-[13px] font-medium text-[#555555] mb-5">
        OR
      </div>


      <h3 className="text-[13px] font-semibold text-[#333333] mb-4">
        Choose from our popular destinations
      </h3>

      <div className="flex flex-wrap gap-2 mb-6">
        {destinationOptions.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSelect(item.value)}
            className={`px-4 h-[28px] rounded-full border text-[11px] transition-all
              ${
                selectedDestinations.includes(item.value)
                  ? "bg-[#F4E5D9] border-[#8E8E8E] text-[#333]"
                  : "bg-white border-[#8E8E8E] text-[#333]"
              }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <label className="flex items-center gap-3 cursor-pointer mb-8">
        <input
          type="checkbox"
          checked={openToPossibilities}
          onChange={() => setOpenToPossibilities(!openToPossibilities)}
          className="w-[16px] h-[16px] accent-[#2F2E8B]"
        />

        <span className="text-[12px] text-[#444444] underline">
          I am open to possibilities!
        </span>
      </label>

      <button onClick={onNext} className="h-[34px] px-5 bg-[#2F2E8B] text-white text-[13px] font-medium rounded-full">
        Next
      </button>
    </div>
  );
}
