import Image from "next/image";

export default function Hero() {
  return (
    <>
    {/* MOBILE HERO */}
    <section className="min-[1024px]:hidden px-5 pt-[93px] min-[768px]:pt-8 pb-10">
      <div className="relative">
        <img
          src="/about-hero-dots-mobile.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -left-[56px] min-[768px]:-left-[52px] top-[118px] min-[768px]:top-[34px] min-[768px]:w-[150px] min-[768px]:w-[62px] w-[155px] h-[80px] min-[768px]:h-[126px] min-[768px]:h-[72px]"
        />

        <h1 className="font-taprom text-[40px] max-[1910px]:text-[35px] max-[1281px]:text-[30px] max-[1250px]:text-[25px] max-[1200px]:text-[20px] z-0 relative leading-[48px] tracking-[0.05em] text-black flex flex-col items-start gap-[14px]">
          <span className="inline-block sub-title-bg feel min-[768px]:px-[6px] mx-auto">Making travel feel</span>
          <span className="inline-block sub-title-bg feel min-[768px]:px-[6px] mx-auto">like it was always</span>
          <span className="inline-block sub-title-bg supposed min-[768px]:px-[6px] mx-auto min-[768px]:ml-[58px] ">supposed to</span>
        </h1>
      </div>

      <div className="mt-12 min-[768px]:mt-6 space-y-4">
        <p className="text-[16px] max-[1910px]:text-[16px] font-light leading-[28px] tracking-[0.03em] text-[#000000]">
          Travel, at its best, is a chance to reconnect with what matters to
          you. An opportunity to see the world differently, or simply provide
          relief, or even come home with a story you actually want to tell.
        </p>

        <p className="text-[16px] max-[1910px]:text-[16px] font-light leading-[28px] tracking-[0.03em] text-[#000000]">
          Not a logistics puzzle. Not a source of pre-departure dread. Not
          something that costs you more energy than it gives back.
        </p>
      </div>
    </section>

    {/* DESKTOP HERO */}
    <section className="hidden min-[1024px]:block relative h-[500px] mt-5">

      {/* Main curve */}
      <Image
        src="/Vector221.svg"
        alt="curve"
        width={1276}
        height={434}
        className="absolute top-[6px] left-[-257px]"
      />

      {/* Bottom curve */}
      <Image
        src="/Vector220.svg"
        alt="bottom curve"
        width={580}
        height={464}
        className="absolute right-[0px] top-[200px]"
      />

      {/* Heading */}
      <div className="absolute top-[140px] w-full flex justify-center z-10">
        <div className="relative inline-block">
          <div className="absolute left-0 right-0 bottom-[6px] h-[18px] bg-[#F2E2DA]" />

          <h1
            className="
              relative
              font-taprom
              text-[46px] max-[1910px]:text-[41px] max-[1281px]:text-[36px] max-[1250px]:text-[31px] max-[1200px]:text-[26px]
              leading-none
              text-black
              whitespace-nowrap
              max-[1281px]:whitespace-normal
              max-[1281px]:text-center
              px-4
              max-[1281px]:max-w-[700px]
              max-[1281px]:mx-auto
            "
          >
            Making travel feel like it was always supposed to
          </h1>
        </div>
      </div>

      {/* Description */}
      <div className="absolute top-[240px] left-1/2 -translate-x-1/2 z-10 text-center">
        <p className="w-full max-w-[1070px] max-[1281px]:max-w-[880px] px-6 text-[17px] max-[1910px]:text-[16px] font-light leading-[36px] tracking-[0.05em] text-[#4A4A4A]">
          Travel, at its best, is a chance to reconnect with what matters to you. An opportunity to see the
          <br />
          world differently, or simply provide relief, or even come home with a story you actually want to tell.
        </p>

        <p className="mt-[18px] w-full max-w-[1070px] max-[1281px]:max-w-[880px] px-6 text-[17px] max-[1910px]:text-[16px] font-light leading-[36px] tracking-[0.05em] text-[#4A4A4A]">
          Not a logistics puzzle. Not a source of pre-departure dread. Not something
          <br />
          that costs you more energy than it gives back.
        </p>
      </div>

    </section>
    </>
  );
}