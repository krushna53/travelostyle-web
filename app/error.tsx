"use client";

import { startTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Shown when a page throws on its first render, e.g. Drupal being down
// before that page has ever been cached. Pages that were cached earlier keep
// serving that copy instead. Kept free of SearchBar/Footer, which load data
// from the same backend that just failed.
export default function Error({ reset }: { reset: () => void }) {
  const router = useRouter();

  // The error came from the server render, so re-fetch it before resetting
  // the boundary — reset() alone would re-render the same failed payload.
  const retry = () =>
    startTransition(() => {
      router.refresh();
      reset();
    });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAFA] px-4 text-center">
      <Link href="/">
        <Image
          src="/TravelOStyleBlack.svg"
          alt="TravelOStyle"
          width={308}
          height={56}
          className="h-auto w-[220px] md:w-[280px]"
        />
      </Link>
      <h2 className="mt-10 font-[Nohemi] text-[28px] font-semibold tracking-[0.05em] text-ink">
        We&apos;ll be right back
      </h2>
      <p className="mt-3 max-w-[420px] text-[14px] text-[#4A4A4A]">
        This page is taking longer than usual to load. Please try again in a
        moment.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={retry}
          className="h-[36px] rounded-full bg-[#2F2E8B] px-6 text-[14px] font-medium text-white"
        >
          Try again
        </button>
        <Link
          href="/"
          className="flex h-[36px] items-center rounded-full border border-[#2F2E8B] px-6 text-[14px] font-medium text-[#2F2E8B]"
        >
          Go to homepage
        </Link>
      </div>
    </div>
  );
}
