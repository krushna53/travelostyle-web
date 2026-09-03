"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import TravelTypeMobile from "./TravelTypeMobile";
import DestinationMobile from "./DestinationMobile";
import TravelDateMobile from "./TravelDateMobile";
import { useRouter } from "next/navigation";

export default function FindJourneyMobile({
  onClose,
  destinations = [],
  months = [],
  styles = [],
  popularDestinations = [],
  popularMonths = [],
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedTravelType, setSelectedTravelType] =
    useState("Private Journey");
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [openToPossibilities, setOpenToPossibilities] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState("");

  const handleFindJourney = () => {
    const findYourJourneyData = {
      travelType: selectedTravelType,
      destinations: selectedDestinations,
      openToPossibilities,
      months: selectedMonths,
      duration: selectedDuration,
    };
    sessionStorage.setItem("journeyData", JSON.stringify(findYourJourneyData));
    const region = selectedDestinations.join(",");
    router.push(`/itinerary${region ? `?region=${encodeURIComponent(region)}` : ""}`);
  };

  if (step === 1) {
    return (
      <TravelTypeMobile
        onClose={() => setStep(0)}
        onNext={() => setStep(2)}
        selectedTravelType={selectedTravelType}
        setSelectedTravelType={setSelectedTravelType}
        styles={styles}
      />
    );
  }

  if (step === 2) {
    return (
      <DestinationMobile
        onClose={() => setStep(0)}
        onNext={() => setStep(3)}
        selectedDestinations={selectedDestinations}
        setSelectedDestinations={setSelectedDestinations}
        openToPossibilities={openToPossibilities}
        setOpenToPossibilities={setOpenToPossibilities}
        destinations={destinations}
        popularDestinations={popularDestinations}
      />
    );
  }

  if (step === 3) {
    return (
      <TravelDateMobile
        onClose={() => setStep(0)}
        selectedMonths={selectedMonths}
        setSelectedMonths={setSelectedMonths}
        selectedDuration={selectedDuration}
        setSelectedDuration={setSelectedDuration}
        months={months}
        popularMonths={popularMonths}
      />
    );
  }

  return (
    <div className="max-w-[290px] h-[580px] bg-[#f5f5f5] p-5">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-[24px] font-semibold text-ink leading-tight">
          Find Your Journey
        </h2>

        <button onClick={onClose}>
          <X size={22} className="text-[#333]" />
        </button>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => setStep(3)}
          className="w-full h-[40px] flex items-center justify-between px-3 border border-[#8B8178] bg-white rounded text-[12px] text-[#7B7B7B]"
        >
          <span className="truncate">
            {selectedMonths.length || selectedDuration
              ? `${selectedMonths.join(", ")}${
                  selectedMonths.length && selectedDuration ? ", " : ""
                }${selectedDuration}`
              : "When do you want to travel?"}
          </span>
          <Plus size={16} className="text-[#8B8178]" />
        </button>
        <button
          onClick={() => setStep(2)}
          className="w-full h-[40px] flex items-center justify-between px-3 border border-[#8B8178] bg-white rounded text-[12px] text-[#7B7B7B]"
        >
          <span>
            {selectedDestinations.length > 0
              ? selectedDestinations.join(", ")
              : "Where do you want to go?"}
          </span>
          <Plus size={16} className="text-[#8B8178]" />
        </button>

        <button
          onClick={() => setStep(1)}
          className="w-full h-[40px] flex items-center justify-between px-3 border border-[#8B8178] bg-white rounded text-[12px] text-[#7B7B7B]"
        >
          <span>
            {selectedTravelType
              ? selectedTravelType
              : "How do you want to travel?"}
          </span>
          <Plus size={16} className="text-[#8B8178]" />
        </button>
      </div>

      <button
        onClick={handleFindJourney}
        className="mt-6 h-[36px] px-6 bg-[#2F2E8B] text-white text-[14px] font-medium rounded-full"
      >
        Find Journey
      </button>
    </div>
  );
}
