"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";

const travelOptions = [
  "Group Journey",
  "Private Journey",
  "Tailor-Made Journey",
  "Cruises",
  "Land & Rail Journeys",
  "Private Jet Journeys",
];

const destinations = [
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

const durations = ["5–8 Days", "8–15 Days", "15–25 Days", "25+ Days"];

export default function TravelForm() {
  const [selectedTravelType, setSelectedTravelType] =
    useState("Private Journey");
  const router = useRouter();
  const [activeDropdown, setActiveDropdown] = useState(null);

  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState("");
  const [openToPossibilities, setOpenToPossibilities] = useState(false);

  const handleFindJourney = () => {
    const findYourJourneyData = {
      travelType: selectedTravelType,
      destinations: selectedDestinations,
      openToPossibilities: openToPossibilities,
      months: selectedMonths,
      duration: selectedDuration,
    };

    sessionStorage.setItem("journeyData", JSON.stringify(findYourJourneyData));

    router.push(`/itinerary?region=${encodeURIComponent(selectedTravelType)}`);
  };

  const handleDestinationSelect = (destination) => {
    setSelectedDestinations((prev) => {
      if (prev.includes(destination)) {
        return prev.filter((item) => item !== destination);
      }
      return [...prev, destination];
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
    <div className="pt-3">
      <div className="flex gap-4">
          <button
          onClick={() =>
            setActiveDropdown(activeDropdown === "date" ? null : "date")
          }
          className="flex h-[42px] w-[470px] items-center justify-between rounded border-[1.5px] border-gray-400 bg-white px-4"
        >
          <span className="truncate text-[0.7vw]">
            {selectedMonths.length || selectedDuration
              ? `${selectedMonths.join(", ")}${
                  selectedMonths.length && selectedDuration ? ", " : ""
                }${selectedDuration}`
              : "When do you want to travel?"}
          </span>

          {activeDropdown === "date" ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </button>
        <button
          onClick={() =>
            setActiveDropdown(
              activeDropdown === "destination" ? null : "destination",
            )
          }
          className="flex h-[42px] w-[410px] items-center justify-between rounded border-[1.5px] border-gray-400 bg-white px-4"
        >
          <span className="truncate text-[0.7vw]">
            {selectedDestinations.length
              ? selectedDestinations.length > 3
                ? `${selectedDestinations.slice(0, 3).join(", ")} +${
                    selectedDestinations.length - 3
                  } more`
                : selectedDestinations.join(", ")
              : "Where do you want to go?"}
          </span>

          {activeDropdown === "destination" ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </button>

       <button
          onClick={() =>
            setActiveDropdown(activeDropdown === "travel" ? null : "travel")
          }
          className="flex h-[42px] w-[496px] items-center justify-between rounded border-[1.5px] border-gray-400 bg-white px-4"
        >
          <span className="text-[0.7vw]">{selectedTravelType}</span>

          {activeDropdown === "travel" ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </button>

        <button
          onClick={handleFindJourney}
          className="mb-3 w-[220px] h-[45px] px-[21px] py-3 bg-[#2F2E8B] text-white text-[14px] font-medium rounded-[100px] flex items-center justify-center gap-[10px] whitespace-nowrap"
        >
          Find Your Journey
        </button>
      </div>
      {/* <div className="mt-3 h-[1px] bg-[#2C3078] mx-[-60px]"></div> */}
      {activeDropdown === "travel" && (
        <div className="mt-3 rounded-lg border border-gray-400 bg-white p-4 shadow-md">
          <h3 className="mb-4 text-[0.9vw] font-semibold">
            Choose a way of travel
          </h3>

          <div className="flex flex-wrap gap-8">
            {travelOptions.map((item) => (
              <label
                key={item}
                className="flex cursor-pointer items-center gap-2 text-[0.7vw]"
              >
                <input
                  className="w-[0.9vw] h-[0.9vw]"
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
        <div className="mt-3 rounded-lg border border-gray-400 bg-white p-4 shadow-md">
          <h3 className="mb-4 text-lg font-semibold text-[0.9vw]">
            Popular Destinations
          </h3>

          <div className="flex flex-wrap gap-3">
            {destinations.map((item) => (
              <button
                key={item}
                onClick={() => handleDestinationSelect(item)}
                className={`rounded-full border px-4 py-1 text-xs transition-all text-[0.7vw] ${
                  selectedDestinations.includes(item)
                    ? "border-[#2E348D] bg-[#F5EFE8] text-[#2E348D]"
                    : "border-gray-300 bg-white"
                }`}
              >
                {item}
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

              <a className={`text-[0.7vw] `}>I&apos;m open to possibilities!</a>
            </label>
          </div>
        </div>
      )}

      {activeDropdown === "date" && (
        <div className="mt-3 rounded-lg border border-gray-400 bg-white p-4 shadow-md">
          <h3 className="text-xl font-semibold text-[0.9vw]">
            When do you want to go?
          </h3>

          <p className="mb-4 mt-2 text-sm text-[#757575]">
            Pick Month of Travel
          </p>

          <div className="flex flex-wrap gap-3">
            {months.map((month) => (
              <button
                key={month}
                onClick={() => handleMonthSelect(month)}
                className={`rounded-full border px-4 py-1 text-xs transition-all text-[0.7vw] ${
                  selectedMonths.includes(month)
                    ? "border-[#2E348D] bg-[#F5EFE8] text-[#2E348D]"
                    : "border-gray-300 bg-white"
                }`}
              >
                {month}
              </button>
            ))}
          </div>

          <h4 className="mb-4 mt-5 font-semibold text-[0.9vw]">
            How long do you want to travel?
          </h4>

          <div className="flex flex-wrap gap-6">
            {durations.map((item) => (
              <label
                key={item}
                className="flex items-center gap-2 text-[0.7vw] cursor-pointer"
              >
                <input
                  className="w-[0.9vw] h-[0.9vw]"
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
