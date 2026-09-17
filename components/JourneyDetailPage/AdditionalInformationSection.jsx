"use client";

import { useState } from "react";
import styles from "./AdditionalInformationSection.module.css";

export const DEFAULT_ADDITIONAL_INFO = [
  {
    title: "Things To Know Before You Book",
    items: [
      { title: "Best Season", content: "<p>Content coming soon.</p>" },
      { title: "Visa Requirements", content: "<p>Content coming soon.</p>" },
      { title: "Cancellation Policy", content: "<p>Content coming soon.</p>" },
      { title: "Travel Insurance", content: "<p>Content coming soon.</p>" },
    ],
  },
  {
    title: "Things To Know Before You Travel",
    items: [
      {
        title: "Country Details & Travel Advisory",
        content: "<p>Content coming soon.</p>",
      },
      { title: "On-Ground Sharing", content: "<p>Content coming soon.</p>" },
      { title: "Travel Vouchers", content: "<p>Content coming soon.</p>" },
      { title: "Safety & Security", content: "<p>Content coming soon.</p>" },
    ],
  },
];

function AccordionItem({ item }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-[0.7vw] border border-ink bg-white overflow-hidden">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-center justify-between px-[1.4vw] py-[1.1vw] text-left"
      >
        <span className="text-[18px] font-bold text-ink">
          {item.title}
        </span>
        <span className="relative flex h-[1.8vw] w-[1.8vw] shrink-0 items-center justify-center rounded-full bg-[#F7E4DC]">
          <span className="absolute h-[0.11vw] w-[0.8vw] bg-ink" />
          <span
            className={`absolute h-[0.8vw] w-[0.11vw] bg-ink transition-transform duration-200 ${
              isOpen ? "scale-y-0" : "scale-y-100"
            }`}
          />
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`${styles.infoRichText} border-t border-[#E5E5E5] px-[1.4vw] py-[1.2vw] text-left text-[16px] leading-[1.7] text-[#333]`}
            dangerouslySetInnerHTML={{ __html: item.content }}
          />
        </div>
      </div>
    </div>
  );
}

export default function AdditionalInformationSection({ drupalData }) {
  const groups =
    drupalData && drupalData.length > 0 ? drupalData : DEFAULT_ADDITIONAL_INFO;

  return (
    <div className="bg-[#fafafa] px-[8vw] py-[3vw]">
      {groups.map((group, gi) => (
        <div key={gi} className={gi > 0 ? "mt-[3vw]" : ""}>
          <h2 className="mb-[1.6vw] text-center text-[32px] font-bold text-ink">
            {group.title}
          </h2>
          <div className="flex flex-col gap-[1vw]">
            {group.items.map((item, ii) => (
              <AccordionItem key={ii} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
