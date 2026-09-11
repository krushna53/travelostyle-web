"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

const SLOT_COUNT = 3;

function readCompareTrips() {
  try {
    return JSON.parse(localStorage.getItem("compareTrips") || "[]");
  } catch {
    return [];
  }
}

// Popup opened from the "Compare Trips" button in the home banner
// (PopularDestinations.jsx). Shows the up-to-3 slots the rest of the site's
// "Add to Compare" buttons already fill via the "compareTrips" localStorage
// key, lets the user drop trips or clear them here, and jumps straight to
// the journeys list to fill an empty slot.
export default function CompareTripsModal({ open, onClose }) {
  const router = useRouter();
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    if (open) setTrips(readCompareTrips());
  }, [open]);

  if (!open) return null;

  const removeTrip = (id) => {
    const next = trips.filter((trip) => trip.id !== id);
    setTrips(next);
    localStorage.setItem("compareTrips", JSON.stringify(next));
  };

  const clearAll = () => {
    setTrips([]);
    localStorage.setItem("compareTrips", JSON.stringify([]));
  };

  const goPickATrip = () => {
    onClose();
    document
      .getElementById("take-your-next-trip")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const viewComparison = () => {
    onClose();
    router.push("/comparison");
  };

  const slots = Array.from({ length: SLOT_COUNT }, (_, i) => trips[i] || null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="flex w-full max-w-[1704px] flex-col rounded-[10px] border-2 border-[#1A1A1A] bg-[#FAFAFA] shadow-[5px_10px_24px_0px_#1A1A1A1A] md:h-[280px]">
        <div className="flex items-center justify-between border-b border-[#1A1A1A]/15 px-6 py-3 md:px-8">
          <div>
            <h2 className="text-[18px] font-semibold text-[#1A1A1A]">
              Choose upto {SLOT_COUNT} trips to compare
            </h2>
            <p className="mt-1 text-[13px] text-[#888]">
              {trips.length} {trips.length === 1 ? "trip" : "trips"} selected
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-[#1A1A1A] transition hover:opacity-60"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex flex-1 flex-col justify-between gap-3 px-6 py-4 md:px-8">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {slots.map((trip, index) =>
              trip ? (
                <div
                  key={trip.id}
                  className="relative flex h-[130px] items-center gap-3 overflow-hidden rounded-[8px] border border-[#1A1A1A] bg-white px-3"
                >
                  <button
                    type="button"
                    onClick={() => removeTrip(trip.id)}
                    aria-label={`Remove ${trip.title}`}
                    className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-[#1A1A1A] shadow transition hover:bg-white"
                  >
                    <X size={12} />
                  </button>

                  <div
                    className="h-[90px] w-[90px] shrink-0 rounded-[6px] bg-[#F3F3F3] bg-cover bg-center"
                    style={trip.image ? { backgroundImage: `url(${trip.image})` } : undefined}
                  />

                  <p className="line-clamp-3 text-[13px] font-semibold text-[#1A1A1A]">
                    {trip.title}
                  </p>
                </div>
              ) : (
                <button
                  key={index}
                  type="button"
                  onClick={goPickATrip}
                  className="flex h-[130px] flex-col items-center justify-center rounded-[8px] border-2 border-dashed border-[#1A1A1A] px-4 text-center transition hover:bg-white"
                >
                  <span className="text-[15px] font-semibold text-[#1A1A1A]">
                    + Add trip to compare
                  </span>
                </button>
              ),
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={clearAll}
              className="text-[14px] text-[#666] underline underline-offset-4"
            >
              Clear All
            </button>

            <button
              type="button"
              onClick={viewComparison}
              disabled={trips.length < 2}
              className="rounded-full bg-[#2C3078] px-6 py-2 text-[14px] font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              Compare Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
