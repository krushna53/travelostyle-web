"use client";

import Image from "@/components/SafeImage";
import React, { useState } from "react";
import { DEFAULT_ADDITIONAL_INFO } from "./AdditionalInformationSection";
import styles from "./MobileAdditionalInformation.module.css";

interface InfoItem {
  title: string;
  content: string;
}

interface InfoGroup {
  title: string;
  items: InfoItem[];
}

function AccordionItem({ item }: { item: InfoItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-ink bg-white overflow-hidden">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <span className="font-bold text-ink">{item.title}</span>
        <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F7E4DC]">
          <span className="absolute h-[1.5px] w-3 bg-ink" />
          <span
            className={`absolute h-3 w-[1.5px] bg-ink transition-transform duration-200 ${
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
            className={`${styles.infoRichText} border-t border-[#E5E5E5] p-4 text-sm leading-relaxed text-[#333]`}
            dangerouslySetInnerHTML={{ __html: item.content }}
          />
        </div>
      </div>
    </div>
  );
}

export default function MobileAdditionalInformation({
  onBack,
  drupalData,
}: {
  onBack: () => void;
  drupalData?: InfoGroup[] | null;
}) {
  const groups =
    drupalData && drupalData.length > 0 ? drupalData : DEFAULT_ADDITIONAL_INFO;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#fafafa] p-6 font-sans">
      <div className="mb-4 flex items-center justify-between pb-3">
        <button
          onClick={onBack}
          className="flex h-6 w-12 items-center justify-center rounded-full bg-white transition active:scale-95"
        >
          <Image src="/LeftArrow.svg" alt="Back" width={56} height={24} />
        </button>

        <h1 className="text-base font-bold tracking-tight text-ink">
          Additional Information
        </h1>

        <div className="w-12" />
      </div>

      {groups.map((group, gi) => (
        <div key={gi} className={gi > 0 ? "mb-6" : "mb-8"}>
          <h2 className="text-md font-bold text-neutral-800 mb-4">
            {group.title}
          </h2>
          <div className="space-y-3">
            {group.items.map((item, ii) => (
              <AccordionItem key={ii} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
