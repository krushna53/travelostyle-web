"use client";

import { X } from "lucide-react";

const travelOptions = [
  "Group Journey",
  "Private Journey",
  "Tailor-made Journey",
  "Cruise",
  "Land & Rail Journey",
  "Private Jet Journey",
];

export default function TravelTypeMobile({ onClose,onNext,selectedTravelType,setSelectedTravelType, styles = [] }) {

  // Same "tags" taxonomy the itinerary sidebar's Travel Style filter
  // reads from, falling back to the static list if Drupal has none yet.
  const travelTypeOptions = styles.length ? styles : travelOptions;

 const handleTravelTypeSelect = (item) => {
  setSelectedTravelType(item);
};
  
  return (
    <div className="w-[280px] min-h-[580px] bg-[#F5F5F5] p-5">
      <div className="flex items-start justify-between mb-6">
        <h2 className="text-[18px] font-semibold text-[#333333] leading-[24px] max-w-[180px]">
          Choose your way of travel
        </h2>

        <button onClick={onClose}>
          <X size={22} className="text-[#6B6B6B]" />
        </button>
      </div>

      <div className="space-y-3">
        {travelTypeOptions.map((item) => (
          <label
            key={item}
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedTravelType === item}
              onChange={() => handleTravelTypeSelect(item)}
              className="w-[16px] h-[16px] border border-[#444] rounded-sm accent-[#2F2E8B]"
            />

            <span className="text-[16px] text-[#3A3A3A]">
              {item}
            </span>
          </label>
        ))}
      </div>

      <button onClick={onNext} className="mt-8 h-[34px] px-5 bg-[#2F2E8B] text-white text-[13px] font-medium rounded-full">
        Next
      </button>
    </div>
  );
}