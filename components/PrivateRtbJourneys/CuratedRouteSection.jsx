"use client";
import { useRouter } from "next/navigation";
import React from "react";

// Figma "Private RTB Journeys", the Day 1-8 polaroid trail. Every frame is a
// Rectangle 911 (2px #1A1A1A, 5px radius, #FAFAFA) wrapping a SQUARE Rectangle
// 912 photo with its own 1px #1A1A1A hairline, and the chin below it carries
// the DAY label. Figma's numbers, on its 1920 board:
//
//   day  left      top      frame w x h        rot      photo
//   1     126.00   623.00   388.32 x 442.39    6.48    347.77
//   2     438.31   606.12   269.10 x 306.57   -1.23    241.00
//   4     605.15   748.31   269.10 x 306.57    8.65    241.00
//   5     810.65   567.57   388.32 x 442.39   -0.01    347.77
//   6    1095.70   717.22   325.60 x 370.94   12.27    291.60
//   7    1254.09   541.46   269.10 x 306.57   -3.68    241.00
//   8    1494.74   397.25   338.33 x 385.44    0.07    303.00
//
// Those exact numbers are what appears below, each one multiplied by
// --fig-u (see .figma-scale in globals.css) so it lands on a fixed pixel value
// at every breakpoint and on the literal design pixel at 1920. `top` is
// measured from the band's own top, which is Day 8's 397.25, and the inset is
// (frame - 2*border - photo) / 2 with the chin taking what is left.
const routeDays = [
  {
    day: "DAY 1",
    img: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=600",
    box: "left-[calc(126*var(--fig-u))] top-[calc(225.75*var(--fig-u))] w-[calc(388.32*var(--fig-u))] rotate-[6.48deg] z-20",
    padding: "p-[calc(18.28*var(--fig-u))] pb-[calc(72.34*var(--fig-u))]",
    chin: "h-[calc(72.34*var(--fig-u))]",
  },
  {
    day: "DAY 2",
    img: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=600",
    box: "left-[calc(438.31*var(--fig-u))] top-[calc(208.87*var(--fig-u))] w-[calc(269.1*var(--fig-u))] -rotate-[1.23deg] z-40",
    padding: "p-[calc(12.05*var(--fig-u))] pb-[calc(49.52*var(--fig-u))]",
    chin: "h-[calc(49.52*var(--fig-u))]",
    // Day 4 is stacked over this card and its left edge crosses the chin's
    // right half, landing ~6px after the "2". Centring the label on the
    // uncovered part of the chin instead gives it room on both sides.
    labelShift: "-translate-x-[calc(18*var(--fig-u))]",
  },
  {
    day: "DAY 4",
    img: "https://images.unsplash.com/photo-1498307833015-e7b400441eb8?w=600",
    box: "left-[calc(605.15*var(--fig-u))] top-[calc(351.06*var(--fig-u))] w-[calc(269.1*var(--fig-u))] rotate-[8.65deg] z-50",
    padding: "p-[calc(12.05*var(--fig-u))] pb-[calc(49.52*var(--fig-u))]",
    chin: "h-[calc(49.52*var(--fig-u))]",
  },
  {
    day: "DAY 5",
    img: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=600",
    box: "left-[calc(810.65*var(--fig-u))] top-[calc(170.32*var(--fig-u))] w-[calc(388.32*var(--fig-u))] rotate-[0deg] z-30",
    padding: "p-[calc(18.28*var(--fig-u))] pb-[calc(72.34*var(--fig-u))]",
    chin: "h-[calc(72.34*var(--fig-u))]",
  },
  {
    day: "DAY 6",
    img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600",
    box: "left-[calc(1095.7*var(--fig-u))] top-[calc(319.97*var(--fig-u))] w-[calc(325.6*var(--fig-u))] rotate-[12.27deg] z-10",
    padding: "p-[calc(15*var(--fig-u))] pb-[calc(60.34*var(--fig-u))]",
    chin: "h-[calc(60.34*var(--fig-u))]",
  },
  {
    day: "DAY 7",
    img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600",
    box: "left-[calc(1254.09*var(--fig-u))] top-[calc(144.21*var(--fig-u))] w-[calc(269.1*var(--fig-u))] -rotate-[3.68deg] z-[60]",
    padding: "p-[calc(12.05*var(--fig-u))] pb-[calc(49.52*var(--fig-u))]",
    chin: "h-[calc(49.52*var(--fig-u))]",
  },
  {
    day: "DAY 8",
    img: "https://images.unsplash.com/photo-1498307833015-e7b400441eb8?w=600",
    box: "left-[calc(1494.74*var(--fig-u))] top-0 w-[calc(338.33*var(--fig-u))] rotate-[0.07deg] z-[70]",
    padding: "p-[calc(15.665*var(--fig-u))] pb-[calc(62.775*var(--fig-u))]",
    chin: "h-[calc(62.775*var(--fig-u))]",
  },
];

