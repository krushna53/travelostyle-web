"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import Image from "next/image";

function TableCard({ title, items = [], theme }) {
    const current =
        theme === "inclusion"
            ? {
                bg: "bg-[#EFF3CF]",
                border: "border-black",
                text: "text-black",
            }
            : {
                bg: "bg-[#F2E2DA]",
                border: "border-black",
                text: "text-black",
            };
    return (

        <div
            className={`${current.bg} border-2 ${current.border} rounded-lg overflow-hidden`}
        >

            {/* Heading */}
            <div
                className={`
  h-[52px]
  self-start
  flex
  items-center
  justify-center
  font-bold
  text-[18px]
border-b-2
  ${current.border}
  ${current.text}
`}
            >
                {title}
            </div>


            {(items || []).map((item, index) => (
                <div
  key={item.title + index}
  className={`
    grid
    grid-cols-[240px_1fr]
    border-b-2
    ${current.border}
    last:border-b-0
    h-[140px]
  `}
>

                    {/* Icon + Title fixed column */}
                    <div
                        className={`
  flex
  items-center
  gap-3
  px-5
  h-full
  py-4
border-r-2
  ${current.border}
`}
                    >

                        {/* fixed icon position */}
                        <div className="w-10 h-10 flex items-center justify-center shrink-0">
                            {item.icon && (
                                <img
                                    src={item.icon}
                                    alt={item.title}
                                    className="
              w-10
              h-10
              object-contain
            "
                                />
                            )}
                        </div>


                        {/* title area, fills remaining space so it never overflows the fixed column */}
                        <div className="flex-1 min-w-0">
                            <h4
                                className={`
            font-semibold
            text-left
            text-[16px]
            leading-[20px]
            whitespace-nowrap
            ${current.text}
          `}
                            >
                                {item.title}
                            </h4>
                        </div>

                    </div>


                    {/* Description */}
                    <div
                        className="
        flex
        items-center
        px-5
        py-4
        text-[13px]
        leading-[20px]
        text-gray-600
      "
                    >
                        {item.description}
                    </div>


                </div>
            ))}
        </div>   // closes main card
    );
}
function MobileInclusions({
    inclusions = [],
    exclusions = []
}) {


    console.log("MOBILE INC DATA", inclusions);
    console.log("MOBILE EXC DATA", exclusions);

    const [openInc, setOpenInc] = useState(true);
    const [openExc, setOpenExc] = useState(false);


    return (

        <div className="block md:hidden px-4 py-5">


     <div className="rounded-xl bg-[#F2E2DA] p-4 mb-5 flex gap-2 items-start">
    <Info size={16} className="shrink-0 mt-1" />
    <p>
        Everything listed below is included in your journey pricing.
    </p>
</div>



            {/* INCLUSIONS */}

           <div className="
  rounded-xl
  border
  border-black
  overflow-hidden
  mb-5
  bg-[#EFF3CF]
">


                <button
                    onClick={() => setOpenInc(!openInc)}
                    className="
w-full
flex
items-center
justify-between
bg-[#EFF3CF]
px-4
py-4
font-bold
"
                >

                    INCLUSIONS

                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-black bg-transparent font-mono text-sm font-bold text-black select-none">
                        {openInc ? "−" : "+"}
                    </span>

                </button>


               {
  openInc &&
  (inclusions?.length > 0 ? (
    inclusions.map((item, index) => (
      <div
        key={index}
        className="p-4 border-t border-black"
      >
        <div className="flex items-center gap-3 font-bold text-sm">
          {item.icon && (
            <img
              src={item.icon}
              alt={item.title}
              className="w-6 h-6 shrink-0 object-contain"
            />
          )}

          <span className="whitespace-nowrap">{item.title}</span>
        </div>

        <p className="text-xs mt-2 text-black">
          {item.description}
        </p>
      </div>
    ))
  ) : (
    <div className="p-4 text-center text-[#757575] border-t border-black">
      No inclusions available.
    </div>
  ))
}

            </div>




            {/* EXCLUSIONS */}

            <div className="
  rounded-xl
  border border-black
  overflow-hidden
  bg-[#FADBD8]
">

                <button
                    onClick={() => setOpenExc(!openExc)}
                    className="
w-full
flex
items-center
justify-between
bg-[#FADBD8]
px-4
py-4
font-bold
"
                >

                    EXCLUSIONS

                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-black bg-transparent font-mono text-sm font-bold text-black select-none">
                        {openExc ? "−" : "+"}
                    </span>

                </button>



             {
  openExc &&
  (exclusions?.length > 0 ? (
    exclusions.map((item, index) => (
      <div
        key={index}
        className="p-4 border-t border-black"
      >
        <div className="flex items-center gap-3 font-bold text-sm">
          {item.icon && (
            <img
              src={item.icon}
              alt={item.title}
              className="w-6 h-6 shrink-0 object-contain"
            />
          )}

          <span className="whitespace-nowrap">{item.title}</span>
        </div>

        <p className="text-xs mt-2 text-black">
          {item.description}
        </p>
      </div>
    ))

  ) : (
    <div className="p-4 text-center text-[#757575] border-t border-black">
      No exclusions available.
    </div>
  ))
}
</div>
</div>
    )
}        // closes TableCard
export default function InclusionsExclusions({
    inclusions,
    exclusions,
    onBack,
}) {


  console.log("INCLUSIONS PROP", inclusions);
  console.log("EXCLUSIONS PROP", exclusions);

    return (
        <>
            {/* MOBILE HEADER */}
            {onBack && (
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 md:hidden">
                <button
                  onClick={onBack}
                  className="flex h-6 w-12 items-center justify-center rounded-full active:scale-95 transition"
                >
                  <Image src="/LeftArrow.svg" alt="Back" height={24} width={56} />
                </button>

                <h1 className="text-base font-bold tracking-tight text-ink">
                  Inclusions &amp; Exclusions
                </h1>

                <div className="w-12" />
              </div>
            )}

            {/* DESKTOP ONLY */}
           <section className="hidden md:block max-w-7xl min-[1920px]:max-w-[1709px] mx-auto px-4 py-12">
  <div className="grid lg:grid-cols-2 gap-[79px] items-start">

    {inclusions?.length > 0 ? (
      <TableCard
        title="Inclusions"
        items={inclusions}
        theme="inclusion"
      />
    ) : (
      <div className="border-2 rounded-lg p-8 text-center text-[#757575]">
        No inclusions available.
      </div>
    )}

    {exclusions?.length > 0 ? (
      <TableCard
        title="Exclusions"
        items={exclusions}
        theme="exclusion"
      />
    ) : (
      <div className="border-2 rounded-lg p-8 text-center text-[#757575]">
        No exclusions available.
      </div>
    )}

  </div>
</section>


            {/* MOBILE ONLY */}
            <MobileInclusions
                inclusions={inclusions}
                exclusions={exclusions}
            />

        </>
    );
}