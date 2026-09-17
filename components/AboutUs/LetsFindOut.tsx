import Image from "next/image";
import TalkToAdvisorButton from "@/components/GeneralInquiryForm/TalkToAdvisorButton";

export default function LetsFindOut() {
  return (
    <>
    {/* MOBILE */}
    <section className="min-[1024px]:hidden bg-[#F9F9F9] overflow-hidden px-5 py-16 min-[440px]:max-[1000px]:max-w-[500px] min-[440px]:max-[1000px]:mx-auto">
      <h2 className="max-w-[336px] text-[32px]  font-semibold leading-[40px] tracking-[0.05em] text-[#000000] min-[440px]:max-[1000px]:mx-auto min-[440px]:max-[1000px]:text-center">
        Curious about what&apos;s possible?
        <br />
        Let&apos;s find out
        <br />
        together
      </h2>

      <div className="relative -mx-5 mt-10 h-[470px] w-[calc(100%+40px)] min-[440px]:max-[1000px]:mx-0 min-[440px]:max-[1000px]:w-full">
        <div className="absolute top-0 left-[119px] w-[284px] h-[324px] md:left-[107px] min-[440px]:max-[1000px]:left-1/2 min-[440px]:max-[1000px]:-translate-x-[calc(50%-40px)]">
          <Image
            src="/FreeMan.svg"
            alt=""
            width={537}
            height={584}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="absolute bottom-0 -left-[100px] z-10 w-[319px] h-[363px] min-[440px]:max-[1000px]:left-1/2 min-[440px]:max-[1000px]:-translate-x-[calc(50%+40px)] min-[440px]:max-[1000px]:bottom-[-40px]">
          <Image
            src="/CattonBro.svg"
            alt=""
            width={570}
            height={627}
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <p className="mt-10 text-[18px] max-[1910px]:text-[13px] leading-[32px] max-[1910px]:leading-[22px] tracking-[0.05em] text-[#000000] min-[440px]:max-[1000px]:mx-auto min-[440px]:max-[1000px]:text-center">
       Whether you know exactly where
        <br />
        you want to go or you&apos;re still at
        <br />
        the &apos;somewhere warm, sometime soon&apos;
        <br />
        stage – TravelOStyle is here. Start
        <br />
        a conversation, browse the
        <br />
        journeys, or just tell us how you like
        <br />
        to travel. That&apos;s usually enough to
        <br />
        begin.
      </p>

      <div className="mt-8 min-[440px]:max-[1000px]:flex min-[768px]:flex justify-center">
        <TalkToAdvisorButton className="h-[44px] min-[768px]:w-full min-[768px]:max-w-[269px] rounded-[100px] bg-[#2C3078] px-6 text-[18px] max-[1910px]:text-[13px] font-semibold tracking-[0.05em] text-[#FAFAFA]" />
      </div>
    </section>

    {/* DESKTOP */}
    <section className="hidden min-[1024px]:block bg-white overflow-hidden px-[7.55vw] py-[60px] min-[1280px]:py-[100px]">
      <div className="flex items-center gap-x-16 min-[1280px]:gap-x-10 min-[1366px]:gap-x-12 min-[1440px]:gap-x-14 min-[1919px]:gap-x-8 pb-[70px]">
        <div className="min-w-0 flex-1 max-w-[420px] min-[1020px]:max-w-[450px] min-[1280px]:max-w-[750px] min-[1440px]:max-w-[780px] min-[1919px]:max-w-[950px]">
          <h2 className="min-[1919px]:text-[48px] min-[1440px]:max-[1910px]:text-[40px] min-[1350px]:max-[1439px]:text-[36px] min-[1281px]:max-[1349px]:text-[40px] max-[1281px]:text-[38px] max-[1250px]:text-[32px] max-[1200px]:text-[28px] max-[900px]:text-[22px] font-semibold leading-[56px] text-[#1A1A2E]">
            Curious about what&apos;s possible?
            <br />
            Let&apos;s find out together
          </h2>

          <p className="mt-6 max-w-[640px] min-[1919px]:text-[18px] max-[1910px]:text-[16px] max-[1281px]:text-[15px] max-[1250px]:text-[14px] max-[1200px]:text-[13px] max-[900px]:text-[12px] leading-[32px] text-black">
            Whether you know exactly where you want to go or you&apos;re still at
            
            the &apos;somewhere warm, sometime soon&apos; stage – TravelOStyle is here.
            
            Start a conversation, browse the journeys, or just tell us how you like
           
            to travel. That&apos;s usually enough to begin.
          </p>

          <TalkToAdvisorButton className="mt-10 w-[269px] h-[44px] rounded-[100px] bg-[#2C3078] text-white text-[16px] max-[1910px]:text-[13px] font-medium" />
        </div>

        <div className="relative w-[360px] h-[360px] min-[1200px]:w-[380px] min-[1200px]:h-[380px] min-[1280px]:w-[600px] min-[1280px]:h-[600px] min-[1919px]:w-[780px] min-[1919px]:h-[780px] shrink-0">


          <div className="absolute top-0 right-0 w-[271px] h-[292px] min-[1200px]:w-[287px] min-[1200px]:h-[310px] min-[1280px]:w-[453px] min-[1280px]:h-[490px] min-[1919px]:w-[589px] min-[1919px]:h-[637px]">
            <Image
              src="/FreeMan.svg"
              alt=""
              width={537}
              height={584}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="absolute bottom-[-25px] left-[-38px] z-10 w-[278px] h-[316px] min-[1200px]:bottom-[-26px] min-[1200px]:left-[-41px] min-[1200px]:w-[294px] min-[1200px]:h-[335px] min-[1280px]:bottom-[-41px] min-[1280px]:left-[-65px] min-[1280px]:w-[464px] min-[1280px]:h-[529px] min-[1919px]:bottom-[-53px] min-[1919px]:left-[-85px] min-[1919px]:w-[603px] min-[1919px]:h-[688px]">
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
