import Image from "next/image";
import TalkToAdvisorButton from "@/components/GeneralInquiryForm/TalkToAdvisorButton";

export default function PrivateJourneysLuxury() {
  return (
    <section className="py-16">
      <div className="relative h-[720px] md:h-[450px] lg:h-[520px] w-full overflow-hidden rounded-1xl">
        <Image
          src="/private/BoatMobileHQ.jpg"
          alt="Private Journey"
          fill
          className="object-cover object-top md:hidden"
        />
        <Image
          src="/Ship.svg"
          alt="Private Journey"
          fill
          className="hidden md:block object-cover object-bottom"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(26,26,26,0.8) 0%, rgba(102,102,102,0) 100%)",
          }}
        />

        <div className="absolute inset-0 flex items-start pt-[6vw] md:pt-[5vw] lg:pt-[4vw]">
          <div className="max-w-[700px] ml-[6vw] md:ml-[10vw] lg:ml-[8vw]">
            <span className="font-nohemi max-w-[335px] md:max-w-none block text-[#FAFAFA] md:text-white text-[32px] md:text-[46px] font-semibold leading-[40px] md:leading-tight tracking-[0.05em] md:tracking-normal">
              Private Journeys aren&apos;t meant to be luxury
              concepts.
            </span>
              <p className="font-nohemi max-w-[319px] md:max-w-[300px] mt-6 text-[16px] md:text-lg font-normal leading-[28px] md:leading-normal tracking-[0.05em] md:tracking-normal text-[#FAFAFA] md:text-white/90">
              At TravelOStyle, we make them
              available at more price points than
              most expect.
            </p>

            <TalkToAdvisorButton className="mt-8 inline-flex items-center justify-center gap-[10px] bg-white text-[#283593] font-semibold rounded-full max-md:h-[37px] max-md:py-3 max-md:px-4 md:px-7 md:py-3 shadow-lg hover:scale-105 transition duration-300" />
          </div>
          
        </div>

      </div>
    </section>
  );
}