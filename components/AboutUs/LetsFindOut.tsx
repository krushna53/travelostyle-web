import Image from "next/image";
import TalkToAdvisorButton from "@/components/GeneralInquiryForm/TalkToAdvisorButton";

export default function LetsFindOut() {
  return (
    <>
    {/* MOBILE */}
    <section className="lg:hidden bg-[#F9F9F9] overflow-hidden px-5 py-16">
      <h2 className="max-w-[336px] text-[32px] font-semibold leading-[40px] tracking-[0.05em] text-[#000000]">
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

      <p className="mt-10 text-[18px] leading-[32px] tracking-[0.05em] text-[#000000]">
       Whether you know exactly where you want to go or you&apos;re still at
        the &apos;somewhere warm, sometime soon&apos; stage – TravelOStyle is
        here. Start a conversation, browse the journeys, or just tell us how
        you like to travel. That&apos;s usually enough to begin.
      </p>

      <div className="mt-8 md:flex justify-center">
        <TalkToAdvisorButton className="h-[44px] md:w-full md:max-w-[269px] rounded-[100px] bg-[#2C3078] px-6 text-[18px] font-semibold tracking-[0.05em] text-[#FAFAFA]" />
      </div>
    </section>

    {/* DESKTOP */}
    <section className="hidden lg:block bg-white overflow-hidden px-[70px] py-[100px]">
      <div className="flex items-center justify-between pb-[70px]">
        <div className="max-w-[700px]">
          <h2 className="text-[40px] font-semibold leading-[56px] text-[#1A1A2E]">
            Curious about what&apos;s possible?
            <br />
            Let&apos;s find out together
          </h2>

          <p className="mt-6 text-[18px] leading-[32px] text-[#4A4A4A]">
            Whether you know exactly where you want to go or you&apos;re still at
            the &apos;somewhere warm, sometime soon&apos; stage – TravelOStyle is here.
            Start a conversation, browse the journeys, or just tell us how you
            like to travel. That&apos;s usually enough to begin.
          </p>

          <TalkToAdvisorButton className="mt-10 w-[269px] h-[44px] rounded-[100px] bg-[#2C3078] text-white text-[16px] font-medium" />
        </div>

        <div className="relative w-[600px] h-[600px]">

   
          <div className="absolute top-0 right-0 w-[453px] h-[490px]">
            <Image
              src="/FreeMan.svg"
              alt=""
              width={537}
              height={584}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="absolute bottom-[-41px] left-[-65px] z-10 w-[464px] h-[529px]">
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
