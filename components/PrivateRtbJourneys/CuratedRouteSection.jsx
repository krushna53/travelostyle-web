"use client";
import { useRouter } from "next/navigation";
import React from "react";

const routeDays = [
  {
    day: "DAY 1",
    img: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=600",
    styles:
      "absolute left-[3.5%] top-[105px] w-[215px] -rotate-[8deg] z-30 shadow-[5px_12px_30px_rgba(0,0,0,0.15)] border-neutral-200/80",
    aspect: "aspect-[4/3.4]",
    textSize: "text-[11.5px]",
    padding: "p-3.5 pb-5.5",
  },
  {
    day: "DAY 2",
    img: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=600",
    styles:
      "absolute left-[16.5%] top-[20px] w-[200px] rotate-[2deg] z-10 shadow-[2px_10px_26px_rgba(0,0,0,0.12)] border-neutral-200/60",
    aspect: "aspect-[4/3.4]",
    textSize: "text-[11px]",
    padding: "p-3 pb-5",
  },
  {
    day: "DAY 4",
     img: "https://images.unsplash.com/photo-1498307833015-e7b400441eb8?w=600",
    styles:
      "absolute left-[24%] top-[140px] w-[205px] -rotate-[5deg] z-40 shadow-[6px_16px_34px_rgba(0,0,0,0.16)] border-neutral-200",
    aspect: "aspect-[4/3.4]",
    textSize: "text-[11.5px]",
    padding: "p-3.5 pb-5.5",
  },
  {
    day: "DAY 5",
    img: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=600",
    styles:
      "absolute left-[36%] top-[5px] w-[255px] rotate-[0deg] z-20 shadow-[0_20px_42px_rgba(0,0,0,0.15)] border-neutral-200/90",
    aspect: "aspect-[4/3.5]",
    textSize: "text-[13px]",
    padding: "p-4 pb-7",
  },
  {
    day: "DAY 6",
    img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600",
    styles:
      "absolute left-[50%] top-[135px] w-[205px] -rotate-[7deg] z-30 shadow-[4px_13px_30px_rgba(0,0,0,0.13)] border-neutral-200/70",
    aspect: "aspect-[4/3.4]",
    textSize: "text-[11.5px]",
    padding: "p-3.5 pb-5.5",
  },
  {
    day: "DAY 7",
    img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600",
    styles:
      "absolute left-[60.5%] top-[20px] w-[195px] rotate-[6deg] z-40 shadow-[5px_13px_32px_rgba(0,0,0,0.14)] border-neutral-200/70",
    aspect: "aspect-[4/3.4]",
    textSize: "text-[11px]",
    padding: "p-3 pb-5",
  },
  {
    day: "DAY 8",
    img: "https://images.unsplash.com/photo-1498307833015-e7b400441eb8?w=600",
    styles:
      "absolute left-[73.5%] top-[-40px] w-[240px] rotate-[1.5deg] z-20 shadow-[4px_16px_38px_rgba(0,0,0,0.14)] border-neutral-200",
    aspect: "aspect-[4/3.6]",
    textSize: "text-[12.5px]",
    padding: "p-4 pb-6.5",
  },
];

export default function CuratedRouteSection() {
  const router = useRouter();
  return (
    <div className=" hidden md:flex w-full  bg-white relative flex flex-col items-center overflow-hidden select-none border-t-[1px] border-[#3f4284]">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&display=swap');
        .cursive-font {
          font-family: 'Caveat', cursive, sans-serif !important;
        }
      `,
        }}
      />

      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 px-8 flex items-center">
        <svg
          className="w-full h-[360px] text-[#1b2b6b] opacity-90 mt-10"
          viewBox="0 0 1200 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M-40 240 C 110 30, 190 350, 350 230 C 440 100, 610 230, 770 145 C 930 70, 1070 10, 1240 115"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeDasharray="6 6"
          />
        </svg>
      </div>
      <div className="relative z-10 flex flex-col items-center text-center px-4 mb-15 mt-15">
        <span className="font-taprom text-[46px] md:text-[52px] font-bold text-[#2d2d2d] bg-[#f1e3d9] px-5  tracking-wide leading-none rounded-xs shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          A curated route, perfected by
        </span>
        <span className="font-taprom text-[46px] md:text-[52px] font-bold text-[#2d2d2d] bg-[#f1e3d9] px-5 mt-3.5 tracking-wide leading-none rounded-xs shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          you, for you
        </span>
      </div>

      <div className="w-full max-w-[1200px] h-[480px] relative z-20 mx-auto px-4 flex items-center justify-start">
        {routeDays.map((item, index) => (
          <div
            key={index}
            className={`bg-white border border-[#919191]-100 transition-transform duration-200 hover:scale-105 hover:z-50 ${item.styles} ${item.padding}`}
          >
            <div
              className={`w-full overflow-hidden border border-neutral-200 rounded-xs ${item.aspect}`}
            >
              <img
                src={item.img}
                alt={item.day}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div
              className={`mt-4.5 text-center font-black text-[#111] tracking-widest uppercase ${item.textSize}`}
            >
              {item.day}
            </div>
          </div>
        ))}
        <div className="absolute right-[5%] bottom-[10vw] z-50">
          <button
            onClick={() => router.push("/comparison")}
            className="bg-[#242e6d] text-white font-semibold text-[11.5px] px-6 py-3 rounded-xs shadow-md hover:bg-[#1a2353] transition-colors duration-150 uppercase tracking-widest"
          >
            Compare Trips
          </button>
        </div>
      </div>
    </div>
  );
}