import Image from "next/image";

export default function JourneySection() {
  return (
    <>
      {/* =========================
          DESKTOP SECTION
          Mobile section below is unchanged
      ========================== */}
      <section className="hidden md:block relative overflow-hidden bg-[#f6f6f6] w-full aspect-[1920/924] min-h-[650px]">

        {/* Top dotted line */}
        <div className="absolute right-[-1%] top-[-3%] z-20 w-[70%] pointer-events-none">
          <Image
            src="/Line.svg"
            alt="line"
            width={1243}
            height={398}
            className="h-auto w-full"
          />
        </div>

        {/* Bottom-left dotted line */}
        <div className="absolute bottom-[2%] left-[-6%] z-[1] w-[22%] rotate-[8deg] pointer-events-none">
          <Image
            src="/SmallLine.svg"
            alt="small-line"
            width={500}
            height={300}
            className="h-auto w-full"
          />
        </div>

        {/* Main desktop content */}
        <div className="relative z-10 w-full h-full">

          {/* =========================
              LEFT TEXT
          ========================== */}
          <div className="absolute left-[5.625%] top-[50%]
                  max-[1250px]:top-[40%]
                  max-[1281px]:top-[45%]
                  max-[1910px]:top-[48%]
                  min-[1919px]:top-[50%] w-[57.14%]">
            <div className="inline-block px-[1px]">
              <h2
                className="
                  whitespace-nowrap
                  sub-title-bg
                  font-taprom
                  font-normal
                  text-[54px]
                  max-[1200px]:text-[28px]
                  max-[1250px]:text-[32px]
                  max-[1281px]:text-[38px]
                  max-[1910px]:text-[44px]
                  min-[1919px]:text-[54px]
                  text-ink
                "
                style={{
                  lineHeight: "var(--lh-heading-taprom-lg)",
                  letterSpacing: "var(--ls-heading-taprom-lg)",
                }}
              >
                Journeys made for you, by you & with you.
              </h2>
            </div>

            <p className="
                mt-[8px]
                w-full
                max-w-[1097px]
                font-nohemi
                font-normal
                text-[18px]
                max-[1910px]:text-[16px]
                leading-[36px]
                max-[1910px]:leading-[28px]
                tracking-[0.05em]
                text-[#1A1A1A]
              "
            >
              Make travel feel calmer, clearer, and more worth it with
              TravelOstyle. Our journeys are designed around real people —
              your budgets, your rhythms, your hopes and the realities you
              are working with. We promise you honest guidance, thoughtful
              planning, and a travel experience that feels looked after
              from the get-go.
            </p>
          </div>

          {/* =========================
              RIGHT IMAGE AREA
          ========================== */}
          <div className="absolute right-[6.5%] top-[5%] w-[30%] h-[94%]">

            {/* Stars - left */}
            <div className="absolute left-[-3%] top-[36%] z-30">
              <Image
                src="/star.svg"
                alt="star"
                width={58}
                height={58}
                className="w-[58px] h-auto"
              />

              <Image
                src="/star.svg"
                alt="star"
                width={42}
                height={42}
                className="w-[42px] h-auto ml-[25px] mt-[-5px]"
              />
            </div>

            {/* Star - right */}
            <div className="absolute right-[16%] bottom-[29%] z-30">
              <Image
                src="/star.svg"
                alt="star"
                width={40}
                height={40}
                className="w-[40px] h-auto"
              />
            </div>

            {/* =========================
                TREE POLAROID
            ========================== */}
         <div className="absolute right-[5vw] top-[11vw] z-10 w-[54.86%] aspect-[316/360] rotate-[-8deg] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
             <Image
  src="/Tree.svg"
  alt="tree"
  width={100}
  height={100}
  className="h-auto w-full object-cover rotate-[10deg]"
/>
            </div>

            {/* =========================
                ROAD POLAROID
            ========================== */}
            <div className="absolute left-[3vw] top-[22vw] z-10 w-[61.61%] aspect-[354.86/404.27] rotate-[5deg] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
             <Image
  src="/Road.svg"
  alt="road"
  width={100}
  height={100}
  className="h-auto w-full object-cover rotate-[-6deg]"
/>
            </div>

          </div>
        </div>
      </section>

      {/* =========================
          MOBILE SECTION
          DO NOT CHANGE
      ========================== */}
      <section className="block md:hidden relative overflow-hidden bg-[#F8F7F5] pt-6 pb-10 px-5 w-full flex flex-col">

        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">

          <div className="absolute top-[-20px] right-[47px] w-[170px] opacity-100">
          </div>

          <div className="absolute top-[320px] md:top-[217px] left-[-26px] md:left-[-5px] opacity-100">
            <Image
              src="/ResLine2Journey.svg"
              alt=""
              width={170}
              height={80}
              className="w-full h-auto"
            />
          </div>

          <div className="absolute top-[355px] md:top-[283px] opacity-100 width-[180px]">
            <Image
              src="/ResLine3Journey.svg"
              alt=""
              width={180}
              height={100}
              className="w-full h-auto"
            />
          </div>
        </div>

        <div className="absolute top-[-7vw] right-[35px] w-[170px] z-0 pointer-events-none">
          <Image
            src="/ResLine1Journey.svg"
            alt=""
            width={170}
            height={80}
            className="w-full h-auto"
          />
        </div>

        <div className="relative z-10 w-full pt-[35px]">

          <h2
            className="
              font-taprom
              font-normal
              text-[40px]
              leading-[48px]
              tracking-[0.05em]
              text-ink
            "
          >
            <span className="inline-block bg-[#F1E3D8] px-[3px] py-[1px] mb-3">
              Journeys made
            </span>

            <br />

            <span className="inline-block bg-[#F1E3D8] px-[3px] py-[1px] mb-3">
              for you, by you &
            </span>

            <br />

            <span className="inline-block bg-[#F1E3D8] px-[3px] py-[1px] mb-3">
              with you.
            </span>
          </h2>

          <p className="mt-4 max-w-[337px] text-[16px] leading-[28px] tracking-[0.05em] text-ink font-sans">
            Make travel feel calmer, clearer, and more worth it with TravelOstyle.
          </p>
        </div>

        <div className="relative mt-8 h-[355px] w-full z-10">

          <div className="absolute left-[123px] top-[58px] z-30 text-[#4043A8]">
            <Image
              src="/star.svg"
              alt="star"
              width={18}
              height={18}
            />
          </div>

          <div className="absolute right-[140px] bottom-[45px] z-30 text-[#4043A8]">
            <Image
              src="/star.svg"
              alt="star"
              width={20}
              height={20}
            />
          </div>

          <div className="absolute right-[155px] bottom-[32px] z-30 text-[#4043A8]">
            <Image
              src="/star.svg"
              alt="star"
              width={30}
              height={30}
            />
          </div>

          <div className="absolute right-[-20px] top-0 rotate-[-6deg] bg-white border-[2px] border-[#4043A8] p-[2px] pb-5 shadow-md z-10">
            <Image
              src="/Tree.svg"
              alt="Palm Tree Horizon"
              width={190}
              height={190}
              className="w-[180px] h-[190px] object-cover rotate-[8deg]"
            />
          </div>

          <div className="absolute left-[-16px] top-[84px] rotate-[8deg] bg-white border-[2px] border-[#4043A8] p-[8px] pb-5 shadow-lg z-20">
            <Image
              src="/Road.svg"
              alt="Scenic Mountain Road"
              width={190}
              height={190}
              className="w-[180px] h-[190px] object-cover rotate-[-6deg]"
            />
          </div>
        </div>

        <p className="relative z-10 mx-auto max-w-[337px] text-left text-[16px] leading-[28px] tracking-[0.05em] text-[#1A1A1A] font-nohemi font-normal">
          Our journeys are designed around real people — your budgets, your
          rhythms, your hopes and the realities you are working with. We promise
          you honest guidance, thoughtful planning, and a travel experience that
          feels looked after from the get-go.
        </p>
      </section>

      <div className="w-full h-[2px] bg-[#4A4A4A] z-20" />
    </>
  );
}