"use client";

import Image from "next/image";

export default function TimingSection() {
  return (
    <section className="figma-scale relative w-full bg-[#fbfbfb] min-[444px]:pt-[120px] md:py-16 md:pt-[calc(293*var(--fig-u))] md:pb-[calc(87*var(--fig-u))] md:min-h-[calc(688*var(--fig-u))] overflow-hidden select-none">
      {/* LongLine.svg is a 1920x538 board export holding BOTH strokes — its
          d runs "M-50 192 … 975.5 243" and "M1099 389 … 2037 389", trimmed to
          the board at each end — so its x maps 1:1 onto the page and it wants
          laying out at full width, at its own ratio, against the left edge.
          It was being stretched to 2004x511 from inset-8 instead, which is why
          both curves came out wider and shifted. y=0 sits 29 above the section
          top: the left stroke ends at y 243 and Figma drops the heading 48
          below that, and the heading is 320 into this section. */}
      <Image
        src="/LongLine.svg"
        alt=""
        aria-hidden="true"
        width={1920}
        height={538}
        className="hidden md:block pointer-events-none absolute left-0 top-[calc(29*var(--fig-u))] z-0 w-full h-auto max-w-none"
      />
      {/* Mobile curve. be-the-home.png is 390x206 — the mobile board's full
          width — so it sits flush on the left at its own ratio, the same way
          the desktop LongLine does. The old TriangleLine was stretched into a
          136vw box hung off the right at -15vw.

          390:206 makes it 52.8vw tall at any width. At 390 that is 206 and the
          section already clears it, but by 767 it stands 405 tall and was
          running straight through the heading and both paragraphs.

          From 444 up the section takes a flat 120 of top padding. That is less
          than the curve is tall from about 444 on (52.8vw = 256 at 484), so its
          lower reach runs past the padding and over the heading; the
          alternatives — shrinking it, clipping it, or letting it hang above
          into the previous section — were each ruled out. */}
      <img
        src="/be-the-home.png"
        alt=""
        aria-hidden="true"
        className="block md:hidden pointer-events-none absolute left-0 top-0 z-0 w-full h-auto"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 mt-20 min-[444px]:mt-0 md:mt-0 md:max-w-[calc(1920*var(--fig-u))] md:px-[calc(108*var(--fig-u))]">
        <div className="mt-5 min-[444px]:mt-0 md:mt-0">
          <h2 className="mt-0 text-[30px] md:text-[calc(56*var(--fig-u))] font-bold md:font-semibold leading-[40px] md:leading-[calc(80*var(--fig-u))] tracking-[0.05em] text-ink">
            Be at the right <br className="md:hidden" /> place, at exactly
            <br />
           the right time
          </h2>
          <p className="hidden md:block w-full md:max-w-[calc(1090*var(--fig-u))] md:mt-[calc(40*var(--fig-u))] md:text-[calc(21*var(--fig-u))] md:leading-[calc(36*var(--fig-u))] tracking-[0.05em] text-ink">
            Timing isn&apos;t everything — but it is a lot. Browse our
            TravelOStyle calendar; a collection of journeys by month, so
            you&apos;re travelling alongside the grain of a place. Trust us,
            arriving somewhere in its best season is a rare kind of magic.
          </p>
          <div className="md:hidden mt-5 flex flex-col gap-5 text-[16px] font-medium leading-[20px] text-ink">
            <p>
              Timing isn&apos;t everything — but it is a lot. Travel alongside the grain of a place with TravelOStyle!
            </p>
            <p>
              Trust us, arriving somewhere in its best season is a rare kind of magic
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}