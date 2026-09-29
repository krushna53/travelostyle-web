import Image from "@/components/SafeImage";
import { useEffect, useState } from "react";
import { getStopoverOptions } from "@/lib/stopoverJourney";

export default function StepThree({
  formData,
  toggleStopover,
  updateField,
  options = STOPOVER_OPTIONS,
  // IDs of the stopover_journeys nodes selected on the current journey in
  // Drupal (field_stopover_journey). When present, only these are shown —
  // e.g. on "Essence of Japan", only the stopover(s) added to that specific
  // journey, not every stopover journey in the system.
  allowedStopoverIds = null,
}) {
  const [stopoverOptions, setStopoverOptions] = useState([]);

  useEffect(() => {
    let cancelled = false;
    getStopoverOptions(allowedStopoverIds).then((options) => {
      if (!cancelled) setStopoverOptions(options);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Array.isArray(allowedStopoverIds) ? allowedStopoverIds.join(",") : allowedStopoverIds]);

  return (
    <div className="w-full font-sans">
      <h3 className="text-[13px] font-bold text-[#1A1A1A]">
        Take your journey a little further
      </h3>
      <p className="mt-1 text-[10px] leading-tight text-[#6A6A6A]">
        Stopover journeys are optional. Choose one if you&apos;d like to add
        another destination to your trip or simply click &apos;Next&apos; to
        complete your inquiry
      </p>

 
      <div className="mt-3.5 grid grid-cols-1 gap-x-5 gap-y-2.5 sm:grid-cols-2">
        {stopoverOptions.map((option) => {
          const checked = (formData.stopovers || []).includes(option.id);
          return (
            <label
              key={option.id}
              className="flex cursor-pointer items-center gap-2 select-none group"
            >
            
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleStopover(option.id)}
                className="h-3.5 w-3.5 shrink-0 cursor-pointer rounded-[2px] border-[#4A4A4A] accent-[#2B3377]"
              />

              <div
                className={`flex flex-1 items-center gap-2 rounded-[3px] border p-1.5 transition-all ${
                  checked
                    ? "border-[#1A1A1A] bg-[#fbfbfb]"
                    : "border-[#3A3A3A] bg-white hover:border-[#1A1A1A]"
                }`}
              >
            
                <div className="relative h-[48px] w-[54px] shrink-0 overflow-hidden rounded-[2px]">
                  <Image
                    src={option.image}
                    alt={option.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>

           
                <div className="flex flex-col justify-center">
                  <p className="text-[11px] font-bold leading-none text-[#1A1A1A]">
                    {option.title}
                  </p>
                  <p className="mt-1 text-[9px] font-medium leading-none text-[#6A6A6A]">
                    {option.duration}
                  </p>

                  <div className="mt-1.5">
                    <span className="block text-[8px] font-normal leading-none text-[#7A7A7A]">
                      from
                    </span>
                    <p className="mt-0.5 text-[11px] font-extrabold leading-none text-[#1A1A1A]">
                      ${option.price.toLocaleString()}
                      <span className="text-[8.5px] font-normal text-[#6A6A6A]">
                        /person
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {/* Bottom Custom Stopover Checkbox */}
      <label className="mt-3.5 flex cursor-pointer items-center gap-2 select-none">
        <input
          type="checkbox"
          checked={formData.discussCustomStopovers || false}
          onChange={(e) =>
            updateField("discussCustomStopovers", e.target.checked)
          }
          className="h-3.5 w-3.5 shrink-0 cursor-pointer rounded-[2px] border-[#4A4A4A] accent-[#2B3377]"
        />
        <span className="text-[10px] text-[#4A4A4A]">
          I would like to discuss custom stopover options
        </span>
      </label>
    </div>
  );
}