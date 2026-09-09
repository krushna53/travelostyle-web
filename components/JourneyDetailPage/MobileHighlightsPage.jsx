"use client";

import Image from "next/image";
import CtaBanner from "./CtaBanner";

export default function MobileHighlights({ onBack, highlightsRecord, journey }) {
 const highlights = highlightsRecord?.length > 0 ? highlightsRecord : [];

  return (
    <div className="block w-full font-sans text-ink antialiased md:hidden">
      <main className="px-4 py-4 pb-12">
        <div className="w-full p-2">
          <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
            <button
              onClick={onBack}
              className="flex h-6 w-12 items-center justify-center rounded-full bg-white transition active:scale-95"
            >
              <Image
                src="/LeftArrow.svg"
                alt="Back"
                width={56}
                height={24}
              />
            </button>

            <h1 className="text-base font-bold tracking-tight text-ink">
              Highlights
            </h1>

            <div className="w-12" />
          </div>

          {highlights.length === 0 ? (
            <div className="flex min-h-[120px] items-center justify-center rounded-[8px] border p-4">
              <p className="text-base font-medium text-ink">
                Coming Soon
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {highlights.map((item, index) => (
                <div
                  key={index}
                  className="rounded-[8px] border-2 border-[#C8CE90] bg-[#F3F6DD] p-4"
                >
                  <p className="text-[14px] leading-[20px] font-medium text-[#2A2522]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="-mx-4 mt-2">
          <CtaBanner
            formType="private"
            journey={journey}
            showDepartureDate={false}
          />
        </div>
      </main>
    </div>
  );
}
