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
    <section className="figma-scale px-4 min-[768px]:px-[60px] min-[1024px]:px-[calc(113*var(--fig-u))] py-[60px] min-[1024px]:pb-[calc(60*var(--fig-u))] pt-0">
      <div className="flex flex-col min-[1024px]:flex-row items-center gap-8 min-[1024px]:gap-[calc(80*var(--fig-u))]">

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
        <div className="hidden min-[1024px]:flex gap-3 min-[768px]:gap-4 min-[1024px]:gap-[calc(16*var(--fig-u))] flex-shrink-0 w-full min-[1024px]:w-auto mb-[50px] min-[1024px]:mb-[calc(50*var(--fig-u))]">

          {/* Column 1 — 4 images, starts at top */}
          <div className="flex flex-col gap-3 min-[768px]:gap-4 min-[1024px]:gap-[calc(16*var(--fig-u))] bg-[#EFF3CF] flex-1 min-[1024px]:flex-none rounded-lg">
            <Image src="/Rectangle920.svg" alt="" width={264} height={264} className="rounded-[12px] w-full min-[1024px]:w-[calc(264*var(--fig-u))] aspect-square object-cover" />
            <Image src="/Rectangle911.svg" alt="" width={264} height={264} className="rounded-[12px] w-full min-[1024px]:w-[calc(264*var(--fig-u))] aspect-square object-cover" />
            <Image src="/Rectangle914.svg" alt="" width={264} height={264} className="rounded-[12px] w-full min-[1024px]:w-[calc(264*var(--fig-u))] aspect-square object-cover" />
            <Image src="/Rectangle917.svg" alt="" width={264} height={264} className="rounded-[12px] w-full min-[1024px]:w-[calc(264*var(--fig-u))] aspect-square object-cover" />
          </div>

          {/* Column 2 — 3 images, offset down */}
          <div className="flex flex-col h-[400px] min-[1024px]:h-[calc(400*var(--fig-u))] gap-3 min-[768px]:gap-4 min-[1024px]:gap-[calc(16*var(--fig-u))] bg-[#F2E2DA] mt-15 min-[768px]:mt-25 min-[1024px]:mt-[calc(150*var(--fig-u))] flex-1 min-[1024px]:flex-none rounded-lg">
            <Image src="/Rectangle912.svg" alt="" width={264} height={264} className="rounded-[12px] w-full min-[1024px]:w-[calc(264*var(--fig-u))] aspect-square object-cover" />
            <Image src="/Rectangle915.svg" alt="" width={264} height={264} className="rounded-[12px] w-full min-[1024px]:w-[calc(264*var(--fig-u))] aspect-square object-cover" />
            <Image src="/Rectangle918.svg" alt="" width={264} height={264} className="rounded-[12px] w-full min-[1024px]:w-[calc(264*var(--fig-u))] aspect-square object-cover" />
          </div>

          {/* Column 3 — 2 images, offset even more */}
          <div className="flex flex-col h-[300px] min-[1024px]:h-[calc(300*var(--fig-u))] gap-3 min-[768px]:gap-4 min-[1024px]:gap-[calc(16*var(--fig-u))] bg-[#F2D09F] mt-30 min-[768px]:mt-50 min-[1024px]:mt-[calc(200*var(--fig-u))] flex-1 min-[1024px]:flex-none rounded-lg">
            <Image src="/Rectangle913.svg" alt="" width={264} height={264} className="rounded-[12px] w-full min-[1024px]:w-[calc(264*var(--fig-u))] aspect-square object-cover" />
            <Image src="/Rectangle916.svg" alt="" width={264} height={264} className="rounded-[12px] w-full min-[1024px]:w-[calc(264*var(--fig-u))] aspect-square object-cover" />
          </div>

        </div>

        {/* Right Content */}
        <div className="flex-1 pt-0 min-[1024px]:pt-[calc(95*var(--fig-u))] md:mb-[8rem] min-[1024px]:mb-[calc(128*var(--fig-u))]">
          <p className="font-taprom text-[16px] min-[768px]:text-[18px] min-[1024px]:text-[calc(48*var(--fig-u))] leading-none text-center min-[1024px]:text-left">
            our origin story
          </p>

          <h2 className="mt-2 min-[1024px]:mt-[calc(8*var(--fig-u))] md:pb-5 min-[1024px]:pb-[calc(20*var(--fig-u))] mx-auto max-w-[338px] text-[32px] max-[1023px]:min-[768px]:text-[28px] max-[900px]:min-[768px]:text-[22px] min-[1024px]:text-[calc(48*var(--fig-u))] font-bold leading-[40px] min-[768px]:leading-[52px] min-[1024px]:leading-[calc(52*var(--fig-u))] tracking-[0.05em] min-[768px]:tracking-normal text-black text-center min-[1024px]:text-left min-[1024px]:mx-0 min-[1024px]:max-w-none">
            How TravelOStyle began
          </h2>

          <div className="mt-10 min-[1024px]:mt-[calc(40*var(--fig-u))] space-y-8 min-[1024px]:space-y-[calc(32*var(--fig-u))] text-[16px] max-[1023px]:min-[768px]:text-[13px] max-[900px]:min-[768px]:text-[12px] min-[1024px]:text-[calc(18*var(--fig-u))] leading-[32px] min-[1024px]:leading-[calc(32*var(--fig-u))] text-black">
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
