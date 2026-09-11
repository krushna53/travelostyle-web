import Image from "next/image";
import TalkToAdvisorButton from "@/components/GeneralInquiryForm/TalkToAdvisorButton";

export default function LetsFindOut() {
  return (
    <>
    {/* MOBILE */}
    <section className="min-[1024px]:hidden bg-[#F9F9F9] overflow-hidden px-5 py-16">
      <h2 className="max-w-[336px] text-[32px] max-[1910px]:text-[27px] max-[1281px]:text-[22px] max-[1250px]:text-[17px] max-[1200px]:text-[13px] font-semibold leading-[40px] tracking-[0.05em] text-[#000000]">
        Curious about what&apos;s possible? Let&apos;s find out together
      </h2>

      <div className="relative -mx-5 mt-10 h-[470px] w-[calc(100%+40px)]">
        <div className="absolute top-0 left-[107px] w-[284px] h-[324px]">
          <Image
            src="/FreeMan.svg"
            alt=""
            width={537}
            height={584}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="absolute bottom-0 -left-[100px] z-10 w-[319px] h-[363px]">
          <Image
            src="/CattonBro.svg"
            alt=""
            width={570}
            height={627}
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <p className="mt-10 text-[18px] max-[1910px]:text-[13px] leading-[32px] tracking-[0.05em] text-[#000000]">
       Whether you know exactly where you want to go or you&apos;re still at
        the &apos;somewhere warm, sometime soon&apos; stage – TravelOStyle is
        here. Start a conversation, browse the journeys, or just tell us how
        you like to travel. That&apos;s usually enough to begin.
      </p>

      <div className="mt-8 min-[768px]:flex justify-center">
        <TalkToAdvisorButton className="h-[44px] min-[768px]:w-full min-[768px]:max-w-[269px] rounded-[100px] bg-[#2C3078] px-6 text-[18px] max-[1910px]:text-[13px] font-semibold tracking-[0.05em] text-[#FAFAFA]" />
      </div>
    </section>

    {/* DESKTOP */}
    <section className="hidden min-[1024px]:block bg-white overflow-hidden px-[40px] min-[1280px]:px-[70px] py-[60px] min-[1280px]:py-[100px]">
      <div className="flex items-center justify-between pb-[70px]">
        <div className="max-w-[420px] min-[1020px]:max-w-[450px] min-[1280px]:max-w-[700px] min-[1919px]:max-w-[800px]">
          <h2 className="min-[1919px]:text-[48px] max-[1910px]:text-[44px] max-[1281px]:text-[38px] max-[1250px]:text-[32px] max-[1200px]:text-[28px] max-[900px]:text-[22px] font-semibold leading-[56px] text-[#1A1A2E]">
            Curious about what&apos;s possible?
            <br />
            Let&apos;s find out together
          </h2>

          <p className="mt-6 min-[1919px]:text-[18px] max-[1910px]:text-[16px] max-[1281px]:text-[15px] max-[1250px]:text-[14px] max-[1200px]:text-[13px] max-[900px]:text-[12px] leading-[32px] text-black">
            Whether you know exactly where you want to go or you&apos;re still at
            the &apos;somewhere warm, sometime soon&apos; stage – TravelOStyle is here.
            Start a conversation, browse the journeys, or just tell us how you
            like to travel. That&apos;s usually enough to begin.
          </p>

          <TalkToAdvisorButton className="mt-10 w-[269px] h-[44px] rounded-[100px] bg-[#2C3078] text-white text-[16px] max-[1910px]:text-[13px] font-medium" />
        </div>

        <div className="relative w-[280px] h-[280px] min-[1200px]:w-[380px] min-[1200px]:h-[380px] min-[1280px]:w-[600px] min-[1280px]:h-[600px] shrink-0">


          <div className="absolute top-0 right-0 w-[211px] h-[228px] min-[1200px]:w-[287px] min-[1200px]:h-[310px] min-[1280px]:w-[453px] min-[1280px]:h-[490px]">
            <Image
              src="/FreeMan.svg"
              alt=""
              width={537}
              height={584}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="absolute bottom-[-19px] left-[-30px] z-10 w-[216px] h-[246px] min-[1200px]:bottom-[-26px] min-[1200px]:left-[-41px] min-[1200px]:w-[294px] min-[1200px]:h-[335px] min-[1280px]:bottom-[-41px] min-[1280px]:left-[-65px] min-[1280px]:w-[464px] min-[1280px]:h-[529px]">
            <Image
              src="/CattonBro.svg"
              alt=""
              width={570}
              height={627}
              className="w-full h-full object-contain"
            />
          </div>

        </div>
      </div>
    </section>
    </>
  );
}
