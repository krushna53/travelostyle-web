"use client";

import Image from "next/image";

export default function TimingSection() {
  return (
    <section className="relative w-full bg-[#fbfbfb] py-16 md:pt-40 md:pb-10 overflow-hidden select-none">
      <div className="hidden md:block absolute inset-8 z-0 pointer-events-none w-[2004px] max-[1910px]:w-[1993px] max-[1281px]:w-[1337px] max-[1250px]:w-[1304px] max-[1200px]:w-[1252px] h-[511px] max-[1910px]:h-[508px] max-[1281px]:h-[341px] max-[1250px]:h-[332px] max-[1200px]:h-[319px]">
        <Image
          src="/LongLine.svg"
          alt="Dashed Wave Pattern Desktop"
          fill
          className="object-fill"
        />
      </div>
      <div className="block md:hidden absolute top-0 right-[-15vw] z-0 pointer-events-none w-[136vw] md:w-[120vw] h-[50vw] md:h-[40vw]">
        <Image
          src="/TriangleLine.svg"
          alt="Dashed Wave Pattern Mobile"
          fill
          className="object-contain"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12 mt-20">
        <div className="max-w-4xl">
          <h2 className="mt-0 md:mt-15 text-[30px] md:text-[54px] md:max-[1910px]:text-[54px] md:max-[1281px]:text-[41px] md:max-[1250px]:text-[40px] md:max-[1200px]:text-[39px] font-bold md:font-semibold leading-[40px] md:leading-[1.2] text-ink">
            Be at the right <br className="md:hidden" /> place, at exactly  the
            <br />
            right time
          </h2>
          <p className="hidden md:block text-[17px] max-[1910px]:text-[17px] max-[1281px]:text-[14px] mt-10 text-ink max-w-[724px] w-full">
            Timing isn&apos;t everything — but it is a lot. Browse our
            TravelOStyle calendar; a collection of journeys by month, so
            you&apos;re travelling alongside the grain of a place. Trust us,
            arriving somewhere in its best season is a rare kind of magic.
          </p>
          <div className="md:hidden mt-5 flex flex-col gap-5 text-[16px] font-medium leading-[20px] text-ink">
            <p>
              Timing isn&apos;t everything — but it is a lot. Travel alongside the grain of a place with TravelOStyle!
            </p>
            <p>
              Trust us, arriving somewhere in its best season is a rare kind of magic
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}