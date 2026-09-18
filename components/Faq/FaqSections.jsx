"use client";

import { useId, useState } from "react";

/*
 * Measurements are from the 1920 Figma board. The board sets this text in
 * Nohemi; the page uses the site's body font (Inter, from globals.css)
 * instead, with Figma's sizes and spacing. Inter's cap height is centred in
 * its line box, so:
 *   - Row: 80 tall, 2px #1A1A1A border, 10px radius. Question 18/24 centred
 *     (Figma cap top 34) and 54 in -> 26px top/bottom, 52px left padding
 *     inside the border.
 *   - Toggle: 42px #F2E2DA circle at top 19, 39 from the row's right edge,
 *     with a 23px, 2px-stroke plus (minus when open).
 *   - Answer: 18/32 Light, cap top 88 down, 1220 wide from x 54 -> its line
 *     box starts 2px under the button, 140px right padding. Figma's "Where is
 *     TravelOStyle based" row (208 tall, 3 lines) is matched with
 *     1px above the first line box and 31px under the last.
 */
function FaqItem({ question, answer, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const buttonId = `${id}-button`;
  const panelId = `${id}-panel`;

  return (
    <div className="rounded-[10px] border-2 border-ink">
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="relative block w-full cursor-pointer py-[18px] pl-5 pr-16 text-left text-[15px] leading-[22px] font-semibold tracking-[0.05em] text-black md:py-[26px] md:pl-[52px] md:pr-[103px] md:text-[18px] md:leading-[24px]"
        >
          {question}
          <span
            aria-hidden="true"
            className="absolute top-[13px] right-4 flex size-8 items-center justify-center rounded-full bg-tan md:top-[17px] md:right-[37px] md:size-[42px]"
          >
            <span className="absolute h-[2px] w-4 bg-black md:w-[23px]" />
            <span
              className={`absolute h-4 w-[2px] bg-black transition-transform duration-300 md:h-[23px] ${
                open ? "scale-y-0" : "scale-y-100"
              }`}
            />
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <p className="px-5 pb-5 text-[14px] leading-[24px] font-light tracking-[0.05em] text-black md:pt-px md:pr-12 md:pb-[31px] md:pl-[52px] md:text-[18px] md:leading-[32px] lg:pr-[140px]">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

/*
 * Section rhythm (desktop), as line-box gaps for the 32/56 headings, whose cap
 * top sits ~16px into the line box:
 *   - heading -> list: 17 (Figma: list top 59 under the heading's cap top),
 *     78 for the first section, which Figma sets further down (120).
 *   - list -> next heading: 76 (heading cap top 90 under the last row).
 * Figma's own gaps drift by a few px between sections (29/32/36 between rows,
 * 84/90/104 before headings); the dominant values are used throughout.
 *
 * Headings are centred on the page (x 960), but the rows are 1416 wide at
 * 276 from the left and 228 from the right, so only the lists get the
 * offset, as % of the 1920-capped page wrapper.
 */
export default function FaqSections({ sections }) {
  return (
    <div className="flex flex-col gap-12 md:gap-[76px]">
      {sections.map((section, index) => (
        <section key={section.title} aria-labelledby={`faq-section-${index}`}>
          <h2
            id={`faq-section-${index}`}
            className="text-center text-[22px] leading-[32px] font-semibold tracking-[0.05em] text-black capitalize md:text-[32px] md:leading-[56px]"
          >
            {section.title}
          </h2>

          <div
            className={`flex flex-col gap-4 md:gap-8 lg:mr-[11.875%] lg:ml-[14.375%] ${
              index === 0 ? "mt-6 md:mt-[78px]" : "mt-6 md:mt-[17px]"
            }`}
          >
            {section.items.map((item, i) => (
              <FaqItem key={`${index}-${i}`} {...item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
