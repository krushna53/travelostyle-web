/**
 * Decorative dashed line used across the site.
 *
 * Why not <img src="/group/DottedLine219.svg">:
 *  1. The exported files clip their own path (219 is 703 units wide but its
 *     viewBox says 671), so the tail is cut off.
 *  2. `w-[35%] h-auto` scales the dots with the box, so the dashes get fat on
 *     wide screens and hairline on small ones, and `top-[40px] right-[90px]`
 *     stays put while everything around it moves.
 *
 * Here the path is stretched to whatever box you position it in
 * (preserveAspectRatio="none"), while vector-effect="non-scaling-stroke" keeps
 * the stroke and the dash pattern at a fixed pixel size — so the stretch is
 * invisible and only position/size need styling. Size the box in % of the
 * section and it can never drift or break at a breakpoint.
 *
 *   <DottedLine name="groupArc" className="top-[4%] right-[6%] w-[36%] h-[20%]" />
 *
 * viewBox values below are the paths' real bounding boxes, so the box you give
 * it is exactly the box the line fills.
 */

const LINES = {
  // public/group/DottedLine219.svg — loop above the polaroids
  groupArc: {
    viewBox: "0 0 703 242",
    d: "M2.5 239.928C145 129.095 444.6 -67.0718 503 34.9282C576 162.428 329.5 263.928 360.5 175.428C391.5 86.9276 617.5 -64.0713 700.5 34.9282",
  },
  // public/group/DottedLine218.svg — long sweep behind the polaroids
  groupSweep: {
    viewBox: "-134 0 1214 513",
    d: "M-131 510.5C148.242 481.154 780.982 338.469 1078 2.5",
  },
  // Private RTB Journeys, "Vector 35". Figma places it at left 0 / top 336.39
  // with a 2097x672.89 box on the 1920 frame, so the curve fills the box corner
  // to corner: bottom-left (0,300) to top-right (1311,0). Shape is a shallow
  // bow — steep off the left edge, flat behind the middle cards, steep again on
  // the way out. x runs past 1200 (the 1920 frame) because Figma bleeds it 177px
  // off the right edge, so pair this with `overflow-visible` and let the
  // section's own overflow-hidden do the cutting.
  privateRoute: {
    viewBox: "0 0 1200 300",
    d: "M0 300C90 272 200 259 340 251C570 239 790 216 950 178C1090 145 1215 88 1311 0",
  },
  // Blog listing hero, upper curve with the loop (public/blog-journal-dots.svg).
  // This one's declared viewBox already contains its path, so it is used as-is.
  blogLoop: {
    viewBox: "0 0 502 239",
    d: "M2.50047 235.701C97.4988 140.683 300.605 -31.822 353.045 38.3012C418.594 125.955 245.998 223.572 260.765 155.266C275.532 86.9603 428.466 -45.403 498.783 20.2522",
  },
  // Blog listing hero, lower sweep (public/blog-journal-dots-bottom.svg).
  // That file declares viewBox "0 0 440 339" but its path starts at x=-266, so
  // the file itself throws away the left 38% of the curve — which is why the
  // sweep never reached the left edge no matter how far the <img> was shifted.
  // This viewBox is the path's real bounding box, so the whole curve renders.
  blogSweep: {
    viewBox: "-268.5 0 708 339",
    d: "M-266 336.5C-103.628 317.206 264.292 223.393 437 2.50012",
  },
};

export default function DottedLine({
  name,
  d,
  viewBox,
  className = "",
  color = "#2C3078",
  weight = 4,
  dash = 12,
}) {
  const line = LINES[name] ?? { d, viewBox };

  return (
    <svg
      viewBox={line.viewBox}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none absolute ${className}`}
    >
      <path
        d={line.d}
        fill="none"
        stroke={color}
        strokeWidth={weight}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${dash}`}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
