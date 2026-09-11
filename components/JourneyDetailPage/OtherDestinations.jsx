"use client";
import JourneysWeLove from "../HomePage/JourneysWeLove";

export default function OtherDestinations({ otherJourneys }) {
  return (
    <div className=" md:mt-[4vw] md:flex md:items-center md:justify-center md:gap-[1.3vw]">
      <section className="w-full py-10 md:py-12">
        <h2 className="px-[27px] text-[28px] font-semibold leading-[34px] tracking-[0.05em] text-[#1A1A1A] md:mx-auto md:max-w-xl md:px-0 md:text-center md:text-4xl md:font-bold md:leading-tight">
          Other Destinations<br className="md:hidden" /><span className="md:hidden">we know you&apos;ll love!</span><span className="hidden md:inline"> We Know You&apos;ll Love</span>
        </h2>
        <JourneysWeLove initialJourneys={otherJourneys} />
      </section>
    </div>
  );
}
