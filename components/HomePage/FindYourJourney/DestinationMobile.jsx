"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { matchesDestinationSearch } from "@/lib/destinationSearch";

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
  allDestinations = [],
  journeys = [],
}) {
  const router = useRouter();
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

  const [query, setQuery] = useState("");
  // Same full-Location search as the desktop TravelForm — typing searches
  // city/region/country/state across every Location, not just the popular
  // chips below.
  const filteredDestinationOptions = query.trim()
    ? (() => {
        const q = query.trim().toLowerCase();
        const source = [...destinationOptions, ...allDestinations];
        const matches = source.filter((item) =>
          (item.searchText || item.label.toLowerCase()).includes(q),
        );
        const seen = new Set();
        return matches.filter((item) => {
          const key = item.label.toLowerCase();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      })()
    : destinationOptions;

  const handleSelect = (value) => {
    setSelectedDestinations((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // Journeys whose title/region/city/country/state match what's typed —
  // same matcher the desktop TravelForm / itinerary search use, so a term
  // that happens to match an actual trip surfaces it directly (image +
  // title) here too, instead of only ever showing destination chips.
  const matchingJourneys = query.trim()
    ? journeys.filter((journey) => matchesDestinationSearch(journey, query))
    : [];

  const handleJourneySelect = (journey) => {
    if (journey.viewTripUrl) router.push(journey.viewTripUrl);
  };

  const getJourneyMatchCity = (journey) => {
    const term = query.trim().toLowerCase();
    const candidates = [journey.startCity, journey.endCity, journey.region].filter(Boolean);
    if (!term) return candidates[0] || "";
    return candidates.find((value) => value.toLowerCase().includes(term)) || candidates[0] || "";
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
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by destination"
          className="w-full h-[38px] pl-10 pr-3 text-[13px] bg-transparent border border-[#7A7A7A] rounded-[3px] outline-none placeholder:text-[#9B9B9B]"
        />
      </div>

      <div className="text-center text-[13px] font-medium text-[#555555] mb-5">
        OR
      </div>


      <h3 className="text-[13px] font-semibold text-[#333333] mb-4">
        {query.trim() ? "Search results" : "Choose from our popular destinations"}
      </h3>

      {query.trim() ? (
        // Typing can match dozens of Locations — a compact scrollable list
        // instead of a pill grid, same as the desktop TravelForm.
        <div className="mb-6 max-h-[220px] overflow-y-auto rounded-[4px] border border-[#D9D9D9]">
          {matchingJourneys.map((journey) => (
            <button
              key={`journey-${journey.id}`}
              onClick={() => handleJourneySelect(journey)}
              className="flex w-full items-center gap-2 border-b border-[#EEEEEE] px-3 py-2 text-left last:border-b-0"
            >
              <span className="relative h-[30px] w-[30px] shrink-0 overflow-hidden rounded-[4px] bg-[#EEEEEE]">
                {journey.image && (
                  <Image
                    src={journey.image}
                    alt={journey.title}
                    fill
                    sizes="30px"
                    className="object-cover"
                  />
                )}
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-[12px] font-medium text-[#333]">
                  {journey.title}
                </span>
                {getJourneyMatchCity(journey) && (
                  <span className="truncate text-[11px] text-[#757575]">
                    {getJourneyMatchCity(journey)}
                  </span>
                )}
              </span>
            </button>
          ))}

          {filteredDestinationOptions.length ? (
            filteredDestinationOptions.map((item) => {
              const isSelected = selectedDestinations.includes(item.value);
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.value)}
                  className={`flex w-full items-center justify-between gap-2 border-b border-[#EEEEEE] px-3 py-2 text-left text-[12px] last:border-b-0 ${
                    isSelected ? "bg-[#F4E5D9] text-[#333]" : "text-[#333]"
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  {isSelected && <span className="shrink-0 text-[#2F2E8B]">✓</span>}
                </button>
              );
            })
          ) : matchingJourneys.length ? null : (
            <p className="px-3 py-2 text-[12px] text-[#757575]">No matching destinations</p>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 mb-6">
          {filteredDestinationOptions.map((item) => (
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
      )}

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
