import Image from "next/image";

// One tint per rail, matching the desktop staggered columns below.
const MOBILE_RAIL_BG = ["bg-[#EFF3CF]", "bg-[#F2E2DA]", "bg-[#F2D09F]"];

// Six per rail so one copy of the set is wider than any phone viewport —
// otherwise the -50% loop would expose a gap mid-scroll.
const MOBILE_RAILS = [
  ["/Rectangle920.svg", "/Rectangle911.svg", "/Rectangle914.svg", "/Rectangle917.svg", "/Rectangle912.svg", "/Rectangle915.svg"],
  ["/Rectangle918.svg", "/Rectangle913.svg", "/Rectangle916.svg", "/Rectangle920.svg", "/Rectangle914.svg", "/Rectangle911.svg"],
  ["/Rectangle912.svg", "/Rectangle917.svg", "/Rectangle915.svg", "/Rectangle913.svg", "/Rectangle918.svg", "/Rectangle916.svg"],
];

export default function OriginStory() {
  return (
    <section className="px-4 min-[768px]:px-[60px] min-[1024px]:px-[113px] py-[60px] pt-0">
      <div className="flex flex-col min-[1024px]:flex-row items-end gap-8 min-[1024px]:gap-[40px]">

        {/* Left Images — continuously scrolling rails on mobile. Each row
            renders its image set twice so the -50% translate loops seamlessly;
            middle row runs the opposite way for a woven feel. */}
        <div className="min-[1024px]:hidden w-full mb-[30px] space-y-2 overflow-hidden">
          {MOBILE_RAILS.map((rail, rowIndex) => (
            <div
              key={rowIndex}
              className={`overflow-hidden rounded-lg ${MOBILE_RAIL_BG[rowIndex]}`}
            >
              <div
                className={`about-rail-track gap-2 ${
                  rowIndex === 1 ? "about-rail-track--reverse" : ""
                }`}
                style={{ animationDuration: `${70 + rowIndex * 12}s` }}
              >
                {[...rail, ...rail].map((src, i) => (
                  <Image
                    key={i}
                    src={src}
                    alt=""
                    width={264}
                    height={264}
                    className="rounded-[8px] w-[120px] min-[768px]:w-[88px] aspect-square object-cover shrink-0"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Left Images — 3 staggered columns (desktop) */}
        <div className="hidden min-[1024px]:flex gap-3 min-[768px]:gap-4 flex-shrink-0 w-full min-[1024px]:w-auto mb-[50px]">

          {/* Column 1 — 4 images, starts at top */}
          <div className="flex flex-col gap-3 min-[768px]:gap-4 bg-[#EFF3CF] flex-1 min-[1024px]:flex-none rounded-lg">
            <Image src="/Rectangle920.svg" alt="" width={264} height={264} className="rounded-[12px] w-full min-[1024px]:w-[160px] aspect-square object-cover" />
            <Image src="/Rectangle911.svg" alt="" width={264} height={264} className="rounded-[12px] w-full min-[1024px]:w-[160px] aspect-square object-cover" />
            <Image src="/Rectangle914.svg" alt="" width={264} height={264} className="rounded-[12px] w-full min-[1024px]:w-[160px] aspect-square object-cover" />
            <Image src="/Rectangle917.svg" alt="" width={264} height={264} className="rounded-[12px] w-full min-[1024px]:w-[160px] aspect-square object-cover" />
          </div>

          {/* Column 2 — 3 images, offset down */}
          <div className="flex flex-col h-[400px] gap-3 min-[768px]:gap-4 bg-[#F2E2DA] mt-15 min-[768px]:mt-25 min-[1024px]:mt-37.5 flex-1 min-[1024px]:flex-none rounded-lg">
            <Image src="/Rectangle912.svg" alt="" width={264} height={264} className="rounded-[12px] w-full min-[1024px]:w-[160px] aspect-square object-cover" />
            <Image src="/Rectangle915.svg" alt="" width={264} height={264} className="rounded-[12px] w-full min-[1024px]:w-[160px] aspect-square object-cover" />
            <Image src="/Rectangle918.svg" alt="" width={264} height={264} className="rounded-[12px] w-full min-[1024px]:w-[160px] aspect-square object-cover" />
          </div>

          {/* Column 3 — 2 images, offset even more */}
          <div className="flex flex-col h-[300px] gap-3 min-[768px]:gap-4 bg-[#F2D09F] mt-30 min-[768px]:mt-50 min-[1024px]:mt-50 flex-1 min-[1024px]:flex-none rounded-lg">
            <Image src="/Rectangle913.svg" alt="" width={264} height={264} className="rounded-[12px] w-full min-[1024px]:w-[160px] aspect-square object-cover" />
            <Image src="/Rectangle916.svg" alt="" width={264} height={264} className="rounded-[12px] w-full min-[1024px]:w-[160px] aspect-square object-cover" />
          </div>

        </div>

        {/* Right Content */}
        <div className="flex-1 pt-0 min-[1024px]:pt-[95px]">
          <p className="font-taprom text-[20px] min-[768px]:text-[28px] max-[1910px]:min-[768px]:text-[23px] max-[1281px]:min-[768px]:text-[18px] max-[1250px]:min-[768px]:text-[13px] leading-none text-center min-[1024px]:text-left">
            our origin story
          </p>

          <h2 className="mt-2 mx-auto max-w-[338px] text-[32px] min-[768px]:text-[48px] max-[1910px]:min-[768px]:text-[43px] max-[1281px]:min-[768px]:text-[38px] max-[1250px]:min-[768px]:text-[33px] max-[1200px]:min-[768px]:text-[28px] font-bold leading-[40px] min-[768px]:leading-[52px] tracking-[0.05em] min-[768px]:tracking-normal text-black text-center min-[1024px]:text-left min-[1024px]:mx-0 min-[1024px]:max-w-none">
            How TravelOStyle began
          </h2>

          <div className="mt-10 space-y-8 text-[16px] min-[768px]:text-[18px] max-[1910px]:min-[768px]:text-[13px] leading-[32px] text-[#4A4A4A]">
            <p>
              We started from a simple observation: travel should be a respite.
              But for most people, planning it is anything but.
            </p>

            <p>
              We believe the way someone travels reflects how they live — or how
              they wish to live. Every traveller, regardless of budget or
              experience level, deserves to experience the version of a journey
              that genuinely fits them. Not a compromised version.
            </p>

            <p>
              With 30+ years of combined experience across land, air, and cruise,
              and across very different travel budgets and expectations — we&apos;ve
              taken everything we know — about systems, logistics, on-ground
              operations and high-expectations, to build a travel company that
              leads with honesty. We&apos;re here to meet you where you are and then
              expand on what&apos;s possible.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
