"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import Image from "next/image";
import { CheckCircle2, CirclePlus, Info } from "lucide-react";
import JourneyCardImage from "@/components/JourneyCardImage";

const TAG_COLORS = {
  "group journey": "bg-[#E1EEDB] text-[#1A1A1A]",
  "private journey": "bg-[#FFDDBD] text-[#1A1A1A]",
  "tailormade journey": "bg-[#FFDDBD] text-[#1A1A1A]",
};
const DEFAULT_TAG_COLOR = "bg-[#EAEBCB] text-[#1A1A1A]";

function getTagColor(tag) {
  return TAG_COLORS[tag?.toLowerCase().trim()] || DEFAULT_TAG_COLOR;
}
export default function JourneyCard({
  trip,
  variant = "grid",
}) {
   const router = useRouter();

  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    const compareTrips = JSON.parse(
      localStorage.getItem("compareTrips") || "[]"
    );

    setIsSelected(
      compareTrips.some((item) => item.id === trip.id)
    );
  }, [trip.id]);
const handleAddToCompare = () => {
  // const isAddingTrip =
  //   localStorage.getItem("isAddingTrip") === "true";

  // if (isAddingTrip) {
  //   const existingTrips = JSON.parse(
  //     localStorage.getItem("compareTrips") || "[]"
  //   );
  const existingTrips = JSON.parse(
    localStorage.getItem("compareTrips") || "[]"
  );
    const alreadyExists = existingTrips.some(
      (item) => item.id === trip.id
    );
if (alreadyExists) {
  toast("Trip already added to comparison");
  return;
}
existingTrips.push(trip);

      localStorage.setItem(
        "compareTrips",
        JSON.stringify(existingTrips)
      );


    setIsSelected(true);

  // localStorage.removeItem("isAddingTrip");


  //   localStorage.removeItem("isAddingTrip");
  // // } else {
  // //   localStorage.setItem(
  // //     "compareTrips",create a new array after loading
  // //     JSON.stringify([trip])
  // //   );

  //   setIsSelected(true);
  // }

  sessionStorage.setItem(
    "comparisonReturnPage",
    window.location.pathname +
      window.location.search
  );
   if (localStorage.getItem("isAddingTrip") === "true") {
    localStorage.removeItem("isAddingTrip");
  }
 router.push("/comparison");
};
  return (
    <div
      className={
        variant === "carousel"
          ? "relative isolate flex w-[293px] min-w-[293px] shrink-0 cursor-pointer flex-col px-[14px] pt-2 pb-4 max-md:snap-center md:w-[420px] md:min-w-[390px] md:min-h-[585px] md:px-8 md:pt-3 md:pb-11"
          : "relative isolate flex w-[293px] min-w-[293px] shrink-0 cursor-pointer flex-col px-5 pt-2 pb-4 max-md:snap-center md:w-full md:min-w-0 md:max-w-[390px] md:min-h-[585px] md:px-8 md:pt-3 md:pb-11 mx-auto md:mx-0 min-[1920px]:w-[390px] min-[1920px]:min-w-[390px] min-[1920px]:shrink-0 min-[1920px]:px-5"
      }
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[106.01%] md:h-full"
        style={{
          backgroundImage: "url(/Union-it.svg)",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="mb-2 flex min-h-[16px] flex-wrap gap-2 md:mb-3 md:min-h-[28px] md:gap-2">
        {(trip.tags || []).map((tag) => (
          <span
            key={tag}
            className={`rounded-[2px] px-2 text-[10px] leading-[16px] tracking-[0.05em] font-normal md:rounded-[5px] md:px-3 md:py-1 md:text-[14px] md:font-medium ${getTagColor(tag)}`}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="relative h-[128px] w-full overflow-hidden rounded-[3px] md:h-[213px] md:w-full">
        <JourneyCardImage src={trip.image} alt={trip.title} />
      </div>

      <div className="flex flex-1 flex-col pt-2 text-left md:pt-4">
        <h3 className="line-clamp-2 h-[48px] text-[16px] font-semibold leading-[24px] tracking-[0.05em] text-ink md:h-auto md:min-h-[2.6em] md:text-[21px] md:leading-[1.3] md:tracking-normal md:text-[#232323]">
          {trip.title}
        </h3>

        <p className="mt-2 line-clamp-3 h-[48px] text-[10px] font-light leading-[16px] tracking-[0.05em] text-ink md:mt-2 md:line-clamp-2 md:h-auto md:min-h-[3.1em] md:text-[11px] md:font-normal md:leading-[1.55] md:tracking-normal md:text-[#666666]">
          {trip.desc}
        </p>

        <div className="mt-3 flex h-[44px] flex-col gap-2 text-[10px] leading-[16px] tracking-[0.05em] text-ink md:mt-3 md:h-auto md:flex-row md:items-center md:gap-4 md:text-[8px] md:tracking-normal md:text-[#717171]">
          <div className="flex items-center gap-2 md:gap-1">
            {/* Same /Calender.svg + /Destination.svg pair components/JourneyCard.jsx
                (the homepage card) uses — swapped in for the generic lucide
                CalendarDays/MapPinned icons this card had, which didn't
                visually match (different weight/style from each other and
                from the rest of the site's card icons). */}
            <Image
              src="/Calender.svg"
              alt="Calendar"
              height={16}
              width={16}
              className="w-[16px] h-[16px] md:w-[12px] md:h-[12px]"
            />
            {trip.days}
          </div>

          <div className="flex items-center gap-2 md:gap-1">
            <Image
              src="/Destination.svg"
              alt="Destination"
              height={16}
              width={16}
              className="w-[16px] h-[16px] md:w-[12px] md:h-[12px]"
            />
            {trip.destinations}
          </div>
        </div>

        <div className="flex-1" />

        <div className="mt-4 flex items-center justify-between md:items-end">
          <div className="flex flex-col items-start">
            <span className="text-[10px] leading-[21px] tracking-[0.05em] text-ink md:hidden">
              from
            </span>

            {/* Mobile (per Figma): price and "/person" share a baseline,
                with "double occupancy" wrapping onto the line below. Desktop
                mirrors the same stacked arrangement: from price with person
                inline, then double occupancy directly below it. */}
            <div className="flex items-baseline gap-0 md:hidden">
              <h4 className="text-[16px] font-medium leading-[21px] tracking-[0.05em] text-ink">
                ${Number(trip.price).toLocaleString()}
                <span className="relative -top-[2px] text-[12px] align-top">*</span>
              </h4>
              <span className="relative -top-[2px] text-[12px] leading-[14px] tracking-[0.05em] text-ink">
                /person
              </span>
            </div>
            <span className="-mt-1 text-[10px] leading-[14px] tracking-[0.05em] text-ink md:hidden">
              double occupancy*
            </span>

            <div className="hidden md:flex md:flex-col">
              <span className="md:text-[9px] md:leading-[1.15] md:text-[#7B7B7B]">
                from
              </span>
              <div className="md:flex md:items-baseline md:gap-0">
                <h4 className="md:text-[20px] md:font-semibold md:leading-none md:text-[#1D1D1D]">
                  ${Number(trip.price).toLocaleString()}*
                </h4>
                <span className="md:text-[15px] md:leading-[1.15] md:text-[#7B7B7B]">
                  /person
                </span>
              </div>
              {trip.originalPrice > trip.price && (
                <span className="md:mt-[2px] md:text-[11px] md:leading-none md:text-[#7B7B7B]">
                  was{" "}
                  <span className="line-through">
                    ${Number(trip.originalPrice).toLocaleString()}
                  </span>
                </span>
              )}
              <span className="md:mt-[2px] md:text-[12px] md:leading-[1.15] md:text-[#7B7B7B]">
                double occupancy*
              </span>
            </div>
          </div>

          <a
            href={trip.viewTripUrl}
            onClick={(e) => e.stopPropagation()}
            className="flex h-8 shrink-0 items-center justify-center rounded-full bg-[#2C3078] px-6 text-[16px] font-semibold tracking-[0.05em] text-[#FAFAFA] w-auto transition hover:bg-[#252b78] md:h-[29px] md:w-[93px] md:px-0 md:text-[11px] md:tracking-normal md:bg-[#2D3482]"
          >
            {trip.viewTripText || "View Trip"}
          </a>
        </div>

        <div className="mt-3 md:mt-4 md:min-h-8">
          {trip.offer && (
            <div className="flex items-center gap-2 rounded-md bg-[#F4E5DA] px-3 py-2 text-xs text-[#65574D] md:gap-1.5 md:rounded-[5px] md:px-2.5 md:py-2 md:text-[8px]">
              <Info size={11} className="shrink-0" />
              <span className="line-clamp-1">{trip.offer}</span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddToCompare}
          className="md:mt-3 mb-6 md:mb-0 flex items-center gap-2 text-[14px] leading-[18px] tracking-[0.05em] text-ink md:mt-4 md:gap-1.5 md:text-[11px] md:tracking-normal md:text-[#4E4E4E]"
        >
          {isSelected ? (
            <>
              <CheckCircle2 size={24} strokeWidth={1} className="text-green-600 md:size-3.5 md:stroke-[2]" />
              <span>Added to Compare</span>
            </>
          ) : (
            <>
              <CirclePlus size={24} strokeWidth={1} className="md:size-3.5 md:stroke-[1.8]" />
              <span>Add to Compare</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
