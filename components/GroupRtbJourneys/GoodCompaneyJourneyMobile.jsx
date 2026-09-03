"use client";
import Image from "next/image";

export default function GoodCompaneyJourneyMobile() {

  const polaroids = [
    {
      id: 1,
      imgUrl: "/Kampus.svg",
      rotation: "-rotate-[6deg]",
      imgRotation: "rotate-[-4deg]",
      offsetX: "-translate-x-12",
      marginTop: "mt-4",
      borderColor: "border-[#1d2d5f]/70",
      zIndex: "z-10",
    },
    {
      id: 2,
      imgUrl: "/Trecmanfreemind.svg",
      rotation: "rotate-[8deg]",
      imgRotation: "rotate-[6deg]",
      offsetX: "translate-x-10",
      marginTop: "-mt-20",
      borderColor: "border-[#1d2d5f]/70",
      zIndex: "z-20",
    },
    {
      id: 3,
      imgUrl: "/ChadWitbooi.svg",
      rotation: "-rotate-[5deg]",
      imgRotation: "rotate-[-2deg]",
      offsetX: "-translate-x-10",
      marginTop: "-mt-20",
      borderColor: "border-[#1d2d5f]/70",
      zIndex: "z-30",
    },
    {
      id: 4,
      imgUrl: "/Minanl.svg",
      rotation: "rotate-[4deg]",
      imgRotation: "rotate-[3deg]",
      offsetX: "translate-x-6",
      marginTop: "-mt-20",
      borderColor: "border-[#1d2d5f]/70",
      zIndex: "z-40",
    },
  ];

  return (
    <div className="relative w-full min-h-screen px-4 pt-10 pb-16 overflow-hidden flex flex-col items-center select-none block md:hidden">
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[5px] left-[-90px] w-[320px] h-[110px]">
          <Image
            src="/group/Line1.svg"
            alt="Dashed Line 1"
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute top-[150px] right-[-20px] w-[260px] h-[180px]">
          <Image
            src="/group/Line2.svg"
            alt="Dashed Line 2"
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute top-[400px] left-[250px] w-[100px] h-[130px]">
          <Image
            src="/group/Line3.svg"
            alt="Dashed Line 3"
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute top-[600px] left-[-20px] w-[200px] h-[80px]">
          <Image
            src="/group/Line4.svg"
            alt="Dashed Line 4"
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute top-[790px] left-[220px] w-[150px] h-[80px]">
          <Image
            src="/group/Line5.svg"
            alt="Dashed Line 5"
            fill
            className="object-contain"
          />
        </div>
      </div>
      <div className="relative w-full text-left z-10 flex flex-col items-start pl-2 mt-8 pt-4 gap-2.5">
        <div className="px-3 py-1 rounded-[2px] w-fit">
          <h2 className="font-taprom italic font-serif text-[40px] sm:text-[36px] leading-tight sub-title-bg text-[#111111] tracking-tight">
            Journeys that get
          </h2>
        </div>
        <div className="px-3 py-1 rounded-[2px] w-fit">
          <h2 className="font-taprom italic font-serif text-[40px] sm:text-[36px] leading-tight sub-title-bg text-[#111111] tracking-tight">
            better in good
          </h2>
        </div>
        <div className="px-3 py-1 rounded-[2px] w-fit">
          <h2 className="font-taprom italic font-serif text-[40px] sm:text-[36px] leading-tight sub-title-bg text-[#111111] tracking-tight">
            company
          </h2>
        </div>
      </div>

      {/* Vertical Overlapping Polaroids Stack */}
      <div className="relative w-full mt-8 flex flex-col items-center z-10 pb-6">
        {polaroids.map((photo) => (
          <div
            key={photo.id}
            className={`
              relative bg-white p-[8px] pb-10 shadow-[0_10px_25px_rgba(0,0,0,0.12)] 
              border-[1.5px] ${photo.borderColor} rounded-[2px] 
              w-[230px] shrink-0 transform transition-all duration-300
              ${photo.rotation} ${photo.marginTop} ${photo.offsetX} ${photo.zIndex}
            `}
          >
            <div
              className={`relative ${photo.imgRotation} w-full h-[210px] overflow-hidden bg-slate-100`}
            >
              <img
                src={photo.imgUrl}
                alt={`Travel group snapshot ${photo.id}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}