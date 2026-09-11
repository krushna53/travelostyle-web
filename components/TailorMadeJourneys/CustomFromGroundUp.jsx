import Image from "next/image";
import React from "react";

export default function CustomFromGroundUp() {
  return (
    <>
      <section className="relative bg-white pt-8 sm:pt-10 pb-2  overflow-hidden" style={{ paddingInline: "clamp(26px, 3.6vw, 69px)" }}>
        <div className="gap-8 items-start relative max-w-[1704px] mx-auto">
          <div className="md:col-span-7 space-y-6 md:pr-8 relative">
          
            <div className="block md:hidden relative pt-14">
              <div className="absolute -top-12 right-0 w-[180px] h-[150px] z-0 pointer-events-none">
                <Image
                  src="/CustomFormLine.svg"
                  alt="Dashed Swirl Line"
                  fill
                  className="object-contain object-top-right"
                  priority
                />
              </div>
              <div className="relative z-10 flex flex-col gap-1 mb-12">
                <div className="inline-block w-fit bg-[#F3E3DC] px-1.5 py-[2px]">
                  <h2 className="font-taprom text-[34px] leading-[0.92] font-normal text-[#111111]">
                    Custom, from
                  </h2>
                </div>

                <div className="inline-block w-fit bg-[#F3E3DC] px-1.5 py-[2px]">
                  <h2 className="font-taprom text-[34px] leading-[0.92] font-normal text-[#111111]">
                    the ground up
                  </h2>
                </div>
              </div>

              <div className="absolute left-[-32px] bottom-[-55px] z-0">
                <Image
                  src="/ResLine2Journey.svg"
                  alt="Journey Line"
                  width={80}
                  height={80}
                  className="w-[80px] h-auto"
                  priority
                />
              </div>
            </div>
            <div className="hidden md:inline-block relative w-fit my-0">
              <span className="absolute inset-x-0 top-[0.18em] bottom-[0.16em] bg-[#F3E3DC] rounded-xs" />
              <h2 className="relative z-10 font-taprom text-4xl sm:text-5xl md:text-[44px] text-[#111111] leading-[1.15] px-2 tracking-wide font-normal">
                Custom, from the ground up
              </h2>
            </div>
            <div className="font-nohemi space-y-5 mt-4 text-black text-[16px] font-light sm:text-sm md:text-[21px] leading-[28px] md:leading-[1.85] tracking-[0.05em] md:tracking-normal max-w-[min(1052px,calc(100%-360px))] max-md:w-[calc(100vw-40px)] max-md:max-w-[334.94px] relative z-10">
    
              <p>
                We start where you are, not where we like you to be or where the
                average itinerary tends to go. We begin with your reality — your
                time, your budget, your energy, your hopes, your habits — and
                from there, we show you how far that can take you.
              </p>

              <p>
                If a destination is more beautiful in a different season, we’ll
                tell you. If there’s a better-value option that delivers the
                same experience, we’ll offer it. If something genuinely won’t
                work for your group, we’ll let you know. And we’ll suggest what
                will.
              </p>

              <p>
                Tailor-made journeys aren’t simply about the itinerary document.
                TravelOStyle advisors are available throughout the process —
                during planning, before departure, and on the ground if you need
                us.
              </p>
            </div>
          </div>
          <div className="hidden md:flex md:col-span-5 justify-end items-start md:absolute md:right-[clamp(-111px,-5.8vw,-45px)] md:top-[clamp(-94px,-4.9vw,-40px)] z-10">
  <Image
    src="/ground-up.png"
    alt="Dashed Swirl Line Journey Vector"
    width={698}
    height={343}
    className="h-auto w-[clamp(420px,36.35vw,698px)] object-contain"
    priority
  />
</div>
        </div>
      </section>
    </>
  );
}
