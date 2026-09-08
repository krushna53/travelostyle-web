"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Journey({
  title,
  imageSrc,
  imageQuote,
  description,
  steps,
  btnText,
  bgColor,
  href,
  defaultOpen = false,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <>
    <div className="max-[1025px]:max-w-[48%] max-[641px]:max-w-[100%]">
      <div className="hidden lg:block">
        <section className="w-full py-5 [webkit-tap-highlight-color:transparent]">
          <div className="mx-auto max-w-[1180px] px-4">
            <div
              className="overflow-hidden rounded-[6px] border border-[#4A4A4A]"
              style={{ backgroundColor: bgColor }}
            >
              <div className="border-b border-[#4A4A4A] py-3 text-center">
                <h2 className="text-[23px] max-[1910px]:text-[23px] max-[1281px]:text-[17px] max-[1200px]:text-[16px] font-bold uppercase tracking-[1px] text-[#1c1c1c]">
                  {title}
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[40%_60%]">
                <div className="border-b border-[#4A4A4A] p-4 lg:border-b-0 lg:border-r">
                  <Image
                    src={imageSrc}
                    alt="star"
                    width={610}
                    height={300}
                    className="h-[250px]"
                  />

                  <div className="px-4">
                    <p className="mt-2 text-[35px] max-[1910px]:text-[35px] max-[1281px]:text-[26px] max-[1250px]:text-[25px] text-[#111] font-taprom select-none">
                      {imageQuote}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div className="border-b border-[#4A4A4A] px-6 py-4">
                  <div
  className="max-w-[95%] text-[#3f3f3f] text-[17px] max-[1910px]:text-[17px] max-[1281px]:text-[14px]"
  dangerouslySetInnerHTML={{ __html: description || "" }}
/>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2">
                    {steps.map((item, index) => (
                      <div key={index} className={`px-5 py-2 border-[#4A4A4A]`}>
                        <div className="text-[17px] max-[1910px]:text-[17px] max-[1281px]:text-[14px] font-semibold font-normal text-ink">
                          {item.id} 
                        </div>

                        <h3 className="mt-5 text-[17px] max-[1910px]:text-[17px] max-[1281px]:text-[14px] font-semibold leading-[1.3] text-ink">
                          {item.title}
                        </h3>

                      <div
  className="mt-2 text-[15px] max-[1910px]:text-[15px] max-[1281px]:text-[14px] text-ink"
  dangerouslySetInnerHTML={{ __html: item.desc || "" }}
/>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#4A4A4A] px-[23px] max-[1281px]:px-[15px] max-[1200px]:px-[14px] py-[15px] max-[1281px]:py-[10px]">
                    {href ? (
                      <Link
                        href={href}
                        className="inline-block rounded-full bg-[#2f3695] px-5 py-2 text-[20px] max-[1910px]:text-[20px] max-[1281px]:text-[14px] font-semibold text-white transition duration-300 hover:bg-[#232a7c]"
                      >
                        {btnText}
                      </Link>
                    ) : (
                      <button className="rounded-full bg-[#2f3695] px-5 py-2 text-[20px] max-[1910px]:text-[20px] max-[1281px]:text-[14px] font-semibold text-white transition duration-300 hover:bg-[#232a7c]">
                        {btnText}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div
        className="lg:hidden border-2 border-ink rounded-[5px] overflow-hidden mt-6"
        style={{ backgroundColor: bgColor }}
      >
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between px-4 py-3 border-b-2 border-ink cursor-pointer"
        >
          <h2 className="uppercase font-semibold text-[21px] leading-[36px] tracking-[0.05em] text-ink max-w-[70%]">
            {title}
          </h2>

          {isOpen ? (
            <Image
              src="/CircleSub.svg"
              alt="Next"
              height={24}
              width={48}
              className="w-[32px] h-auto"
            />
          ) : (
            <Image
              src="/CircleAdd.svg"
              alt="Next"
              height={24}
              width={48}
              className="w-[32px] h-auto"
            />
          )}
        </div>

        <div className="px-4 pt-4 ">
          <div
            className="aspect-[306/191] w-full"
            style={{
              WebkitMaskImage: "url(/scallop-frame.svg)",
              maskImage: "url(/scallop-frame.svg)",
              WebkitMaskSize: "100% 100%",
              maskSize: "100% 100%",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
            }}
          >
            <Image
              src={imageSrc}
              alt=""
              width={500}
              height={320}
              className="h-full w-full object-cover"
            />
          </div>

          <p className="mt-3 mb-2 max-w-full text-[21px] font-normal leading-[32px] tracking-[0.05em] text-[#1A1A1A] font-taprom">
            {imageQuote}
          </p>
        </div>
        <div
          className={`overflow-hidden transition-all duration-500 ${
            isOpen ? "max-h-[1200px]" : "max-h-0"
          }`}
        >
          <div className="border-t-2 border-b-2 border-ink px-4 py-4">
          <div
  className="text-[16px] leading-[20px] text-[#444]"
  dangerouslySetInnerHTML={{ __html: description || "" }}
/>
          </div>

          <div
            className={`grid grid-cols-1 ${
              steps.length >= 4
                ? "min-[600px]:grid-cols-2 min-[900px]:grid-cols-4"
                : "min-[600px]:grid-cols-2 min-[900px]:grid-cols-3"
            }`}
          >
          {steps.map((item, index) => (
            <div key={index} className="px-6 py-4 text-center last:border-b-0">
              <span className="block text-[24px] font-bold text-[#222]">
                {index + 1}
              </span>
              <h3 className="mt-3 text-[18px] font-bold text-[#222]">
                {item.title}
              </h3>

           <div
  className="mt-2 text-[16px] leading-[19px] text-[#555] text-center"
  dangerouslySetInnerHTML={{ __html: item.desc || "" }}
/>
            </div>
          ))}
          </div>
        </div>
        <div className="py-5">
          <hr className="border-0 border-t-2 border-ink mb-5" />
          <div className="px-4">
            {href ? (
              <Link
                href={href}
                className="block w-full text-center rounded-full bg-[#24398D] py-[11px] text-white text-[18px] font-semibold"
              >
                {btnText}
              </Link>
            ) : (
              <button className="w-full rounded-full bg-[#24398D] py-[11px] text-white text-[18px] font-semibold">
                {btnText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
