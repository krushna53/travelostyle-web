import React from 'react';


export default function WhyTakeJourney({
  title,
  bgImageUrl,
  features = [],
  ctaTitle,
  ctaSubtitle,
  ctaButtonText,
  onCtaClick
}) {
  return (
    <section 
      className="relative min-h-screen w-full bg-cover bg-center flex flex-col justify-center items-center py-16 px-4 md:pl-[7.86vw] md:pr-[7.86vw] text-white"
      style={{ backgroundImage: `url('${bgImageUrl}')` }}
    >

      <div className="relative z-10 max-w-[1600px] w-full mx-auto">
        {title && (
          <h3 className="font-nohemi max-w-[374px] md:max-w-[1016px] mx-auto text-[32px] md:text-[64px] font-semibold leading-[40px] md:leading-[80px] tracking-[0.05em] text-[#FAFAFA] text-center mb-3 md:-mt-6">
              {title}
          </h3>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
          {features.map((feature, index) => (
            <div key={index} className="border-t-2 border-[#FAFAFA] pt-6 flex flex-col justify-between">
              <div>
                <h3 className="font-nohemi text-[16px] md:text-xl font-semibold md:font-bold leading-[28px] md:leading-normal tracking-[0.05em] md:tracking-wide text-[#FAFAFA] mb-3">{feature.title}</h3>
                <p className="font-nohemi max-w-[336px] md:max-w-[515px] text-[16px] font-normal leading-[24px] md:leading-[32px] tracking-[0.05em] text-[#FAFAFA]">
                      {feature.description}
                </p>
              </div>
            </div>
          ))}

          <div className="border-t-2 border-[#FAFAFA] pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
             <h3 className="font-nohemi max-w-[247px] md:max-w-[330px] text-[18px] md:text-[24px] font-semibold leading-[28px] md:leading-[40px] tracking-[0.05em] text-[#FAFAFA] md:-translate-y-[2px]">
                {ctaTitle}</h3>
              <p className="text-white/90 text-sm font-semibold mt-1">{ctaSubtitle}</p>
            </div>
            <div className="pt-2 sm:pt-0">
              <button
                onClick={onCtaClick}
                className="inline-block bg-[#FAFAFA] text-blue-900 font-bold px-4 py-3 md:px-6 md:py-2 rounded-full text-sm tracking-wide shadow-md hover:bg-neutral-100 transition-colors whitespace-nowrap"
              >
                {ctaButtonText}
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}