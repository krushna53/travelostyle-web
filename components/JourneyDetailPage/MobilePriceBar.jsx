"use client";

import { Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/*
 * Mobile-only pricing + booking UI for the journey page, in two parts:
 *
 * - MobilePriceCard: the full price card (price, offer note, primary button,
 *   secondary link). Rendered inline under the hero image on the "menu" view,
 *   so it never covers the banner.
 *
 * - MobilePriceBar (default export): a compact one-row bar pinned to the
 *   bottom of the screen, so the price and booking action stay in reach. When
 *   an inline card element is passed as `anchor`, the bar hides while that
 *   card is on screen (no duplicate) and slides up once it's scrolled out of
 *   view. With no anchor (Highlights, Itinerary, ... views) it's always shown.
 *
 * The bar is position: fixed, so it would cover the end of the page (the
 * footer). While it's visible, the body gets a bottom padding equal to the
 * bar's live height; on md+ the bar is display: none, its height is 0 and so
 * is the padding.
 */

export function MobilePriceCard({
  journey,
  isInspirational,
  onCheckDates,
  onRequestPrivate,
  onTailor,
  cardRef,
}) {
  return (
    <div
      ref={cardRef}
      className="block overflow-hidden border-y-2 border-[#1A1A1A] bg-[#FAFAFA] md:hidden"
    >
      <div className="flex border-b-2 border-[#1A1A1A]">
        <div className="flex-1 px-[14px] py-[12px]">
          <p className="text-[10px] font-light leading-[16px] tracking-[0.05em] text-[#1A1A1A]">
            from
          </p>

          <div className="flex items-end gap-[2px]">
            <span className="text-[24px] font-semibold leading-[28px] tracking-[0.05em] text-[#1A1A1A]">
              ${Number(journey.offerPrice).toLocaleString()}
            </span>
            <span className="mb-[3px] text-[11px] font-normal leading-[14px] tracking-[0.05em] text-[#000000]">
              /person
            </span>
          </div>

          {journey.originalPrice && (
            <p className="text-[12px] font-light leading-[16px] tracking-[0.05em] text-[#777]">
              was{" "}
              <span className="line-through">
                ${Number(journey.originalPrice).toLocaleString()}
              </span>
            </p>
          )}
        </div>

        {journey?.earlyBird && (
          <div className="my-[8px] mr-[14px] w-[168px] shrink-0 self-start rounded-[2px] bg-[#F2E2DA] px-[10px] py-[8px]">
            <div className="flex gap-[8px]">
              <Info size={16} strokeWidth={1.5} className="mt-[1px] shrink-0" />
              <p className="text-[8px] leading-[16px] tracking-[0.05em] text-black">
                {journey.offer || "Early Bird Offers available"}
              </p>
            </div>
          </div>
        )}
      </div>

      {isInspirational ? (
        <>
          <div className="flex items-center justify-center gap-3 bg-[#FAFAFA] px-4 py-[12px]">
            <button
              onClick={onRequestPrivate}
              className="h-[37px] rounded-full bg-[#2C3078] px-6 text-[16px] font-semibold tracking-[0.05em] text-[#FAFAFA]"
            >
              Request a Private Journey
            </button>
          </div>

          <div className="border-t-2 border-[#1A1A1A] bg-[#FAFAFA] px-4 py-[12px] text-center text-[12px] font-light leading-[18px] tracking-[0.05em] text-[#1A1A1A]">
            Want to make this itinerary entirely your own?
            <br />
            <button
              onClick={onTailor}
              className="mt-1 font-bold text-ink underline underline-offset-2"
            >
              Tailor This Journey For You
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-nowrap items-center gap-[10px] whitespace-nowrap bg-[#FAFAFA] px-[27px] py-[9px]">
          <button
            onClick={onCheckDates}
            className="h-[31px] w-[138px] shrink-0 rounded-[15.5px] bg-[#2C3078] text-[16px] font-semibold tracking-[0.05em] text-[#FAFAFA]"
          >
            Check Dates
          </button>

          <span className="shrink-0 text-[12px] font-bold tracking-[0.05em] text-black">
            OR
          </span>

          <button
            onClick={onRequestPrivate}
            className="shrink-0 text-[12px] font-bold text-ink underline underline-offset-[3px]"
          >
            Request a Private Journey
          </button>
        </div>
      )}
    </div>
  );
}

export default function MobilePriceBar({
  journey,
  isInspirational,
  onCheckDates,
  onRequestPrivate,
  onTailor,
  anchor,
}) {
  const barRef = useRef(null);
  const [anchorInView, setAnchorInView] = useState(false);
  const visible = !anchor || !anchorInView;

  // Hide the bar while the inline price card is on screen.
  useEffect(() => {
    if (!anchor) return;
    const observer = new IntersectionObserver(([entry]) =>
      setAnchorInView(entry.isIntersecting),
    );
    observer.observe(anchor);
    return () => observer.disconnect();
  }, [anchor]);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar || !visible) return;
    const body = document.body;
    const previous = body.style.paddingBottom;
    const sync = () => {
      body.style.paddingBottom = `${bar.offsetHeight}px`;
    };
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(bar);
    return () => {
      observer.disconnect();
      body.style.paddingBottom = previous;
    };
  }, [visible]);

  return (
    <div
      ref={barRef}
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 block rounded-t-[10px] border-2 border-b-0 border-[#1A1A1A] bg-[#FAFAFA] pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_20px_rgba(0,0,0,0.12)] transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
    >
      <div className="flex items-center justify-between gap-[10px] px-[14px] py-[8px]">
        <div className="min-w-0">
          <p className="text-[10px] font-light leading-[14px] tracking-[0.05em] text-[#1A1A1A]">
            from
          </p>
          <div className="flex items-end gap-[2px]">
            <span className="text-[20px] font-semibold leading-[24px] tracking-[0.05em] text-[#1A1A1A]">
              ${Number(journey.offerPrice).toLocaleString()}
            </span>
            <span className="mb-[2px] text-[10px] font-normal leading-[14px] tracking-[0.05em] text-[#000000]">
              /person
            </span>
          </div>
          {journey.originalPrice && (
            <p className="text-[10px] font-light leading-[14px] tracking-[0.05em] text-[#777]">
              was{" "}
              <span className="line-through">
                ${Number(journey.originalPrice).toLocaleString()}
              </span>
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-center gap-[4px]">
          <button
            onClick={isInspirational ? onRequestPrivate : onCheckDates}
            className="h-[34px] rounded-full bg-[#2C3078] px-[16px] text-[14px] font-semibold tracking-[0.05em] text-[#FAFAFA]"
          >
            {isInspirational ? "Request a Private Journey" : "Check Dates"}
          </button>
          <button
            onClick={isInspirational ? onTailor : onRequestPrivate}
            className="text-[11px] font-bold text-ink underline underline-offset-2"
          >
            {isInspirational ? "or Tailor This Journey" : "or Request a Private Journey"}
          </button>
        </div>
      </div>
    </div>
  );
}
