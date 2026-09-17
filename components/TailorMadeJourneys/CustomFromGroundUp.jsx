import Image from "next/image";
import React from "react";

export default function CustomFromGroundUp() {
  return (
    <>
      <section className="relative bg-white pt-8 sm:pt-10 pb-2 overflow-x-clip md:overflow-hidden" style={{ paddingInline: "clamp(26px, 3.6vw, 69px)" }}>
        <div className="gap-8 items-start relative max-w-[1704px] mx-auto">
          <div className="md:col-span-7 space-y-6 md:pr-8 relative">
          
            {/* MOBILE — "RES_Tailor Made Journeys", 390 board. Measured off
                the board render (its CSS export stops before this section):
                  heading   Taprom 40/48/5%, two lines, 32px peach bars
                  curve     tailor-doted.png at its own 191x202, flush with
                            the board's right edge (the path runs past 191 and
                            is cut there), top 35px above the button's bottom
                  paragraph Nohemi 16/28/5%
                The curve was squeezed into a 180x150 box before, which drew
                it at 142px, and sat 26px short of the edge because the
                section's side padding was between it and the board edge.
                The path runs off the board's right edge, so it is pinned to the
                SECTION's right edge — right: minus the section's own side
                padding — and never floats mid-page on wider phones (762). At
                390 that is the same spot as before (199..390). ResLine2's path
                starts at x -31.5 and is cut at 0, so it goes flush against the
                section's left edge the same way.
                The curve rises above this section's top, so on mobile the
                section clips only sideways (overflow-x-clip); overflow-hidden
                cut its tail off. */}
            <div className="block md:hidden relative pt-[6px]">
              <div className="absolute top-[-132px] right-[calc(-1*clamp(26px,3.6vw,69px))] w-[191px] h-[202px] z-0 pointer-events-none">
                <Image
                  src="/tailor-doted.png"
                  alt="Dashed Swirl Line"
                  width={191}
                  height={202}
                  className="w-[191px] h-[202px] max-w-none"
                  priority
                />
              </div>
              <h2 className="relative z-10 mb-[68px] font-taprom text-[40px] leading-[48px] tracking-[0.05em] font-normal text-[#111111]">
                <span className="block">
                  <span className="sub-title-bg hero-bar-custom-m hero-bar-custom-m1 inline-block">Custom, from</span>
                </span>
                <span className="block">
                  <span className="sub-title-bg hero-bar-custom-m hero-bar-custom-m2 inline-block">the ground up</span>
                </span>
              </h2>

              <div className="absolute left-[calc(-1*clamp(26px,3.6vw,69px))] bottom-[-65px] z-0 pointer-events-none">
                <Image
                  src="/ResLine2Journey.svg"
                  alt="Journey Line"
                  width={80}
                  height={80}
                  className="w-[80px] h-auto"
                  priority
                />
              </div>
            </div>
            <div className="hidden md:inline-block relative w-fit my-0">
              <span className="absolute inset-x-0 top-[0.18em] bottom-[0.16em] bg-[#F3E3DC] rounded-xs" />
              <h2 className="relative z-10 font-taprom text-4xl sm:text-5xl md:text-[44px] text-[#111111] leading-[1.15] px-2 tracking-wide font-normal">
                Custom, from the ground up
              </h2>
            </div>
            <div className="font-nohemi max-md:font-[Nohemi] max-md:font-normal space-y-5 mt-4 text-black text-[16px] font-light sm:text-sm md:text-[21px] leading-[28px] md:leading-[1.85] tracking-[0.05em] md:tracking-normal max-w-[min(1052px,calc(100%-360px))] max-md:w-[calc(100vw-40px)] max-md:max-w-[339px] relative z-10">
    
              <p>
                We start where you are, not where we like you to be or where the
                average itinerary tends to go. We begin with your reality — your
                time, your budget, your energy, your hopes, your habits — and
                from there, we show you how far that can take you.
              </p>

              <p>
                If a destination is more beautiful in a different season, we’ll
                tell you. If there’s a better-value option that delivers the
                same experience, we’ll offer it. If something genuinely won’t
                work for your group, we’ll let you know. And we’ll suggest what
                will.
              </p>

              <p>
                Tailor-made journeys aren’t simply about the itinerary document.
                TravelOStyle advisors are available throughout the process —
                during planning, before departure, and on the ground if you need
                us.
              </p>
            </div>
          </div>
          <div className="hidden md:flex md:col-span-5 justify-end items-start md:absolute md:right-[clamp(-111px,-5.8vw,-45px)] md:top-[clamp(-94px,-4.9vw,-40px)] z-10">
  <Image
    src="/ground-up.png"
    alt="Dashed Swirl Line Journey Vector"
    width={698}
    height={343}
    className="h-auto w-[clamp(420px,36.35vw,698px)] object-contain"
    priority
  />
</div>
        </div>
      </section>
    </>
  );
}
