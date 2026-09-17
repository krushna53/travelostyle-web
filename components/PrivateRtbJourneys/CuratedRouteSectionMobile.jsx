// Figma "RES_Private Journeys", the curated-route trail. That board is 390
// wide and its own composition — the days are stacked in a zigzag, not fanned
// in a row like the desktop one, and each card is a different size. Every
// number below is straight off the board:
//
//   day  frame left/top   frame w x h        rot      photo
//   1     -39.44/289.77   265.28 x 302.22    9.46    237.58
//   2     191.16/322.33   183.84 x 209.43   -5.27    164.64
//   4     221.78/532.89   183.84 x 209.43    8.65    164.64
//   5     -12.41/590.57   265.28 x 302.22    3.32    237.58
//   6     173.24/736.91   222.44 x 253.41  -11.36    199.21
//   7     -28.98/877.16   183.84 x 209.43    9.30    164.64
//   8     122.05/912.49   231.13 x 263.32   -5.91    207.00
//
// `top` here is that board value minus 96 — the 32px announcement bar plus the
// 64px header sit above this section — and each one is multiplied by
// --fig-u (see .figma-scale-mobile in globals.css) so it lands on a fixed
// pixel value at 390 and scales down on narrower phones.
//
// Stacking follows the board's layer order, bottom to top 8, 1, 2, 5, 4, 6, 7
// -- day 8 is the LOWEST card, so day 6's chin and label sit over it -- with
// one change: day 4 is lifted above day 6, whose top edge otherwise runs
// through the "DAY 4" label as it climbs to the right.
//
// The photos are the same seven the desktop section uses. public/private/
// does have Figma's own exports, but they are board-cropped — Day1.svg is
// missing the 17px of photo that hangs off the left edge of the 390 frame —
// and there are none for days 7 and 8 at all, so they cannot fill a frame.
const polaroidData = [
  {
    id: "day-1",
    label: "DAY 1",
    image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=600",
    box: "left-[calc(-39.44*var(--fig-u))] top-[calc(193.77*var(--fig-u))] w-[calc(265.28*var(--fig-u))] rotate-[9.46deg] z-20",
    padding: "p-[calc(11.85*var(--fig-u))] pb-[calc(48.79*var(--fig-u))]",
    chin: "h-[calc(48.79*var(--fig-u))]",
  },
  {
    id: "day-2",
    label: "DAY 2",
    image: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=600",
    box: "left-[calc(191.16*var(--fig-u))] top-[calc(226.33*var(--fig-u))] w-[calc(183.84*var(--fig-u))] -rotate-[5.27deg] z-30",
    padding: "p-[calc(7.6*var(--fig-u))] pb-[calc(33.19*var(--fig-u))]",
    chin: "h-[calc(33.19*var(--fig-u))]",
  },
  {
    id: "day-4",
    label: "DAY 4",
    image: "https://images.unsplash.com/photo-1498307833015-e7b400441eb8?w=600",
    box: "left-[calc(221.78*var(--fig-u))] top-[calc(436.89*var(--fig-u))] w-[calc(183.84*var(--fig-u))] rotate-[8.65deg] z-[60]",
    padding: "p-[calc(7.6*var(--fig-u))] pb-[calc(33.19*var(--fig-u))]",
    chin: "h-[calc(33.19*var(--fig-u))]",
  },
  {
    id: "day-5",
    label: "DAY 5",
    image: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=600",
    box: "left-[calc(-12.41*var(--fig-u))] top-[calc(494.57*var(--fig-u))] w-[calc(265.28*var(--fig-u))] rotate-[3.32deg] z-40",
    padding: "p-[calc(11.85*var(--fig-u))] pb-[calc(48.79*var(--fig-u))]",
    chin: "h-[calc(48.79*var(--fig-u))]",
  },
  {
    id: "day-6",
    label: "DAY 6",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600",
    box: "left-[calc(173.24*var(--fig-u))] top-[calc(640.91*var(--fig-u))] w-[calc(222.44*var(--fig-u))] -rotate-[11.36deg] z-50",
    padding: "p-[calc(9.615*var(--fig-u))] pb-[calc(40.585*var(--fig-u))]",
    chin: "h-[calc(40.585*var(--fig-u))]",
  },
  {
    id: "day-7",
    label: "DAY 7",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600",
    box: "left-[calc(-28.98*var(--fig-u))] top-[calc(781.16*var(--fig-u))] w-[calc(183.84*var(--fig-u))] rotate-[9.3deg] z-[70]",
    padding: "p-[calc(7.6*var(--fig-u))] pb-[calc(33.19*var(--fig-u))]",
    chin: "h-[calc(33.19*var(--fig-u))]",
  },
  {
    id: "day-8",
    label: "DAY 8",
    image: "https://images.unsplash.com/photo-1498307833015-e7b400441eb8?w=600",
    box: "left-[calc(122.05*var(--fig-u))] top-[calc(816.49*var(--fig-u))] w-[calc(231.13*var(--fig-u))] -rotate-[5.91deg] z-10",
    padding: "p-[calc(10.065*var(--fig-u))] pb-[calc(42.255*var(--fig-u))]",
    chin: "h-[calc(42.255*var(--fig-u))]",
  },
];

// Rectangles 1041-1043 on the board: the heading is three lines of Taprom 40/48
// whose CAP tops are 153, 201 and 249 (Figma exports leading-trim: cap), so
// each line box starts 7.85px higher -- 49.15 + 48i once the 96px header is
// off. The text frame is 305 wide at left 52, so lines centre on 204.5, not
// the board's 195: left 19 / right 0. Bars are .hero-bar-private-m1..3.
const HEADING_LINES = ["A curated route,", "perfected by you,", "for you"];

export default function CuratedRouteSectionMobile() {
  return (
    <section className="figma-scale-mobile relative block md:hidden overflow-hidden border-t-[1px] border-[#1A1A1A] bg-[#F9F9F9]">
      <div className="relative mx-auto h-[calc(1168*var(--fig-u))] w-[calc(390*var(--fig-u))]">
        {HEADING_LINES.map((line, i) => (
          <h2
            key={line}
            /* z-10 is load-bearing: .sub-title-bg's peach bar is an ::after at
               z-index -1, so it needs a stacking context between itself and
               the section's own background or it paints behind it and
               vanishes. The desktop heading gets this from its wrapper. */
            className="absolute left-[calc(19*var(--fig-u))] right-0 z-10 text-center font-taprom leading-[1.2] tracking-[0.05em] text-[#1A1A1A] text-[calc(40*var(--fig-u))]"
            style={{ top: `calc(${49.15 + i * 48}*var(--fig-u))` }}
          >
            <span className={`sub-title-bg hero-bar-private-m hero-bar-private-m${i + 1} inline-block`}>
              {line}
            </span>
          </h2>
        ))}

        {polaroidData.map((item) => (
          <div
            key={item.id}
            className={`absolute rounded-[5px] border-2 border-[#1A1A1A] bg-[#FAFAFA] shadow-[0_15px_25px_rgba(26,26,26,0.1)] transition-transform duration-300 hover:z-50 hover:scale-105 ${item.box} ${item.padding}`}
          >
            {/* Rectangle 912 — square, with its own 1px hairline. */}
            <div className="aspect-square w-full overflow-hidden border border-[#1A1A1A]">
              <img
                src={item.image}
                alt={item.label}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            {/* The label lives in the chin, i.e. the padding-bottom strip. */}
            <div
              className={`absolute inset-x-0 bottom-0 flex items-center justify-center font-semibold uppercase leading-none tracking-[0.05em] text-black text-[calc(16*var(--fig-u))] ${item.chin}`}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
