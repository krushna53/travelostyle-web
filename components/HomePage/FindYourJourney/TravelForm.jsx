"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const DropdownArrow = ({ open }) => (
  <svg
    width="14"
    height="12"
    viewBox="0 0 14 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
  >
    <path
      d="M6.92773 12L-0.000468159 -1.30507e-06L13.8559 -9.36995e-08L6.92773 12Z"
      fill="#B6B6B6"
    />
  </svg>
);

const travelOptions = [
  "Group Journey",
  "Private Journey",
  "Tailor-Made Journey",
  "Cruises",
  "Land & Rail Journeys",
  "Private Jet Journeys",
];

// Fallbacks only — used if Drupal has no popular Locations/Regions or
// popular months yet, so the widget never renders empty.
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

const FALLBACK_MONTHS = [
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

const durations = ["5–8 Days", "8–15 Days", "15–25 Days", "25+ Days"];

export default function TravelForm({
  destinations = [],
  months = [],
  styles = [],
  popularDestinations = [],
  popularMonths = [],
}) {
  const [selectedTravelType, setSelectedTravelType] = useState(
    (styles.length ? styles : travelOptions)[0] || "Private Journey",
  );
  const router = useRouter();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const formRef = useRef(null);

  // Panels float over the page, so close them on an outside click.
  useEffect(() => {
    if (!activeDropdown) return;
    const handleClickOutside = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdown]);

  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState("");
  const [openToPossibilities, setOpenToPossibilities] = useState(false);

  // "Where do you want to go?" — popular Locations (city, labeled with
  // their region) and popular Regions from Drupal, falling back to the
  // plain region list, then to a static list if Drupal has nothing.
  // NOTE: `value` (not `label`) is what's stored/filtered on — for a
  // popular Location chip, that's always its parent Region's name, since
  // the itinerary page's region filter only ever matches Region taxonomy
  // terms, not individual Location cities.
  const destinationOptions = popularDestinations.length
    ? popularDestinations
    : destinations.length
      ? destinations.map((name) => ({ id: name, label: name, value: name }))
      : FALLBACK_DESTINATIONS.map((name) => ({ id: name, label: name, value: name }));

  // "When do you want to travel?" — months marked popular first; if none
  // are flagged yet, fall back to whatever Month terms actually exist in
  // Drupal (so this only ever shows real terms, e.g. just the 4 that
  // exist today, never a full static 12-month list unless Drupal itself
  // is completely empty).
  const monthOptions = popularMonths.length
    ? popularMonths
    : months.length
      ? months
      : FALLBACK_MONTHS;

  // "Choose a way to travel" — the same "tags" taxonomy the itinerary
  // sidebar's own Travel Style filter reads from, so a selection here is
  // guaranteed to match something the itinerary page can actually filter.
  const travelTypeOptions = styles.length ? styles : travelOptions;

  const handleFindJourney = () => {
    const findYourJourneyData = {
      travelType: selectedTravelType,
      destinations: selectedDestinations,
      openToPossibilities: openToPossibilities,
      months: selectedMonths,
      duration: selectedDuration,
    };

    sessionStorage.setItem("journeyData", JSON.stringify(findYourJourneyData));

    const region = selectedDestinations.join(",");
    router.push(`/itinerary${region ? `?region=${encodeURIComponent(region)}` : ""}`);
  };

  const handleDestinationSelect = (value) => {
    setSelectedDestinations((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      }
      return [...prev, value];
    });
  };

  const handleMonthSelect = (month) => {
    setSelectedMonths((prev) => {
      if (prev.includes(month)) {
        return prev.filter((item) => item !== month);
      }
      return [...prev, month];
    });
  };

  const handleDurationSelect = (duration) => {
    setSelectedDuration(duration);
  };

  return (
    <div ref={formRef} className="relative pt-3 border-t border-[#1A1A1A]">
      <div className="flex gap-4">
          <button
          onClick={() =>
            setActiveDropdown(activeDropdown === "date" ? null : "date")
          }
          className="flex h-[42px] w-[470px] items-center justify-between rounded border-[1.5px] border-gray-400 bg-white px-4"
        >
          <span className="truncate text-[13px] max-[1910px]:text-[13px]">
            {selectedMonths.length || selectedDuration
              ? `${selectedMonths.join(", ")}${
                  selectedMonths.length && selectedDuration ? ", " : ""
                }${selectedDuration}`
              : "When do you want to travel?"}
          </span>

          <DropdownArrow open={activeDropdown === "date"} />
        </button>
        <button
          onClick={() =>
            setActiveDropdown(
              activeDropdown === "destination" ? null : "destination",
            )
          }
          className="flex h-[42px] w-[410px] items-center justify-between rounded border-[1.5px] border-gray-400 bg-white px-4"
        >
          <span className="truncate text-[13px] max-[1910px]:text-[13px]">
            {selectedDestinations.length
              ? selectedDestinations.length > 3
                ? `${selectedDestinations.slice(0, 3).join(", ")} +${
                    selectedDestinations.length - 3
                  } more`
                : selectedDestinations.join(", ")
              : "Where do you want to go?"}
          </span>

          <DropdownArrow open={activeDropdown === "destination"} />
        </button>

       <button
          onClick={() =>
            setActiveDropdown(activeDropdown === "travel" ? null : "travel")
          }
          className="flex h-[42px] w-[496px] items-center justify-between rounded border-[1.5px] border-gray-400 bg-white px-4"
        >
          <span className="text-[13px] max-[1910px]:text-[13px]">{selectedTravelType}</span>

          <DropdownArrow open={activeDropdown === "travel"} />
        </button>

        <button
          onClick={handleFindJourney}
          className="mb-3 w-[220px] h-[45px] px-[21px] py-3 bg-[#2F2E8B] text-white text-[14px] font-medium rounded-[100px] flex items-center justify-center gap-[10px] whitespace-nowrap"
        >
          Find Your Journey
        </button>
      </div>
      {activeDropdown === "travel" && (
        <div className="absolute left-0 right-0 top-full z-40 mt-3 rounded-[10px] border-2 border-black bg-[#FAFAFA] p-4 shadow-[5px_10px_15px_rgba(26,26,26,0.1)]">
          <h3 className="mb-4 text-[17px] max-[1910px]:text-[17px] max-[1281px]:text-[14px] font-semibold">
            Choose a way of travel
          </h3>

          <div className="flex flex-wrap gap-8">
            {travelTypeOptions.map((item) => (
              <label
                key={item}
                className="flex cursor-pointer items-center gap-2 text-[13px] max-[1910px]:text-[13px]"
              >
                <input
                  className="w-[17px] max-[1281px]:w-[12px] max-[1250px]:w-[11px] h-[17px] max-[1281px]:h-[12px] max-[1250px]:h-[11px]"
                  type="checkbox"
                  name="travelType"
                  checked={selectedTravelType === item}
                  onChange={() => setSelectedTravelType(item)}
                />
                {item}
              </label>
            ))}
          </div>
        </div>
      )}

      {activeDropdown === "destination" && (
        <div className="absolute left-0 right-0 top-full z-40 mt-3 rounded-[10px] border-2 border-black bg-[#FAFAFA] p-4 shadow-[5px_10px_15px_rgba(26,26,26,0.1)]">
          <h3 className="mb-4 text-lg font-semibold text-[17px] max-[1910px]:text-[17px] max-[1281px]:text-[14px]">
            Popular Destinations
          </h3>

          <div className="flex flex-wrap gap-3">
            {destinationOptions.map((item) => (
              <button
                key={item.id}
                onClick={() => handleDestinationSelect(item.value)}
                className={`flex h-[30px] items-center rounded-full border border-[#1A1A1A] px-4 text-xs text-[#1A1A1A] transition-all text-[13px] max-[1910px]:text-[13px] ${
                  selectedDestinations.includes(item.value)
                    ? "bg-[#F2E2DA]"
                    : "bg-transparent"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <label className="inline-flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={openToPossibilities}
                onChange={(e) => setOpenToPossibilities(e.target.checked)}
                className="h-4 w-4 accent-[#2E348D]"
              />

              <a className={`text-[13px] max-[1910px]:text-[13px] `}>I&apos;m open to possibilities!</a>
            </label>
          </div>
        </div>
      )}

      {activeDropdown === "date" && (
        <div className="absolute left-0 right-0 top-full z-40 mt-3 rounded-[10px] border-2 border-black bg-[#FAFAFA] p-4 shadow-[5px_10px_15px_rgba(26,26,26,0.1)]">
          <h3 className="text-xl font-semibold text-[17px] max-[1910px]:text-[17px] max-[1281px]:text-[14px]">
            When do you want to go?
          </h3>

          <p className="mb-4 mt-2 text-sm text-[#757575]">
            Pick Month of Travel
          </p>

          <div className="flex flex-wrap gap-3">
            {monthOptions.map((month) => (
              <button
                key={month}
                onClick={() => handleMonthSelect(month)}
                className={`flex h-[30px] items-center rounded-full border border-[#1A1A1A] px-4 text-xs text-[#1A1A1A] transition-all text-[13px] max-[1910px]:text-[13px] ${
                  selectedMonths.includes(month)
                    ? "bg-[#F2E2DA]"
                    : "bg-transparent"
                }`}
              >
                {month}
              </button>
            ))}
          </div>

          <h4 className="mb-4 mt-5 font-semibold text-[17px] max-[1910px]:text-[17px] max-[1281px]:text-[14px]">
            How long do you want to travel?
          </h4>

          <div className="flex flex-wrap gap-6">
            {durations.map((item) => (
              <label
                key={item}
                className="flex items-center gap-2 text-[13px] max-[1910px]:text-[13px] cursor-pointer"
              >
                <input
                  className="w-[17px] max-[1281px]:w-[12px] max-[1250px]:w-[11px] h-[17px] max-[1281px]:h-[12px] max-[1250px]:h-[11px]"
                  type="checkbox"
                  name="duration"
                  checked={selectedDuration === item}
                  onChange={() => handleDurationSelect(item)}
                />
                {item}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
