import Image from "next/image";

export default function GuestReview() {
  return (
    <section className="px-4 min-[768px]:px-[60px] min-[1024px]:px-[113px] min-[1280px]:px-[170px] py-10 min-[768px]:py-[70px] min-[1280px]:py-[120px]">

      {/* Heading */}
      <h2 className="text-center font-taprom text-[52px] max-[1910px]:text-[47px] max-[1281px]:text-[42px] max-[1250px]:text-[37px] max-[1200px]:text-[32px] leading-none">
        What are guests remember
      </h2>

      <div className="mt-10 min-[768px]:mt-[80px] flex flex-wrap items-center justify-center gap-6 min-[768px]:gap-[50px]">

        {/* Left Arrow */}
        <Image
          src="/LeftArrow.svg"
          alt="Previous"
          width={36}
          height={20}
          className="cursor-pointer"
        />

        {/* Guest Card */}
        <div className="w-[240px] border border-[#4E4DAA] bg-white p-3 rounded-[4px]">
          <Image
            src="/John & John Doe.svg"
            alt="Guest"
            width={214}
            height={214}
            className="w-full"
          />

          <p className="mt-3 text-[14px] max-[1910px]:text-[13px] font-semibold">
            John & John Doe
          </p>
        </div>

     {/* Review */}
<div className="relative w-full max-w-[620px]">

  <Image
    src="/RightQuote.svg"
    alt=""
    width={58}
    height={41}
    className="absolute left-[-26px] top-[-8px]"
  />

  <p className="pl-[50px] text-[22px] max-[1910px]:text-[17px] max-[1281px]:text-[13px] leading-[46px] text-black">
    I really had the time of my life. What a trip!
    <br />
    Everything felt clearer than expected, right from the first
    <br />
    conversation.
  </p>

  <Image
    src="/LeftQuote.svg"
    alt=""
    width={58}
    height={41}
    className="absolute right-[120px] bottom-[-25px]"
  />

</div>

        {/* Right Arrow */}
        <Image
          src="/RightArrow.svg"
          alt="Next"
          width={36}
          height={20}
          className="cursor-pointer"
        />

      </div>

    </section>
  );
}