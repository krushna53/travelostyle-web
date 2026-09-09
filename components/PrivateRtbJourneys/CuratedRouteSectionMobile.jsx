"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

const polaroidData = [
  {
    id: "day-1",
    label: "DAY 1",
    image: "/private/Day1.svg",
    className: "top-0 left-[10px] -rotate-[8deg] z-10 w-[200px]",
  },
  {
    id: "day-2",
    label: "DAY 2",
    image: "/private/Day2.svg",
    className: "top-[35px] right-[10px] rotate-[6deg] z-20 w-[170px]",
  },
  {
    id: "day-3",
    label: "DAY 3",
    image: "/private/Day3.svg",
    className: "top-[190px] right-[20px] -rotate-[4deg] z-30 w-[170px]",
  },
  {
    id: "day-4",
    label: "DAY 4",
    image: "/private/Day4.svg",
    className: "top-[220px] left-[5px] rotate-[3deg] z-20 w-[200px]",
  },
  {
    id: "day-5",
    label: "DAY 5",
    image: "/private/Day5.svg",
    className: "top-[380px] right-[15px] -rotate-[7deg] z-40 w-[170px]",
  },
  {
    id: "day-6",
    label: "DAY 6",
    image: "/private/Day6.svg",
    className: "top-[440px] left-[10px] rotate-[6deg] z-30 w-[200px]",
  },
  {
    id: "day-7",
    label: "DAY 7",
    image: "/private/Day6.svg",
    className: "top-[560px] right-[10px] -rotate-[3deg] z-20 w-[170px]",
  },
];

export default function CuratedRouteSectionMobile() {
  const router = useRouter();
  return (
    <div className="flex justify-center min-h-screen block md:hidden">
      <link
        href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap"
        rel="stylesheet"
      />
      <div className="w-full max-w-[375px] mx-auto min-h-[880px] flex flex-col items-center py-5">
        <div className="text-center font-bold text-[36px] text-[#2B2B2B] leading-[1.1] space-y-2 mb-8">
          <div>
            <span className="font-taprom bg-[#f8e1da] px-3  inline-block rounded-xs transform -rotate-1">
              A curated route,
            </span>
          </div>
          <div>
            <span className="font-taprom bg-[#f8e1da] px-4 inline-block rounded-xs transform rotate-1">
              perfected by you,
            </span>
          </div>
          <div>
            <span className="font-taprom bg-[#f8e1da] px-4 inline-block rounded-xs transform -rotate-1">
              for you
            </span>
          </div>
        </div>
        <div className="relative w-full h-[750px] px-2">
          {polaroidData.map((item) => (
            <div
              key={item.id}
              className={`absolute bg-white p-2 pb-3 rounded-xs border border-[#919191]-100 shadow-lg transition-transform duration-300 hover:z-50 hover:scale-105 ${item.className}`}
              style={{
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div className="relative w-full h-36 bg-gray-100 overflow-hidden border border-gray-100">
                <Image
                  src={item.image}
                  alt={item.label}
                  fill
                  sizes={
                    item.className.includes("w-[200px]") ? "200px" : "170px"
                  }
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="text-center mt-2.5 font-sans font-black text-[10px] tracking-widest text-black uppercase">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push("/comparison")}
          className="mt-6 bg-[#242e6d] text-white font-semibold text-[11.5px] px-6 py-3 rounded-xs shadow-md hover:bg-[#1a2353] transition-colors duration-150 uppercase tracking-widest"
        >
          Compare Trips
        </button>
      </div>
    </div>
  );
}