// Stacking is the board's layer order, bottom to top: day 6, 1, 5, 2, 4, 7, 8
// -- so 2 overlaps 1, 4 overlaps 2 and 5, 5 overlaps 6, and 7 then 8 sit on
// top of the right-hand run.
export default function CuratedRouteSection() {
  const router = useRouter();
  return (
    <div className="figma-scale hidden md:flex w-full  bg-white relative flex flex-col items-center overflow-hidden select-none border-t-[1px] border-[#3f4284]">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&display=swap');
        .cursive-font {
          font-family: 'Caveat', cursive, sans-serif !important;
        }
      `,
        }}
      />

  

      <img
        src="/doted-line-pg.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-[calc(134.4*var(--fig-u))] z-0 h-auto w-full"
      />

      {/* Figma "Private RTB Journeys", 1920 board: "A curated route, perfected
          by / you, for you" in Taprom 64/80/5% #1A1A1A, 862 wide, cap-top 336;
          Rectangle 932 862x53 at 529/329 and Rectangle 933 362x53 at 769/417.
          The wrapper keeps the 158.12 the old two headings took up, so the
          polaroid board below does not move; the heading sits absolutely
          inside it at its Figma line-box top (cap-top less the 15px the
          browser sets Taprom's cap top into an 80px line box). Bars are
          .hero-bar-private1/2. */}
      <div className="relative w-full z-10 mt-[calc(60*var(--fig-u))] h-[calc(158.12*var(--fig-u))]">
        <h2 className="absolute inset-x-0 top-[calc(56.8*var(--fig-u))] text-center font-taprom font-normal whitespace-nowrap tracking-[0.05em] text-[#1A1A1A] text-[calc(64*var(--fig-u))] leading-[calc(80*var(--fig-u))]">
          <span className="block w-fit mx-auto sub-title-bg hero-bar-private1">
            A curated route, perfected by
          </span>
          <span className="block w-fit mx-auto sub-title-bg hero-bar-private2">
            you, for you
          </span>
        </h2>
      </div>

    
      <div className="relative z-20 h-[calc(729.6*var(--fig-u))] w-[calc(1920*var(--fig-u))] shrink-0">
        {routeDays.map((item, index) => (
          <div
            key={index}
            className={`absolute rounded-[5px] border-2 border-[#1A1A1A] bg-[#FAFAFA] shadow-[0_15px_25px_rgba(26,26,26,0.1)] transition-transform duration-200 hover:scale-105 hover:z-50 ${item.box} ${item.padding}`}
          >
            {/* Rectangle 912 — square, with its own 1px hairline. */}
            <div className="aspect-square w-full overflow-hidden border border-[#1A1A1A]">
              <img
                src={item.img}
                alt={item.day}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            {/* The label lives in the chin, i.e. the padding-bottom strip. */}
            <div
              className={`absolute inset-x-0 bottom-0 flex items-center justify-center text-[calc(21*var(--fig-u))] font-semibold uppercase leading-none tracking-[0.05em] text-black ${item.chin} ${item.labelShift ?? ""}`}
            >
              {item.day}
            </div>
          </div>
        ))}
        {/* Figma: 210x47 at left 1602 / top 1011, radius 10, 2px #EFF3CF
            border, #2C3078 fill. The band starts at 397.25, so top is
            1011-397.25 = 613.75. All of it /19.2 into vw so it tracks the
            cards. Unlike the pill buttons elsewhere on the board this one is a
            rounded rect with a stroke, so it is not the shared button style. */}
        <button
          onClick={() => router.push("/comparison")}
          className="absolute left-[calc(1602*var(--fig-u))] top-[calc(613.75*var(--fig-u))] z-50 flex h-[calc(47*var(--fig-u))] w-[calc(210*var(--fig-u))] items-center justify-center rounded-[calc(10*var(--fig-u))] border-2 border-[#EFF3CF] bg-[#2C3078] text-[calc(18*var(--fig-u))] font-semibold leading-none tracking-[0.05em] text-[#FAFAFA] transition-colors duration-150 hover:bg-[#1a2353]"
        >
          Compare Trips
        </button>
      </div>
    </div>
  );
}