"use client";

import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

/*
 * Mobile-only pricing + booking UI for the journey page, in two parts:
 *
 * - MobilePriceCard: the price card rendered inline under the hero image on
 *   the "menu" view, so it never covers the banner.
 *
 * - MobilePriceBar (default export): the same card pinned to the bottom of
 *   the screen, so the price and booking action stay in reach. When
 *   an inline card element is passed as `anchor`, the bar hides while that
 *   card is on screen (no duplicate) and slides up once it's scrolled out of
 *   view. With no anchor (Highlights, Itinerary, ... views) it's always shown.
 *
 * The bar is position: fixed, so it would cover the end of the page (the
 * footer). While it's visible, the body gets a bottom padding equal to the
 * bar's live height (tracked as it expands/collapses); on md+ the bar is
 * display: none, its height is 0 and so is the padding.
 */

// Price summary + collapsible booking options, shared by the inline card and
// the pinned bar. Collapsed it's just the price and a "Tap for Details"
// toggle; expanded it reveals the offer note, the primary action and the
// secondary link underneath the price.
function PriceDetails({
  journey,
  isInspirational,
  onCheckDates,
  onRequestPrivate,
  onTailor,
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  const primary = isInspirational
    ? { label: "Request Private Journey", onClick: onRequestPrivate }
    : { label: "Check Departure Dates", onClick: onCheckDates };
  const secondary = isInspirational
    ? { label: "Tailor This Journey", onClick: onTailor }
    : { label: "Request a Private Journey", onClick: onRequestPrivate };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-[10px] px-[27px] py-[10px] text-left"
      >
        <div className="min-w-0">
          <p className="text-[12px] font-light leading-[16px] tracking-[0.05em] text-[#1A1A1A]">
            from
          </p>
          <div className="flex items-end gap-[2px]">
            <span className="text-[22px] font-semibold leading-[28px] tracking-[0.05em] text-[#1A1A1A]">
              ${Number(journey.offerPrice).toLocaleString()}
            </span>
            <span className="mb-[3px] text-[12px] font-normal leading-[14px] tracking-[0.05em] text-[#000000]">
              /person
            </span>
          </div>
          {journey.originalPrice && (
            <p className="text-[12px] font-light leading-[16px] tracking-[0.05em] text-[#1A1A1A]">
              was{" "}
              <span className="line-through">
                ${Number(journey.originalPrice).toLocaleString()}
              </span>
            </p>
          )}
        </div>

        <span className="flex shrink-0 items-center gap-[12px] text-[14px] font-semibold tracking-[0.02em] text-[#1A1A1A]">
          {open ? "Hide details" : "Tap for Details"}
          <span className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#F2E2DA]">
            {open ? (
              <ChevronDown size={18} strokeWidth={1.5} />
            ) : (
              <ChevronUp size={18} strokeWidth={1.5} />
            )}
          </span>
        </span>
      </button>

      <div
        id={panelId}
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-300 ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t-2 border-[#1A1A1A] px-[27px] pt-[12px] pb-[14px]">
            {journey?.earlyBird && (
              <div className="flex gap-[10px] rounded-[2px] bg-[#F2E2DA] px-[14px] py-[8px]">
                <Info size={16} strokeWidth={1.5} className="mt-[2px] shrink-0" />
                <p className="text-[12px] leading-[20px] tracking-[0.05em] text-black">
                  {journey.offer || "Early Bird Offers available"}
                </p>
              </div>
            )}

            <div className="mt-[16px] flex flex-col items-center">
              <button
                type="button"
                onClick={primary.onClick}
                className="h-[37px] rounded-full bg-[#2C3078] px-[20px] text-[16px] font-semibold tracking-[0.05em] text-[#FAFAFA]"
              >
                {primary.label}
              </button>
              <span className="mt-[8px] text-[12px] font-bold tracking-[0.05em] text-black">
                OR
              </span>
              <button
                type="button"
                onClick={secondary.onClick}
                className="mt-[6px] text-[14px] font-bold text-ink underline underline-offset-[3px]"
              >
                {secondary.label}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function MobilePriceCard({ cardRef, ...props }) {
  return (
    <div
      ref={cardRef}
      className="block overflow-hidden border-y-2 border-[#1A1A1A] bg-[#FAFAFA] md:hidden"
    >
      <PriceDetails {...props} />
    </div>
  );
}

export default function MobilePriceBar({ anchor, ...props }) {
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
      <PriceDetails {...props} />
    </div>
  );
}
