"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

// Drop-in replacement for next/image. The optimizer fetches remote originals
// with a fixed 7s timeout, and large photos from the Drupal backend can take
// longer than that, which comes back as a 500 and a broken image. On a load
// error, retry once with the original URL (unoptimized) before giving up.
export default function SafeImage({ onError, unoptimized, ...props }: ImageProps) {
  const [failedSrc, setFailedSrc] = useState<ImageProps["src"] | null>(null);
  const fallback = failedSrc !== null && failedSrc === props.src;

  return (
    <Image
      {...props}
      alt={props.alt}
      unoptimized={unoptimized || fallback}
      onError={(e) => {
        if (!unoptimized && !fallback) setFailedSrc(props.src);
        else onError?.(e);
      }}
    />
  );
}
