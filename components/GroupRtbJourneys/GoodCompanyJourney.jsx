"use client";
import { useRouter } from "next/navigation";
import React from "react";
import DottedLine from "@/components/ui/DottedLine";

export default function GoodCompaneyJourney() {
  const router = useRouter();
  const description =
    "TravelOStyle group journeys are made to explore a destination beyond its postcard alongside like-minded people. Bonus? There's no chaos of co-ordinating it yourself. The routes are planned, the price is fixed, the dates are set, the logistics are sorted and your group is waiting. All you have to do is decide whether you want to come along!";
  // Each photo SVG is a Figma export of Rectangle 912: a square canvas holding
  // the 346.77px photo ALREADY rotated by its frame's angle, with the 1px
  // #1A1A1A stroke baked in. Two consequences:
  //   - imgRotation cancels that baked angle so the photo sits square inside
  //     the frame; the frame's own `rotation` then puts it back at the Figma
  //     angle on the page. Without it the tilt applies twice.
  //   - the canvas is padded to fit the rotated photo, so it is bigger than
  //     the photo by canvas/346.77. imgScale blows the canvas up by exactly
  //     that factor, which makes the PHOTO (not its padding) fill the frame's
  //     content box, the way Figma has it.
  // translateY / offset are Figma's own left+top for each frame on the 1920
  // board, rescaled to the 19.8%-wide frame this layout actually renders.
  const polaroids = [
    {
      id: 1,
      imgUrl: "/Kampus.svg", // 385 canvas, photo baked at 6.4849deg
      rotation: "rotate-[6.4849deg]",
      imgRotation: "-rotate-[6.4849deg]",
      imgScale: "w-[111.02%]",
      translateY: "translate-y-[calc(110.21*var(--fig-u))]",
      offset: "",
      borderColor: "border-[#1A1A1A]",
      zIndex: "z-10",
    },
    {
      id: 2,
      imgUrl: "/Trecmanfreemind.svg", // 413 canvas, photo baked at -12.0268deg
      rotation: "-rotate-[12.0268deg]",
      imgRotation: "rotate-[12.0268deg]",
      imgScale: "w-[119.10%]",
      translateY: "translate-y-[calc(30.72*var(--fig-u))]",
      offset: "md:-ml-[calc(63.55*var(--fig-u))]",
      borderColor: "border-[#2C3078]",
      zIndex: "z-20",
    },
    {
      id: 3,
      imgUrl: "/ChadWitbooi.svg", // 353 canvas, photo baked at 0.867072deg
      rotation: "rotate-[0.867deg]",
      imgRotation: "-rotate-[0.867deg]",
      imgScale: "w-[101.80%]",
      translateY: "translate-y-[calc(72.19*var(--fig-u))]",
      offset: "md:-ml-[calc(10.18*var(--fig-u))]",
      borderColor: "border-[#2C3078]",
      zIndex: "z-40",
    },
    {
      id: 4,
      imgUrl: "/Minanl.svg", // 375 canvas, photo baked at -4.51117deg
      rotation: "-rotate-[4.5112deg]",
      imgRotation: "rotate-[4.5112deg]",
      imgScale: "w-[108.14%]",
      translateY: "translate-y-0",
      offset: "md:-ml-[calc(87.55*var(--fig-u))]",
      borderColor: "border-[#2C3078]",
      zIndex: "z-20",
    },
    {
      id: 5,
      imgUrl: "/CottonBro.svg", // 397 canvas, photo baked at 8.76569deg
      rotation: "rotate-[8.7657deg]",
      imgRotation: "-rotate-[8.7657deg]",
      imgScale: "w-[114.48%]",
      translateY: "translate-y-[calc(89.66*var(--fig-u))]",
      offset: "md:-ml-[calc(139.78*var(--fig-u))]",
      borderColor: "border-[#2C3078]",
      hasButton: true,
      zIndex: "z-30",
    },
  ];

  return (
    <div className="figma-scale hidden md:flex relative w-full min-h-screen bg-white px-4 py-[calc(64*var(--fig-u))] md:py-[calc(96*var(--fig-u))] overflow-hidden flex-col items-center select-none border-t-[2px] border-[#3f4284]">
      <div className="absolute inset-0 pointer-events-none z-0 hidden md:block">
        {/* This layer spans the SECTION, not the scaled board, so the two
            curves stay welded to the page edges — the board is 1920*--fig-u,
            which on a 1149 window is 1016 and would leave both of them ending
            66px short. Their sizes are still design pixels x --fig-u. They keep their aspect ratio because both axes
            take the same factor — a % height would be measured against a
            min-h-screen section and stretch differently on every viewport.
            Values are the true-bbox boxes of the two paths, not Figma's layer
            boxes, since DottedLine's viewBox is the path's own bounding box.
            Both anchor from the TOP: the section is min-h-screen, so anything
            anchored to its bottom drifts with the viewport height — the sweep
            used to strand itself hundreds of px below the polaroids on a tall
            window. */}
        <DottedLine
          name="groupArc"
          className="top-[calc(39.94*var(--fig-u))] right-0 w-[calc(703*var(--fig-u))] h-[calc(242*var(--fig-u))]"
        />
        {/* Vector 218, the long sweep behind the polaroids, as a flat PNG.
            Figma puts it at left -131 / top 625 in a 1209x508 box on the 1920
            frame, which runs 131px off the left edge — and the PNG is 1081x513,
            i.e. that path already trimmed at the edge (1209-131 = 1078). So it
            sits at left 0 at its own size: stretching it back across the full
            1209 from -131 squeezed the trimmed artwork into the wrong place.
            The section starts 202.6px down the page (header + search bar) and
            the file carries 2.5px of stroke above the path, so top is
            625-2.5-202.6. */}
        <img
          src="/doted-line.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-[calc(419.9*var(--fig-u))] left-0 w-[calc(1081*var(--fig-u))] h-[calc(513*var(--fig-u))]"
        />
      </div>
      <div className="relative w-full text-center z-10 flex flex-col items-center mt-[calc(24*var(--fig-u))]">
        <h2
          className="font-taprom whitespace-nowrap leading-[1.1] tracking-[-0.02em] text-[#222] text-center sub-title-bg hero-bar group-hero-line1 px-[calc(16*var(--fig-u))] py-[calc(4*var(--fig-u))] text-[calc(64.6*var(--fig-u))] "
        
        >
          Journeys that get better in good
        </h2>
        <h2
          className="font-taprom whitespace-nowrap leading-[1.1] tracking-[-0.02em] text-[#222] text-center sub-title-bg hero-bar px-[calc(16*var(--fig-u))] py-[calc(4*var(--fig-u))] text-[calc(64.6*var(--fig-u))]"
        >
          company
        </h2>

        <p className="text-[#333333] max-w-[calc(1183*var(--fig-u))] leading-[1.7] tracking-normal px-[calc(16*var(--fig-u))] font-normal text-[calc(20.4*var(--fig-u))]">
          {description}
        </p>
      </div>

      <div className="relative w-[calc(1872*var(--fig-u))] shrink-0 mt-[calc(48*var(--fig-u))] md:mt-[calc(96*var(--fig-u))] flex flex-wrap md:flex-nowrap justify-center items-start gap-8 md:gap-0 z-10">
        {polaroids.map((photo) => (
          <div
            key={photo.id}
            className={`
              relative bg-[#FAFAFA] p-[calc(17.47*var(--fig-u))] pb-[calc(68.93*var(--fig-u))] shadow-[0_15px_25px_rgba(26,26,26,0.1)] 
              border-2 ${photo.borderColor} rounded-[5px] 
              w-[230px] sm:w-[250px] md:w-[calc(370.66*var(--fig-u))] shrink-0 transform 
              transition-all duration-300 hover:scale-110 hover:!z-50
              ${photo.rotation} ${photo.translateY} ${photo.zIndex} ${photo.offset}
            `}
          >
            {/* Square content box = Figma's 347.77 photo. No border here: the
                SVG already draws Rectangle 912's 1px #1A1A1A stroke. */}
            <div className="relative aspect-square w-full">
              <img
                src={photo.imgUrl}
                alt={`Travel group snapshot ${photo.id}`}
                className={`absolute left-1/2 top-1/2 h-auto max-w-none -translate-x-1/2 -translate-y-1/2 ${photo.imgScale} ${photo.imgRotation}`}
              />
            </div>
            
            {photo.hasButton && (
              <button
                onClick={() => router.push("/comparison")}
                className="absolute top-1/2 right-[calc(-28.8*var(--fig-u))] transform -translate-y-1/2 bg-[#212b68] text-white font-semibold text-[calc(10.5*var(--fig-u))] py-[calc(6*var(--fig-u))] px-[calc(14*var(--fig-u))] rounded-[3px] shadow-[0_4px_12px_rgba(0,0,0,0.3)] tracking-wide hover:bg-[#151c47] transition-colors z-50 whitespace-nowrap border border-white/15"
              >
                Compare Trips
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}