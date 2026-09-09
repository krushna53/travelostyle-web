"use client";
import { useRouter } from "next/navigation";

const trustItems = [
  "Trusted local partners",
  "24/7 on-ground support",
  "Transparent inclusions",
];

// Inspirational (tailor-made) journeys have no dates/pricing to compare
// against other departures, so "Compare Trips" doesn't apply there — the
// fourth slot instead reads "Advisor-led planning" as plain text, same
// as the other three items. Group/Private journeys keep the "Compare
// Trips" button as before.
export default function TrustBar({ isInspirational = false }) {
  const router = useRouter();
  const mobileItems = isInspirational
    ? [...trustItems, "Advisor-led planning"]
    : trustItems;

  return (
    <>
      {/* ================= MOBILE ================= */}
      {/* Figma: 390x64 band at y=794, #F2E2DA, items 18px/600 starting at
          x=27 with the second item at x=288 — i.e. wider than the viewport,
          so the row scrolls horizontally instead of wrapping. */}
      <div className="hidden h-[64px] w-full border-y-2 border-[#1A1A1A] bg-[#F2E2DA]">
        <div className="md:flex md:h-full items-center gap-[24px] overflow-x-auto px-[27px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {mobileItems.map((label, i) => (
            <div key={i} className="flex shrink-0 items-center gap-[24px]">
              {i > 0 && (
                <span className="text-[12px] font-bold text-[#1A1A1A]">✦</span>
              )}
              <span className="whitespace-nowrap text-[18px] font-semibold leading-[24px] tracking-[0.05em] text-[#1A1A1A]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ================= DESKTOP ================= */}
      {/* justify-between over the full width (not justify-center with a
          fixed gap) so the row actually spreads edge-to-edge — centering
          it bunched everything into the middle of the bar instead of
          spreading across the whole width like the reference design. */}
      <div className="hidden w-full border-y border-[#EAE0D8] bg-[#F2E2DA] md:block">
        {/* Each star is grouped tightly with the label that FOLLOWS it
            (small fixed gap), and justify-between spreads the space
            between those groups instead of spreading every label/star
            slot evenly — that keeps "label ✦" pairs snug while the row
            still spans the full width edge to edge. */}
        <div className="flex flex-wrap items-center justify-between gap-x-[10px] gap-y-[6px] px-[20px] py-[10px] max-[901px]:px-[20px] max-[901px]:py-[10px] max-[1200px]:px-[26px] max-[1200px]:py-[12px] max-[1250px]:px-[32px] max-[1250px]:py-[14px] max-[1281px]:px-[38px] max-[1281px]:py-[16px] max-[1910px]:px-[48px] max-[1910px]:py-[18px] min-[1911px]:px-[64px] min-[1911px]:py-[20px]">
          {trustItems?.map((label) => (
            <span
              key={label}
              className="whitespace-nowrap font-semibold text-ink text-[11px] max-[901px]:text-[11px] max-[1200px]:text-[13px] max-[1250px]:text-[15px] max-[1281px]:text-[16px] max-[1910px]:text-[17px] min-[1911px]:text-[18px]"
            >
              {label}
            </span>
          )).reduce((acc, node, i) => {
            if (i > 0) {
              acc.push(
                <span
                  key={`star-${i}`}
                  className="flex items-center justify-center leading-none font-bold text-ink text-[10px] max-[901px]:text-[10px] max-[1200px]:text-[11px] max-[1250px]:text-[12px] max-[1281px]:text-[13px] max-[1910px]:text-[14px] min-[1911px]:text-[15px]"
                >
                  ✦
                </span>,
              );
            }
            acc.push(node);
            return acc;
          }, [])}

          <span className="flex items-center justify-center leading-none font-bold text-ink text-[10px] max-[901px]:text-[10px] max-[1200px]:text-[11px] max-[1250px]:text-[12px] max-[1281px]:text-[13px] max-[1910px]:text-[14px] min-[1911px]:text-[15px]">
            ✦
          </span>

          {isInspirational ? (
            <span className="whitespace-nowrap font-semibold text-ink text-[11px] max-[901px]:text-[11px] max-[1200px]:text-[13px] max-[1250px]:text-[15px] max-[1281px]:text-[16px] max-[1910px]:text-[17px] min-[1911px]:text-[18px]">
              Advisor-led planning
            </span>
          ) : (
            <button
              onClick={() => router.push("/comparison")}
              className="flex items-center justify-center h-[30px] px-[14px] rounded-[6px] bg-[#2E2787] text-white font-semibold border border-white hover:bg-[#3B33A0] transition-colors shrink-0 text-[11px] max-[901px]:text-[11px] max-[1200px]:h-[32px] max-[1200px]:text-[12px] max-[1250px]:h-[34px] max-[1250px]:text-[13px] max-[1281px]:h-[34px] max-[1281px]:px-[16px] max-[1281px]:text-[13px] max-[1910px]:h-[36px] max-[1910px]:px-[18px] max-[1910px]:text-[14px] min-[1911px]:h-[36px] min-[1911px]:px-5 min-[1911px]:text-[14px]"
            >
              Compare Trips
            </button>
          )}
        </div>
      </div>
    </>
  );
}
