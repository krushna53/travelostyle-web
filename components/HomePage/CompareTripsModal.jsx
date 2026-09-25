"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import JourneyCardImage from "@/components/JourneyCardImage";
import {
  COMPARE_CHANGED_EVENT,
  MAX_COMPARE_TRIPS as SLOT_COUNT,
  clearCompareTrips,
  getCompareTrips,
  removeTripFromCompare,
} from "@/lib/compareCart";

// The compare "cart". Mounted once site-wide by CompareModalHost and opened
// by any "Compare Trips" button or after an "Add to Compare" click. Shows
// the up-to-3 slots from lib/compareCart, lets the user drop trips or clear
// them, sends empty slots to the journeys listing, and "Compare Trips" to
// the comparison page.
export default function CompareTripsModal({ open, onClose }) {
  const router = useRouter();
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    if (!open) return;
    const sync = () => setTrips(getCompareTrips());
    sync();
    window.addEventListener(COMPARE_CHANGED_EVENT, sync);
    return () => window.removeEventListener(COMPARE_CHANGED_EVENT, sync);
  }, [open]);

  if (!open) return null;

  const goPickATrip = () => {
    onClose();
    router.push("/itinerary");
  };

  const viewComparison = () => {
    onClose();
    router.push("/comparison");
  };

  const slots = Array.from({ length: SLOT_COUNT }, (_, i) => trips[i] || null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="flex max-h-[calc(100vh-32px)] w-full max-w-[1704px] flex-col overflow-y-auto rounded-[10px] border-2 border-[#1A1A1A] bg-[#FAFAFA] shadow-[5px_10px_24px_rgba(26,26,26,0.1)] lg:min-h-[280px]">
        <div className="flex items-center justify-between gap-4 border-b-2 border-[#1A1A1A] px-4 py-[12px] md:px-[46px] lg:h-[64px] lg:py-0">
          <div>
            <h2 className="text-[16px] font-medium leading-[22px] tracking-[0.05em] text-black md:text-[18px]">
              Choose upto {SLOT_COUNT} trips to compare
            </h2>
            <p className="text-[14px] font-normal leading-[20px] tracking-[0.05em] text-[#757575] md:text-[16px]">
              {trips.length} {trips.length === 1 ? "trip" : "trips"} selected
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 text-black transition hover:opacity-60"
          >
            <X size={30} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-[18px] px-4 pb-[18px] pt-[26px] md:px-[46px]">
          <div className="grid grid-cols-1 gap-[16px] md:grid-cols-3 md:gap-[24px]">
            {slots.map((trip, index) =>
              trip ? (
                <div
                  key={trip.id}
                  className="relative flex min-h-[112px] items-stretch gap-[14px] rounded-[5px] border-2 border-[#1A1A1A] bg-[#FAFAFA] px-[9px] pt-[10px] pb-[12px]"
                >
                  <button
                    type="button"
                    onClick={() => removeTripFromCompare(trip.id)}
                    aria-label={`Remove ${trip.title}`}
                    className="absolute right-[10px] top-[5px] z-10 flex h-[24px] w-[24px] items-center justify-center rounded-full bg-[#F2E2DA] text-black transition hover:opacity-70"
                  >
                    <X size={12} strokeWidth={1.5} />
                  </button>

                  <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-[5px]">
                    <JourneyCardImage src={trip.image} alt={trip.title} />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col pr-[28px]">
                    <p title={trip.title} className="line-clamp-2 min-h-[44px] text-[16px] font-medium leading-[22px] tracking-[0.05em] text-black lg:min-h-[48px] lg:text-[18px] lg:leading-[24px]">
                      {trip.title}
                    </p>
                    {trip.days && (
                      <p className="text-[14px] font-light leading-[20px] tracking-[0.05em] text-black lg:text-[16px] lg:leading-[24px]">
                        {trip.days}
                      </p>
                    )}
                    {trip.price && !trip.price.includes("NaN") && (
                      <div className="mt-auto pt-[6px]">
                        <p className="text-[10px] font-light leading-[12px] tracking-[0.05em] text-black">
                          from
                        </p>
                        <p className="flex items-baseline tracking-[0.05em] text-black">
                          <span className="text-[16px] font-medium leading-[20px]">
                            {trip.price}
                          </span>
                          <span className="text-[10px] font-light">/person</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  key={index}
                  type="button"
                  onClick={goPickATrip}
                  className="flex min-h-[112px] items-center justify-center rounded-[5px] border-2 border-dashed border-[#1A1A1A] px-4 text-center transition hover:bg-white"
                >
                  <span className="text-[16px] font-medium tracking-[0.05em] text-black lg:text-[18px]">
                    + Add trip to compare
                  </span>
                </button>
              ),
            )}
          </div>

          <div className="flex min-h-[37px] items-center justify-between">
            <button
              type="button"
              onClick={clearCompareTrips}
              disabled={trips.length === 0}
              className="text-[16px] font-normal tracking-[0.05em] text-[#1A1A1A] underline underline-offset-4 disabled:cursor-default disabled:text-[#757575]"
            >
              Clear All
            </button>

            {trips.length > 0 && (
              <button
                type="button"
                onClick={viewComparison}
                disabled={trips.length < 2}
                className="h-[37px] rounded-[30px] bg-[#2C3078] px-[16px] text-[18px] font-semibold leading-[18px] tracking-[0.05em] text-[#FAFAFA] transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                Compare Trips
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
