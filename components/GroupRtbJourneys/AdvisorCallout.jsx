import React from 'react';
import ComingSoon from "../ComingSoon";
import TalkToAdvisorButton from "@/components/GeneralInquiryForm/TalkToAdvisorButton";

export default function AdvisorCallout({ content }) {
  if (!content) return <ComingSoon label="Advisor Callout" />;

  const { heading, paragraph1, paragraph2, buttonText } = content;
  const headingLines = heading.split("\n");

  return (
    <section className="bg-white max-md:pt-4 md:py-15 mb-22 px-6 md:px-12 lg:px-16 w-full flex items-center justify-center font-sans">
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-24">

        <div className="flex flex-col space-y-2 md:space-y-10 items-start">
          <h2 className="font-nohemi max-w-[228px] md:max-w-[310px] text-[32px] sm:text-5xl md:text-[48px] font-semibold text-[#000000] md:text-black leading-[40px] md:leading-tight tracking-[0.05em] md:tracking-tight">
            {headingLines.map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < headingLines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h2>
          
          <TalkToAdvisorButton className="hidden md:inline-flex h-[37px] w-[269px] items-center justify-center gap-[10px] rounded-full bg-[#2C3078] px-6 mt-6 font-normal text-[15px] text-white whitespace-nowrap transition-colors duration-200 hover:bg-[#1E2254]" />
        </div>

        <div
          className="flex flex-col space-y-8  text-black  min-[800px]:w-[573px]  font-nohemi max-md:!text-[16px] max-md:!font-normal max-md:!leading-[28px] max-md:!tracking-[0.05em] max-md:!text-[#000000]"
          style={{
            fontSize: "var(--fs-body-nohemi-regular-callout)",
            lineHeight: "var(--lh-body-nohemi-regular-callout)",
            letterSpacing: "var(--ls-body-nohemi-regular-callout)",
            fontWeight: "var(--fw-body-nohemi-regular-callout)",
          }}
        >
          <p>{paragraph1}</p>
          <p>{paragraph2}</p>
          <TalkToAdvisorButton className="md:hidden inline-flex h-[37px] w-[269px] items-center justify-center gap-[10px] rounded-full bg-[#2C3078] px-6 font-normal text-[15px] text-white whitespace-nowrap transition-colors duration-200 hover:bg-[#1E2254]" />
        </div>

      </div>
    </section>
  );
}
