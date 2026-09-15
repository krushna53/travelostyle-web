"use client";

// Figma "RES_Group Journeys", the hero. A 390 board with its own composition:
// the polaroids drop down the page in a column instead of fanning across a
// row, and there are FOUR of them — the CottonBro card that closes the desktop
// fan is not on this board. Figma's numbers:
//
//   frame left/top   frame w x h        rot      photo    border
//    -35/399         268.23 x 305.58    6.48    240.22    #1A1A1A
//    131/568         268.23 x 305.58  -12.03    240.22    #2C3078
//     18/831         268.23 x 305.58    0.87    240.22    #2C3078
//    134/995         268.23 x 305.58   -4.51    240.22    #2C3078
//
// `top` below is that value minus 96 — the 32px announcement bar plus the 64px
// header sit above this section — and every number is multiplied by --fig-u
// (see .figma-scale-mobile in globals.css) so it is a fixed pixel value at 390
// and scales down on narrower phones.
//
// The photo SVGs are the same ones the desktop hero uses: a square canvas
// holding the 346.77 photo already rotated by the frame's angle, with its 1px
// #1A1A1A stroke baked in. So imgRotation cancels that baked angle and
// imgScale (canvas / 346.77) blows the canvas up until the PHOTO, rather than
// the padding Figma added around it, fills the frame. The board's angles are
// the same as the desktop board's, so the same exports fit both.
const polaroids = [
  {
    id: 1,
    imgUrl: "/Kampus.svg", // 385 canvas, photo baked at 6.4849deg
    box: "left-[calc(-35*var(--fig-u))] top-[calc(303*var(--fig-u))] w-[calc(268.23*var(--fig-u))] rotate-[6.48deg] z-10",
    imgRotation: "-rotate-[6.4849deg]",
    imgScale: "w-[111.02%]",
    borderColor: "border-[#1A1A1A]",
  },
  {
    id: 2,
    imgUrl: "/Trecmanfreemind.svg", // 413 canvas, baked at -12.0268deg
    box: "left-[calc(131*var(--fig-u))] top-[calc(472*var(--fig-u))] w-[calc(268.23*var(--fig-u))] -rotate-[12.03deg] z-20",
    imgRotation: "rotate-[12.0268deg]",
    imgScale: "w-[119.10%]",
    borderColor: "border-[#2C3078]",
  },
  {
    id: 3,
    imgUrl: "/ChadWitbooi.svg", // 353 canvas, baked at 0.867072deg
    box: "left-[calc(18*var(--fig-u))] top-[calc(735*var(--fig-u))] w-[calc(268.23*var(--fig-u))] rotate-[0.87deg] z-30",
    imgRotation: "-rotate-[0.867deg]",
    imgScale: "w-[101.80%]",
    borderColor: "border-[#2C3078]",
  },
  {
    id: 4,
    imgUrl: "/Minanl.svg", // 375 canvas, baked at -4.51117deg
    box: "left-[calc(134*var(--fig-u))] top-[calc(899*var(--fig-u))] w-[calc(268.23*var(--fig-u))] -rotate-[4.51deg] z-40",
    imgRotation: "rotate-[4.5112deg]",
    imgScale: "w-[108.14%]",
    borderColor: "border-[#2C3078]",
  },
];

// Vectors 227-231. Each file is laid out at its own pixel size rather than
// stretched into Figma's layer box, because two of them (Line1 and Line2) were
// exported cropped at the board edge — Vector 228 starts at left -77 and
// Vector 227 runs past 390 — so their boxes and their artwork disagree. The
// anchors below are where the visible part of each curve actually starts.
const dashedLines = [
  { src: "/group/Line1.svg", box: "left-0 top-[calc(11*var(--fig-u))] w-[calc(117*var(--fig-u))] h-[calc(79*var(--fig-u))]" },
  { src: "/group/Line2.svg", box: "right-0 top-[calc(195*var(--fig-u))] w-[calc(173*var(--fig-u))] h-[calc(140*var(--fig-u))]" },
  { src: "/group/Line3.svg", box: "left-[calc(275*var(--fig-u))] top-[calc(406*var(--fig-u))] w-[calc(77*var(--fig-u))] h-[calc(54*var(--fig-u))]" },
  { src: "/group/Line4.svg", box: "left-[calc(36*var(--fig-u))] top-[calc(646*var(--fig-u))] w-[calc(97*var(--fig-u))] h-[calc(79*var(--fig-u))]" },
  { src: "/group/Line5.svg", box: "left-[calc(296*var(--fig-u))] top-[calc(827*var(--fig-u))] w-[calc(45*var(--fig-u))] h-[calc(62*var(--fig-u))]" },
];

// Rectangles 1041-1043: three left-aligned lines of Taprom 40/48 starting at
// board x 27, each with its own peach bar behind it.
const HEADING_LINES = ["Journeys that get", "better in good", "company"];

export default function GoodCompaneyJourneyMobile() {
  return (
    <section className="figma-scale-mobile relative block md:hidden select-none overflow-hidden border-t border-[#1A1A1A] bg-[#F9F9F9]">
      <div className="relative mx-auto h-[calc(1269*var(--fig-u))] w-[calc(390*var(--fig-u))]">
        {dashedLines.map((line) => (
          <img
            key={line.src}
            src={line.src}
            alt=""
            aria-hidden="true"
            className={`pointer-events-none absolute z-0 ${line.box}`}
          />
        ))}

        {HEADING_LINES.map((line, i) => (
          <h2
            key={line}
            /* z-10 is load-bearing: .sub-title-bg's peach bar is an ::after at
               z-index -1, so it needs a stacking context between itself and
               this section's background or it paints behind it and vanishes. */
            className="absolute z-10 left-[calc(27*var(--fig-u))] font-taprom leading-[1.2] tracking-[0.05em] text-[#1A1A1A] text-[calc(40*var(--fig-u))]"
            style={{ top: `calc(${98 + i * 48}*var(--fig-u))` }}
          >
            <span className="sub-title-bg hero-bar-mobile inline-block">
              {line}
            </span>
          </h2>
        ))}

        {polaroids.map((photo) => (
          <div
            key={photo.id}
            className={`absolute rounded-[5px] border-2 bg-[#FAFAFA] p-[calc(12.005*var(--fig-u))] pb-[calc(49.355*var(--fig-u))] shadow-[0_15px_25px_rgba(26,26,26,0.1)] transition-transform duration-300 ${photo.borderColor} ${photo.box}`}
          >
            <div className="relative aspect-square w-full">
              <img
                src={photo.imgUrl}
                alt={`Travel group snapshot ${photo.id}`}
                className={`absolute left-1/2 top-1/2 h-auto max-w-none -translate-x-1/2 -translate-y-1/2 ${photo.imgScale} ${photo.imgRotation}`}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
