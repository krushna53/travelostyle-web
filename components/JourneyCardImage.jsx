"use client";

import Image from "next/image";
import { useState } from "react";

export default function JourneyCardImage({ src, alt, className }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`absolute inset-0 flex items-center justify-center bg-[#F3F3F3] ${className || ""}`}>
        <Image
          src="/logo.svg"
          alt="TravelOStyle"
          width={308}
          height={52}
          className="w-1/2 max-w-[160px] opacity-60"
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={`object-cover ${className || ""}`}
      onError={() => setFailed(true)}
    />
  );
}
