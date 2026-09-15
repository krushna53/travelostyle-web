import Image from "next/image";

export default function JourneySection() {
  return (
    <>
      {/* =========================
          DESKTOP SECTION — Figma "Homepage" on its 1920 board. The banner above
          is 1080 tall, so this section starts at board 1080 and every number
          below is that value minus 1080, multiplied by --fig-u (see
          .figma-scale in globals.css) so it is a fixed pixel value at each
          breakpoint and the literal design pixel at 1920.

            Vector 192 (Line.svg)      1243 x 398.31 at  740 / 1048.5
            Vector 191 (SmallLine.svg)  534 x 168    at -138 / 1784
            heading    957 wide, 54/80 Taprom        at  108 / 1495
            its bar    967 x 53                      at   98 / 1488
            paragraph  1097 wide, 18/36              at  108 / 1577
            Group 2264  316 x 360,   rot -9.87       at 1404 / 1246
            Group 2265  354.86 x 404.27, rot 6.48    at 1315 / 1488
            section height                                     924
      ========================== */}
      <section className="figma-scale hidden md:block relative overflow-hidden bg-[#f6f6f6] w-full h-[calc(924*var(--fig-u))]">

        {/* Both curves are board-cropped exports, so each hangs off the edge it
            runs past and is anchored to the SECTION, not the board: the board
            is 1920*--fig-u, which on a 1149 window is 1016 and would leave them
            stopping 66px short of the page.

            Line.svg is 1183 of Vector 192's 1243 — 740+1243 = 1983 trimmed at
            1920 — so it belongs against the right edge. SmallLine.svg's path
            runs "M-138 170.5 … 396 2.5", exactly the 534 Figma gives it, inside
            a 399 viewBox: trimmed at the left edge, so it goes against that. */}
        <Image
          src="/Line.svg"
          alt=""
          aria-hidden="true"
          width={1183}
          height={404}
          className="pointer-events-none absolute right-0 top-[calc(-34*var(--fig-u))] z-20 w-[calc(1183*var(--fig-u))] h-[calc(404*var(--fig-u))] max-w-none"
        />
        <Image
          src="/SmallLine.svg"
          alt=""
          aria-hidden="true"
          width={399}
          height={173}
          className="pointer-events-none absolute left-0 top-[calc(701.5*var(--fig-u))] z-[1] w-[calc(399*var(--fig-u))] h-[calc(173*var(--fig-u))] max-w-none"
        />

        <div className="relative z-10 mx-auto h-full w-full max-w-[calc(1920*var(--fig-u))]">

          {/* Heading + paragraph, both at board left 108 */}
          <div className="absolute left-[calc(108*var(--fig-u))] top-[calc(415*var(--fig-u))] w-[calc(1097*var(--fig-u))]">
            <h2 className="sub-title-bg hero-bar-home inline-block whitespace-nowrap font-taprom font-normal tracking-[0.05em] text-ink text-[calc(54*var(--fig-u))] leading-[calc(80*var(--fig-u))]">
              Journeys made for you, by you &amp; with you.
            </h2>

            <p className="mt-[calc(8*var(--fig-u))] font-nohemi font-normal tracking-[0.05em] text-[#1A1A1A] text-[calc(18*var(--fig-u))] leading-[calc(36*var(--fig-u))]">
              Make travel feel calmer, clearer, and more worth it with
              TravelOstyle. Our journeys are designed around real people —
              your budgets, your rhythms, your hopes and the realities you
              are working with. We promise you honest guidance, thoughtful
              planning, and a travel experience that feels looked after
              from the get-go.
            </p>
          </div>

          {/* Sparkles. Figma gives these as percentages of the 11623-tall page;
              resolved they land at board 1284/1454, 1284/1512 and 1720/1618. */}
          <Image src="/star.svg" alt="" aria-hidden="true" width={59} height={59}
            className="pointer-events-none absolute z-30 left-[calc(1284*var(--fig-u))] top-[calc(374*var(--fig-u))] w-[calc(58.8*var(--fig-u))] h-auto max-w-none" />
          <Image src="/star.svg" alt="" aria-hidden="true" width={43} height={43}
            className="pointer-events-none absolute z-30 left-[calc(1284*var(--fig-u))] top-[calc(432*var(--fig-u))] w-[calc(42.4*var(--fig-u))] h-auto max-w-none" />
          <Image src="/star.svg" alt="" aria-hidden="true" width={45} height={45}
            className="pointer-events-none absolute z-30 left-[calc(1720*var(--fig-u))] top-[calc(538*var(--fig-u))] w-[calc(44.2*var(--fig-u))] h-auto max-w-none" />

          {/* Rectangle 911 frames. Tree.svg and Road.svg are Figma's own photo
              exports: a square canvas holding the photo already rotated by its
              frame's angle, so each <img> is counter-rotated to sit square in
              the frame and scaled by canvas/photo (328/283, 352/317.8) until
              the PHOTO, not the padding around it, fills the frame. */}
          <div className="absolute left-[calc(1404*var(--fig-u))] top-[calc(166*var(--fig-u))] z-10 w-[calc(316*var(--fig-u))] rotate-[-9.87deg] rounded-[5px] border-2 border-[#2C3078] bg-[#FAFAFA] p-[calc(14.5*var(--fig-u))] pb-[calc(58.5*var(--fig-u))] shadow-[0_15px_25px_rgba(26,26,26,0.1)]">
            <div className="relative aspect-square w-full">
              <img src="/Tree.svg" alt="" aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-auto max-w-none -translate-x-1/2 -translate-y-1/2 w-[115.90%] rotate-[9.8667deg]" />
            </div>
          </div>

          <div className="absolute left-[calc(1315*var(--fig-u))] top-[calc(408*var(--fig-u))] z-10 w-[calc(354.86*var(--fig-u))] rotate-[6.48deg] rounded-[5px] border-2 border-[#2C3078] bg-[#FAFAFA] p-[calc(16.53*var(--fig-u))] pb-[calc(65.94*var(--fig-u))] shadow-[0_15px_25px_rgba(26,26,26,0.1)]">
            <div className="relative aspect-square w-full">
              <img src="/Road.svg" alt="" aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-auto max-w-none -translate-x-1/2 -translate-y-1/2 w-[110.76%] -rotate-[6.4849deg]" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          MOBILE SECTION — Figma "RES_Homepage" on its 390 board. The banner
          above runs to 844, so this section starts there and every number is
          that value minus 844, times --fig-u.

            Vector 223 (ResLine1Journey)  225 x 88          at  198 / 836
            Vector 224 (ResLine2Journey)  115 x 56          at -31.5 / 1144.5
            Vector 225 (ResLine3Journey)  514.37 x 288.99, rot 9.73, at -94.16 / 1225.25
            heading    297 wide, 40/48 Taprom, 3 bars       at   27 / 933
            paragraph 1  337 wide, 16/28                    at   27 / 1099.6
            Group 2388  239.86 x 273.25, rot -9.87          at  138 / 1138
                        (+16 here: see the note on paragraph 1)
            Group 2389  269.35 x 306.86, rot  6.48          at  -27 / 1280
            paragraph 2  337 wide                           at   27 / 1643.6
            section height (paper texture 836+1022)                1014

          All three curves are board-cropped exports, so each carries the edge
          it runs past: ResLine1's path is 225 wide in a 194 viewBox (trimmed at
          390) and belongs on the right; ResLine2's runs "M83.5 … -31.5" in an
          85 viewBox (trimmed at 0) and ResLine3 is the full 390, both on the
          left. Vector 225's 372 height is its bbox AFTER the 9.73deg rotation,
          which is why the file is 372 tall and needs no rotating here.
      ========================== */}
      <section
        className="block md:hidden relative overflow-hidden bg-[#F8F7F5] w-full"
        style={{ "--fig-u": "calc(100vw / 390)" }}
      >
        <div className="relative mx-auto h-[calc(1014*var(--fig-u))] w-[calc(390*var(--fig-u))]">

          <Image src="/ResLine1Journey.svg" alt="" aria-hidden="true" width={194} height={91}
            className="pointer-events-none absolute right-0 top-[calc(-9.25*var(--fig-u))] z-0 w-[calc(194*var(--fig-u))] h-[calc(91*var(--fig-u))] max-w-none" />
          <Image src="/ResLine2Journey.svg" alt="" aria-hidden="true" width={85} height={59}
            className="pointer-events-none absolute left-0 top-[calc(299.25*var(--fig-u))] z-0 w-[calc(85*var(--fig-u))] h-[calc(59*var(--fig-u))] max-w-none" />
          <Image src="/ResLine3Journey.svg" alt="" aria-hidden="true" width={390} height={372}
            className="pointer-events-none absolute left-0 top-[calc(339.9*var(--fig-u))] z-0 w-full h-[calc(372*var(--fig-u))] max-w-none" />

          {/* z-10 keeps .sub-title-bg's z-index -1 bar off the section's own
              background. Figma's three bars are 261, 308 and 171 wide, which is
              where the line breaks fall. */}
          <h2 className="absolute z-30 left-[calc(27*var(--fig-u))] top-[calc(89*var(--fig-u))] font-taprom font-normal leading-[1.2] tracking-[0.05em] text-ink text-[calc(40*var(--fig-u))]">
            {["Journeys made", "for you, by you &", "with you."].map((line) => (
              <span key={line} className="block">
                <span className="sub-title-bg hero-bar-mobile inline-block">{line}</span>
              </span>
            ))}
          </h2>

          <p className="absolute z-30 left-[calc(27*var(--fig-u))] top-[calc(255.6*var(--fig-u))] w-[calc(337*var(--fig-u))] font-nohemi font-normal leading-[1.75] tracking-[0.05em] text-ink text-[calc(16*var(--fig-u))]">
            Make travel feel calmer, clearer, and more worth it with TravelOStyle.
          </p>

          {/* Rectangle 911 frames; Tree.svg and Road.svg hold the photo already
              rotated, so each is counter-rotated and scaled by canvas/photo. */}
          <div className="absolute z-10 left-[calc(138*var(--fig-u))] top-[calc(310*var(--fig-u))] w-[calc(239.86*var(--fig-u))] rotate-[-9.87deg] rounded-[5px] border-2 border-[#2C3078] bg-[#FAFAFA] p-[calc(10.525*var(--fig-u))] pb-[calc(43.915*var(--fig-u))] shadow-[0_15px_25px_rgba(26,26,26,0.1)]">
            <div className="relative aspect-square w-full">
              <img src="/Tree.svg" alt="" aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-auto max-w-none -translate-x-1/2 -translate-y-1/2 w-[115.90%] rotate-[9.8667deg]" />
            </div>
          </div>

          <div className="absolute z-20 left-[calc(-27*var(--fig-u))] top-[calc(452*var(--fig-u))] w-[calc(269.35*var(--fig-u))] rotate-[6.48deg] rounded-[5px] border-2 border-[#2C3078] bg-[#FAFAFA] p-[calc(12.065*var(--fig-u))] pb-[calc(49.575*var(--fig-u))] shadow-[0_15px_25px_rgba(26,26,26,0.1)]">
            <div className="relative aspect-square w-full">
              <img src="/Road.svg" alt="" aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-auto max-w-none -translate-x-1/2 -translate-y-1/2 w-[110.76%] -rotate-[6.4849deg]" />
            </div>
          </div>

          {/* Sparkles. Figma gives these as percentages of the 12952-tall page;
              resolved they sit at 105/1246, 251/1545.3 and 213.7/1569.9. */}
          <Image src="/star.svg" alt="" aria-hidden="true" width={32} height={32}
            className="pointer-events-none absolute z-40 left-[calc(105*var(--fig-u))] top-[calc(418*var(--fig-u))] w-[calc(31.9*var(--fig-u))] h-auto max-w-none" />
          <Image src="/star.svg" alt="" aria-hidden="true" width={34} height={34}
            className="pointer-events-none absolute z-40 left-[calc(251*var(--fig-u))] top-[calc(717.3*var(--fig-u))] w-[calc(33.9*var(--fig-u))] h-auto max-w-none" />
          <Image src="/star.svg" alt="" aria-hidden="true" width={50} height={50}
            className="pointer-events-none absolute z-40 left-[calc(213.7*var(--fig-u))] top-[calc(741.9*var(--fig-u))] w-[calc(49.2*var(--fig-u))] h-auto max-w-none" />

          <p className="absolute z-30 left-[calc(27*var(--fig-u))] top-[calc(799.6*var(--fig-u))] w-[calc(337*var(--fig-u))] font-nohemi font-normal leading-[1.75] tracking-[0.05em] text-ink text-[calc(16*var(--fig-u))]">
            Our journeys are designed around real people — your budgets, your
            rhythms, your hopes and the realities you are working with. We promise
            you honest guidance, thoughtful planning, and a travel experience that
            feels looked after from the get-go.
          </p>
        </div>
      </section>

      <div className="w-full h-[2px] bg-[#4A4A4A] z-20" />
    </>
  );
}