import React from "react";
import Image from "next/image";

export default function Hero() {
  return (
    <>
    {/* MOBILE HERO — Figma "RES_About Us" on its 390 board, which the header
        occupies the first 96px of (32 announcement bar + 64 header):

          heading        363 wide, 40/48 Taprom, centred   at 189  -> 93
          its three bars 315, 315 and 192 wide, 32 tall    at 196, 244, 298
          paragraph 1    337 wide, 16/28 Nohemi 300        at 399.9 -> 303.9
          paragraph 2    336 wide                          at 586.7 -> 490.7
          Vector 235     83x96 export, loop level with line 3 at 292 -> 196
                         (outside the board, on the section's left edge —
                          its path starts at x -63 so it leaves the page,
                          and the board is only 768 wide on a 1020 window)
          image rails start                                at 718   -> 622

        Line breaks are Figma's own: its three bars measure 315/315/192, which
        is where "Making travel feel | like it was always | supposed to" falls.
        They have to be separate elements because .sub-title-bg draws one bar
        per element, not one per line. */}
    <section
      className="min-[1024px]:hidden relative overflow-x-clip"
      /* The 390 board's unit, declared here rather than as a class in
         globals.css: this section runs all the way to 1023 (the desktop board
         only takes over at 1024), so it needs its own ceiling — 768/390 —
         instead of .figma-scale-mobile's uncapped one, which would draw the
         phone design at 2.6x on a 1023 window. */
      style={{ "--fig-u": "min(1.9692px, 100vw / 390)" } as React.CSSProperties}
    >
      <img
        src="/about-hero-dots-mobile.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-[calc(196*var(--fig-u))] w-[calc(83*var(--fig-u))] h-[calc(96*var(--fig-u))] max-w-none"
      />

      <div className="relative mx-auto w-[calc(390*var(--fig-u))] pt-[calc(93*var(--fig-u))] pb-[calc(36.2*var(--fig-u))]">

        {/* z-10 is load-bearing: the peach bar is a z-index -1 ::after, so it
            needs a stacking context or it paints behind the page itself. */}
        <h1 className="relative z-10 text-center">
          {["Making travel feel", "like it was always", "supposed to"].map(
            (line) => (
              <span key={line} className="block">
                <span className="sub-title-bg hero-bar-mobile inline-block font-taprom leading-[1.2] tracking-[0.05em] text-black text-[calc(40*var(--fig-u))]">
                  {line}
                </span>
              </span>
            ),
          )}
        </h1>

        <p className="relative z-10 mx-auto mt-[calc(66.9*var(--fig-u))] w-[calc(337*var(--fig-u))] font-light leading-[1.75] tracking-[0.05em] text-black text-[calc(16*var(--fig-u))]">
          Travel, at its best, is a chance to reconnect with what matters to
          you. An opportunity to see the world differently, or simply provide
          relief, or even come home with a story you actually want to tell.
        </p>

        <p className="relative z-10 mx-auto mt-[calc(35.7*var(--fig-u))] w-[calc(336*var(--fig-u))] font-light leading-[1.75] tracking-[0.05em] text-black text-[calc(16*var(--fig-u))]">
          Not a logistics puzzle. Not a source of pre-departure dread. Not
          something that costs you more energy than it gives back.
        </p>
      </div>
    </section>

    {/* DESKTOP HERO — Figma "About Us" on its 1920 board. The header and the
        search bar take the first 202px of that board, so everything below is
        the board value minus 202, and each one is multiplied by --fig-u (see
        .figma-scale in globals.css) so it is a fixed pixel value at every
        breakpoint and the literal design pixel at 1920.

          Vector 221   1448.5 x 428.85  at  -175 / 249.65
          Vector 220    677.28 x 479.61 at  1333 / 590
          heading       1309 wide, 64/80 Taprom  at  416
          Rectangle 910 1337 x 53       at   292 / 439
          paragraphs    1070 wide, 21/40         at  542.3 and 653.9
          images start                          at  806  -> 604 tall */}
    <section className="figma-scale hidden min-[1024px]:block relative mt-[calc(20*var(--fig-u))] h-[calc(604*var(--fig-u))]">
      <Image
        src="/Vector221.svg"
        alt=""
        aria-hidden="true"
        width={1276}
        height={434}
        className="pointer-events-none absolute left-0 top-[calc(46.4*var(--fig-u))] w-[calc(1276*var(--fig-u))] h-[calc(434*var(--fig-u))] max-w-none"
      />
      <Image
        src="/Vector220.svg"
        alt=""
        aria-hidden="true"
        width={590}
        height={484}
        className="pointer-events-none absolute z-0 right-0 top-[calc(386.75*var(--fig-u))] w-[calc(590*var(--fig-u))] h-[calc(484*var(--fig-u))] max-w-none"
      />

      <div className="relative mx-auto h-full w-full max-w-[calc(1920*var(--fig-u))]">

        {/* Both curves were exported cropped at the board edge — Vector 221
            starts at left -175 and Vector 220 runs past 1920 — so each is laid
            out at its own pixel size from where its visible part begins. They
            sit outside the board and against the SECTION's edges: the board is
            capped at 1920*--fig-u, which on a 1149 window is 1016 and would
            have left both curves stopping 66px short of the page.
            Vector 220 also drops 266px below this section, past the images that
            follow, which is why the section does not clip. */}

        <h1 className="absolute inset-x-0 top-[calc(214*var(--fig-u))] z-10 text-center">
          <span className="sub-title-bg hero-bar-about inline-block font-taprom whitespace-nowrap leading-[1.25] tracking-[0.05em] text-black text-[calc(64*var(--fig-u))]">
            Making travel feel like it was always supposed to
          </span>
        </h1>

        <p className="absolute left-1/2 -translate-x-1/2 top-[calc(340.3*var(--fig-u))] z-10 w-[calc(1070*var(--fig-u))] text-center font-light leading-[1.905] tracking-[0.05em] text-black text-[calc(21*var(--fig-u))]">
          Travel, at its best, is a chance to reconnect with what matters to you. An opportunity to see the
          <br />
          world differently, or simply provide relief, or even come home with a story you actually want to tell.
        </p>

        <p className="absolute left-1/2 -translate-x-1/2 top-[calc(451.9*var(--fig-u))] z-10 w-[calc(1070*var(--fig-u))] text-center font-light leading-[1.905] tracking-[0.05em] text-black text-[calc(21*var(--fig-u))]">
          Not a logistics puzzle. Not a source of pre-departure dread. Not something
          <br />
          that costs you more energy than it gives back.
        </p>
      </div>
    </section>
    </>
  );
}