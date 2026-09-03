import React from "react";
import CraftJourneyButton from "@/components/CraftJourneyButton";
function stripHtml(html) {
  return (html || "")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .trim();
}



export default function BookingSteps({ bookingRecords, showCraftButton = true }) {
  const { subheading, mainHeading, steps } = bookingRecords;
  function capitalizeFirstLetter(text) {
  const value = stripHtml(text);
  return value.charAt(0).toUpperCase() + value.slice(1);
}
  
  return (
    <section className="w-full py-16 px-4 md:px-12 bg-white font-sans text-stone-900">
      <div className="max-w-6xl mx-auto text-left md:text-center mb-16">
      <p className="font-taprom whitespace-nowrap md:whitespace-normal text-[32px] md:text-xl font-normal text-[#1A1A1A] md:text-stone-600 mb-2 leading-[40px] md:leading-normal tracking-[0.05em] md:tracking-wide">
  {capitalizeFirstLetter(subheading)}
</p>  <h2 className="font-nohemi max-w-[336px] md:max-w-none md:whitespace-normal text-[32px] sm:text-4xl md:text-5xl font-semibold md:font-bold leading-[40px] md:leading-tight tracking-[0.05em] md:tracking-tight text-[#1A1A1A] md:text-black">
          {mainHeading}
        </h2>
      </div>
      <div className="flex flex-wrap justify-center gap-6 max-w-7xl 2xl:max-w-[1704px] mx-auto">
        {steps?.map((step, index) => (
          <div
            key={index}
            className="p-8 rounded-[10px] border-2 border-[#1A1A1A] flex flex-col justify-between transition-shadow hover:shadow-md max-w-[336px] w-full max-md:min-h-[305px] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[280px] min-h-[380px]"
            style={{ backgroundColor: step.bgColor || "#ffffff" }}
          >
            <div>
              <span className="block font-nohemi text-[32px] md:text-4xl font-semibold md:font-extrabold tracking-[0.05em] md:tracking-normal text-[#000000] md:text-black mb-6">
                {step.number}
              </span>

              <h3 className="font-nohemi text-[18px] md:text-xl font-semibold md:font-bold leading-[40px] md:leading-normal tracking-[0.05em] md:tracking-tight text-[#000000] md:text-black mb-4">
                {step.title}
              </h3>

              <p className="font-nohemi max-w-[268px] md:max-w-[325px] text-[16px] font-normal leading-[28px] md:leading-[32px] tracking-[0.05em] text-[#000000]">
 {stripHtml(step.description)}              </p>
            </div>
          </div>
        ))}
      </div>

      {showCraftButton && (
        <div className="mt-12 flex justify-center">
          <CraftJourneyButton className="rounded-full bg-[#2F3695] px-8 py-3 text-base font-semibold text-white shadow-md transition duration-200 hover:bg-[#232a7c] active:scale-95" />
        </div>
      )}
    </section>
  );
}
