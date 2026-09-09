import Image from "next/image";
import TalkToAdvisorButton from "@/components/GeneralInquiryForm/TalkToAdvisorButton";

export default function LetsFindOut() {
  return (
    <>
    {/* MOBILE */}
    <section className="min-[1024px]:hidden bg-[#F9F9F9] overflow-hidden px-5 py-16">
      <h2 className="max-w-full text-[32px] max-[1910px]:text-[27px] max-[1281px]:text-[22px] max-[1250px]:text-[17px] max-[1200px]:text-[16px] font-semibold leading-[40px] tracking-[0.05em] text-[#000000]">
        Curious about what&apos;s possible? Let&apos;s find out together
      </h2>

      <div className="relative md:-mx-5 mt-10 h-[470px] md:w-[calc(100%+40px)]">
        <div className="absolute top-0 left-[107px] md:w-[284px] h-[324px]">
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

      <p className="mt-10 text-[18px] max-[1910px]:text-[16px] leading-[32px] tracking-[0.05em] text-[#000000]">
       Whether you know exactly where you want to go or you&apos;re still at
        the &apos;somewhere warm, sometime soon&apos; stage – TravelOStyle is
        here. Start a conversation, browse the journeys, or just tell us how
        you like to travel. That&apos;s usually enough to begin.
      </p>

      <div className="mt-8 min-[768px]:flex justify-center">
        <TalkToAdvisorButton className="h-[44px] min-[768px]:w-full min-[768px]:max-w-[269px] rounded-[100px] bg-[#2C3078] px-6 text-[18px] max-[1910px]:text-[16px] font-semibold tracking-[0.05em] text-[#FAFAFA]" />
      </div>
    </section>

    {/* DESKTOP */}
    <section className="hidden min-[1024px]:block bg-white overflow-hidden px-[40px] min-[1280px]:px-[70px] py-[60px] min-[1280px]:py-[100px]">
      <div className="flex items-center justify-between pb-[70px]">
        <div className="max-w-[420px] min-[1280px]:max-w-[700px]">
          <h2 className="text-[40px] max-[1910px]:text-[35px] max-[1281px]:text-[30px] max-[1250px]:text-[25px] max-[1200px]:text-[20px] font-semibold leading-[56px] text-[#1A1A2E]">
            Curious about what&apos;s possible?
            <br />
            Let&apos;s find out together
          </h2>

          <p className="mt-6 text-[18px] max-[1910px]:text-[16px] leading-[32px] text-[#4A4A4A]">
            Whether you know exactly where you want to go or you&apos;re still at
            the &apos;somewhere warm, sometime soon&apos; stage – TravelOStyle is here.
            Start a conversation, browse the journeys, or just tell us how you
            like to travel. That&apos;s usually enough to begin.
          </p>

          <TalkToAdvisorButton className="mt-10 w-[269px] h-[44px] rounded-[100px] bg-[#2C3078] text-white text-[16px] max-[1910px]:text-[16px] font-medium" />
        </div>

        <div className="relative w-[380px] h-[380px] min-[1280px]:w-[600px] min-[1280px]:h-[600px] shrink-0">

   
          <div className="absolute top-0 right-0 w-[287px] h-[310px] min-[1280px]:w-[453px] min-[1280px]:h-[490px]">
            <Image
              src="/FreeMan.svg"
              alt=""
              width={537}
              height={584}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="absolute bottom-[-26px] left-[-41px] z-10 w-[294px] h-[335px] min-[1280px]:bottom-[-41px] min-[1280px]:left-[-65px] min-[1280px]:w-[464px] min-[1280px]:h-[529px]">
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
