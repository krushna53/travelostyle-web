import Image from "next/image";

export default function TravelBetter() {
  const cardClass =
    "rounded-[10px] border-[2px] border-[#2C3078] p-[24px] w-full max-w-[337px] h-[209px] mx-auto flex flex-col min-[1024px]:max-w-none min-[1024px]:p-[calc(16*var(--fig-u))] min-[1024px]:h-[calc(209*var(--fig-u))]";

  return (
    <section className="relative px-4 min-[768px]:px-[60px] min-[1024px]:px-[calc(113*var(--fig-u))] pt-[60px] min-[430px]:pt-[calc(29.48vw)] min-[1024px]:pt-[calc(140*var(--fig-u))] pb-[60px] min-[1024px]:pb-[calc(120*var(--fig-u))] overflow-x-clip figma-scale">
      {/* Curve Line — desktop. Vector 222 is a 1920x1407 export drawn in board
          coordinates (its path literally begins "M-114 1394.9"), so it is laid
          out at its own size rather than stretched into this section's box.

          Anchored from the BOTTOM, not the top: Figma ends the curve at board
          3183 and starts the next section's table at 3280, so its tail sits 63
          below this section's bottom edge (cards end 3000 + 120 padding).
          Anchoring from the top instead made the tail land wherever the content
          above happened to finish, and since this section is shorter than the
          board's, the curve ran on down into the table. */}
      <Image
        src="/Vector 222.svg"
        alt=""
        aria-hidden="true"
        width={1920}
        height={1407}
        className="hidden min-[1024px]:block pointer-events-none absolute left-0 bottom-[calc(-63*var(--fig-u))] w-full h-auto max-w-none z-0"
      />

      {/* Curve Line — mobile. Vector 237 on the 390 board: 454.5 x 185.58 at
          left -41 / top 1841, and this export is that path trimmed to the
          board — its own d runs "M-41 178.308 … 413.5 2.80643", so the file is
          exactly 390 wide and its x maps 1:1 onto the board, and h-auto then
          reproduces the 390:189 ratio. "ways we like to travel" sits at board
          2038 and 60 into this section, putting the section top at 1978 and the
          curve at 1841-1978 = -137, which is -35.56vw of that board.

          Capped at the board's own 390 rather than left to fill: this block
          runs all the way to 1023 (the desktop board only takes over at 1024)
          while the type beside it stays on a fixed-px ladder, so a curve that
          kept growing drew a 174px loop next to 28px text on a 964 window. The
          offset is capped with it — it has to stay 0.3513 of whatever width the
          curve ends up at.

          Anchored LEFT, because that is the end the path runs off: its d
          starts at x -41, outside the board, so the tail is meant to leave
          the page edge and the loop to sit inland.

          Full bleed, in two regimes. Up to 429 it is Figma's own: the curve
          hangs 35.56vw above the section and the paragraph up there clears it,
          because on the 390 board that paragraph is 339 of 390 wide and the
          overhang passes down its right-hand side.

          That trick stops working as the window widens: the text above starts
          running edge to edge while the overhang keeps growing, until on a 1020
          window it is 405px and lands across three or four lines. So from 430
          the overhang is pinned to 45% of the curve's height (21.8vw of its
          48.46vw) and the section's padding carries the rest.

          45% rather than none because the padding IS the curve — reserving its
          whole height costs 505px above the heading on a 1020 window. What goes
          above the section is the top of the path, and that lives in the right
          quarter of the artwork (its d climbs from x 286 to 413 of 390), so it
          passes beside the line ends rather than through the paragraph. Below
          430 the board is reproduced exactly. */}
      <img
        src="/about-travelbetter-dots-mobile.svg"
        alt=""
        aria-hidden="true"
        className="min-[1024px]:hidden pointer-events-none absolute left-0 top-[-35.56vw] min-[430px]:top-[-21.8vw] w-full h-auto z-0"
      />

      <div className="relative z-10 max-w-[530px] min-[1024px]:max-w-[900px]">
        <p className="font-taprom text-[48px] max-[1910px]:text-[43px] max-[1281px]:text-[38px] max-[1250px]:text-[33px] max-[1200px]:text-[28px] min-[1024px]:text-[calc(48*var(--fig-u))] font-normal leading-[32px] min-[1024px]:leading-[calc(64*var(--fig-u))] tracking-[0.05em] text-black [text-box-trim:cap] [text-box-edge:cap_alphabetic]">
          ways we like to travel
        </p>

        <h2 className="mt-3 min-[1024px]:mt-[calc(12*var(--fig-u))] text-[48px] max-[1910px]:text-[43px] max-[1281px]:text-[38px] max-[1250px]:text-[33px] max-[1200px]:text-[28px] min-[1024px]:text-[calc(48*var(--fig-u))] font-bold leading-[40px] min-[1024px]:leading-[calc(40*var(--fig-u))] tracking-[0.05em] text-black [text-box-trim:cap] [text-box-edge:cap_alphabetic] w-[292px] min-[768px]:w-auto">
          Travel better with us
        </h2>

       <p className="mt-8 min-[1024px]:mt-[calc(32*var(--fig-u))] max-w-[1000px] min-[1024px]:max-w-[900px] min-[390px]:text-[18px] mr-[2px]text-[19px] max-[1910px]:text-[16px] min-[1024px]:text-[calc(18*var(--fig-u))] font-normal leading-[28px] min-[1024px]:leading-[calc(28*var(--fig-u))] tracking-[0.03em] text-black [text-box-trim:cap] [text-box-edge:cap_alphabetic]">
We offer a curated collection
  <br className="min-[390px]:block min-[1024px]:hidden" />
  of ready-to-book journeys across the world &mdash; across{" "}
  <br className="hidden min-[1024px]:block" />
  travel styles, budget points, and modes of travel. Alongside that, we personalise journeys{" "}
  <br className="hidden min-[1024px]:block" />
  for those who want something that&rsquo;s truly, specifically theirs.
</p>
      </div>

      {/* Cards */}
      <div className="relative z-10 mt-[40px] min-[768px]:mt-[70px] min-[1024px]:mt-[calc(70*var(--fig-u))]">
        {/* Row 1 */}
        <div className="grid grid-cols-1 min-[640px]:grid-cols-2 min-[1024px]:grid-cols-4 gap-5 min-[768px]:gap-8 min-[1024px]:gap-[calc(100*var(--fig-u))]">
          <div className={`${cardClass} bg-[#EFF3CF]`}>
            <p className="text-[20px] max-[1910px]:text-[15px] max-[1281px]:text-[13px] min-[1024px]:text-[calc(20*var(--fig-u))]">✦</p>
            <h3 className="mt-4 min-[1024px]:mt-[calc(16*var(--fig-u))] text-[21px] max-[1910px]:text-[18px] min-[1024px]:text-[calc(21*var(--fig-u))] font-semibold leading-[28px] min-[1024px]:leading-[calc(28*var(--fig-u))] tracking-[0.05em]">Group Journeys</h3>
            <p className="mt-3 min-[1024px]:mt-[calc(12*var(--fig-u))] text-[16px] max-[1910px]:text-[13px] min-[1024px]:text-[calc(16*var(--fig-u))] leading-[24px] min-[1024px]:leading-[calc(24*var(--fig-u))] tracking-[0.05em]">
              Curated journeys with shared departures.
            </p>
          </div>

          <div className={`${cardClass} bg-[#C2E5FF]`}>
            <p className="text-[20px] max-[1910px]:text-[15px] max-[1281px]:text-[13px] min-[1024px]:text-[calc(20*var(--fig-u))]">✦</p>
            <h3 className="mt-4 min-[1024px]:mt-[calc(16*var(--fig-u))] text-[21px] max-[1910px]:text-[18px] min-[1024px]:text-[calc(21*var(--fig-u))] font-semibold leading-[28px] min-[1024px]:leading-[calc(28*var(--fig-u))] tracking-[0.05em]">Private Journeys</h3>
            <p className="mt-3 min-[1024px]:mt-[calc(12*var(--fig-u))] text-[16px] max-[1910px]:text-[13px] min-[1024px]:text-[calc(16*var(--fig-u))] leading-[24px] min-[1024px]:leading-[calc(24*var(--fig-u))] tracking-[0.05em]">
              Pre-planned journeys customized for you
            </p>
          </div>

          <div className={`${cardClass} bg-[#FFDDBD]`}>
            <p className="text-[20px] max-[1910px]:text-[15px] max-[1281px]:text-[13px] min-[1024px]:text-[calc(20*var(--fig-u))]">✦</p>
            <h3 className="mt-4 min-[1024px]:mt-[calc(16*var(--fig-u))] text-[21px] max-[1910px]:text-[18px] min-[1024px]:text-[calc(21*var(--fig-u))] font-semibold leading-[28px] min-[1024px]:leading-[calc(28*var(--fig-u))] tracking-[0.05em]">Tailormade Journeys</h3>
            <p className="mt-3 min-[1024px]:mt-[calc(12*var(--fig-u))] text-[16px] max-[1910px]:text-[13px] min-[1024px]:text-[calc(16*var(--fig-u))] leading-[24px] min-[1024px]:leading-[calc(24*var(--fig-u))] tracking-[0.05em]">
              Start from scratch &amp; take a trip that's entirely yours
            </p>
          </div>

          <div className={`${cardClass} bg-[#F2E2DA]`}>
            <p className="text-[20px] max-[1910px]:text-[15px] max-[1281px]:text-[13px] min-[1024px]:text-[calc(20*var(--fig-u))]">✦</p>
            <h3 className="mt-4 min-[1024px]:mt-[calc(16*var(--fig-u))] text-[21px] max-[1910px]:text-[18px] min-[1024px]:text-[calc(21*var(--fig-u))] font-semibold leading-[28px] min-[1024px]:leading-[calc(28*var(--fig-u))] tracking-[0.05em]">Cruises</h3>
            <p className="mt-3 min-[1024px]:mt-[calc(12*var(--fig-u))] text-[16px] max-[1910px]:text-[13px] min-[1024px]:text-[calc(16*var(--fig-u))] leading-[24px] min-[1024px]:leading-[calc(24*var(--fig-u))] tracking-[0.05em]">
              Sea and river journeys with changing views
            </p>
          </div>
        </div>

        {/* Row 2 */}
        <div className="mt-5 min-[1024px]:mt-[calc(20*var(--fig-u))] grid grid-cols-1 min-[640px]:grid-cols-2 min-[1024px]:grid-cols-4 gap-5 min-[768px]:gap-8 min-[1024px]:gap-[calc(100*var(--fig-u))] items-center">
          <div className={`${cardClass} bg-[#FAFAFA]`}>
            <p className="text-[20px] max-[1910px]:text-[15px] max-[1281px]:text-[13px] min-[1024px]:text-[calc(20*var(--fig-u))]">✦</p>
            <h3 className="mt-4 min-[1024px]:mt-[calc(16*var(--fig-u))] text-[21px] max-[1910px]:text-[18px] min-[1024px]:text-[calc(21*var(--fig-u))] font-semibold leading-[28px] min-[1024px]:leading-[calc(28*var(--fig-u))] tracking-[0.05em]">Land &amp; Rail Journeys</h3>
            <p className="mt-3 min-[1024px]:mt-[calc(12*var(--fig-u))] text-[16px] max-[1910px]:text-[13px] min-[1024px]:text-[calc(16*var(--fig-u))] leading-[24px] min-[1024px]:leading-[calc(24*var(--fig-u))] tracking-[0.05em]">
              Scenic routes that can be experienced with a group or privately
            </p>
          </div>

          <div className={`${cardClass} bg-[#EFF3CF]`}>
            <p className="text-[20px] max-[1910px]:text-[15px] max-[1281px]:text-[13px] min-[1024px]:text-[calc(20*var(--fig-u))]">✦</p>
            <h3 className="mt-4 min-[1024px]:mt-[calc(16*var(--fig-u))] text-[21px] max-[1910px]:text-[18px] min-[1024px]:text-[calc(21*var(--fig-u))] font-semibold leading-[28px] min-[1024px]:leading-[calc(28*var(--fig-u))] tracking-[0.05em]">Private Jet Journeys</h3>
            <p className="mt-3 min-[1024px]:mt-[calc(12*var(--fig-u))] text-[16px] max-[1910px]:text-[13px] min-[1024px]:text-[calc(16*var(--fig-u))] leading-[24px] min-[1024px]:leading-[calc(24*var(--fig-u))] tracking-[0.05em]">
              Luxurious air travel so you can move freely through the world
            </p>
          </div>

          <div className="min-[640px]:col-span-2 min-[1024px]:col-span-2 pt-[18px] min-[1024px]:self-start min-[1024px]:pt-[calc(27.4*var(--fig-u))] min-[1024px]:pl-[calc(15*var(--fig-u))]">
            {/* DESKTOP — Figma's own three lines, Taprom 48/64/5%, 787 wide at
                board 1025 / cap-top 2819, i.e. 28 under the card row's 2791
                top. Rectangle 1009 (345x40 at 1394/2825) sits behind "because
                we don't" and Rectangle 1010 (552x40 at 1025/2892) behind
                "believe in a one-size-fits all". The breaks are the board's, so
                they are hard lines here; the bars are .hero-bar-range.

                self-start rather than the row's items-center, so the cap top is
                pinned to the cards' top edge instead of floating with whatever
                height three 64px lines add up to.

                Measured against the card ABOVE it, not the row it sits in: the
                board leaves 62px from Rectangle 925's bottom (2757) to this cap
                top (2819), but its card rows are 34 apart where ours are 20, so
                pinning to row two's top left it 12px tight under Tailormade.
                27.4 is that 62 less the row gap, less the 12.6px the browser
                sets Taprom's cap top into a 64px line box. */}
            <p className="hidden min-[1024px]:block font-taprom font-normal text-[calc(48*var(--fig-u))] leading-[calc(64*var(--fig-u))] tracking-[0.05em] text-[#000000]">
              <span className="block whitespace-nowrap">
                Our range is wide{" "}
                <span className="sub-title-bg hero-bar-range hero-bar-range-line1 inline-block">because we don&apos;t</span>
              </span>
              <span className="block whitespace-nowrap">
                <span className="sub-title-bg hero-bar-range inline-block">believe in a one-size-fits all</span>{" "}
                approach
              </span>
              <span className="block whitespace-nowrap">to the world</span>
            </p>

            {/* MOBILE — "RES_About Us" on the 390 board: Taprom 40/48/5%, five
                lines, left 27, cap-top 3829 = 48 under the Private Jet card.
                Rectangle 1013 (152x32 @149/3885) is behind "we don't",
                1048 (342x32 @26/3931) behind "believe in a one-size-" and 1049
                (275x32 @26/3982) behind "fits all approach". The breaks are
                the board's, so they are hard lines; each is nowrap so a
                narrower phone cannot re-wrap them out from under their rects.

                Sized in min(px, vw) so 390 is the literal board and anything
                narrower scales the whole block down instead of running off the
                right edge -- line three is 342 of the board's 363. The bars are
                em, so they follow. */}
            <p className="min-[1024px]:hidden font-taprom font-normal text-[min(40px,10.2564vw)] leading-[1.2] tracking-[0.05em] text-[#000000] pl-[calc(min(27px,6.9231vw)-16px)] min-[768px]:pl-0">
              <span className="block whitespace-nowrap">Our range is wide</span>
              <span className="block whitespace-nowrap">
                because{" "}
                <span className="sub-title-bg hero-bar-range-m hero-bar-range-m1 inline-block">we don&apos;t</span>
              </span>
              <span className="block whitespace-nowrap">
                <span className="sub-title-bg hero-bar-range-m hero-bar-range-m2 inline-block">believe in a one-size-</span>
              </span>
              <span className="block whitespace-nowrap">
                <span className="sub-title-bg hero-bar-range-m hero-bar-range-m3 inline-block">fits all approach</span>{" "}
                to
              </span>
              <span className="block whitespace-nowrap">the world</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}