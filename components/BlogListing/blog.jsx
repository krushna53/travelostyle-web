import { Suspense } from "react";
import Image from "next/image";
import heroImage from "./Hero.png";
import BlogGrid from "./BlogGrid";
import { API_BASE_URL } from "@/lib/config";
import { getAllBlogs, getBlogSlug, resolveBlogImage, resolveBlogCategories } from "@/lib/blog";
import DottedLine from "@/components/ui/DottedLine";

const HERO_TITLE_CLASS =
  "font-taprom bg-[#F2E2DA] px-[5px] font-normal not-italic leading-none tracking-[0.05em] text-center text-[#000000]";

export default async function Blog() {
  // Pagination (9 per page = 3 columns x 3 rows) is handled client-side
  // inside BlogGrid, so all blogs are resolved here.
  const { data: blogs, included } = await getAllBlogs();

  const categoryRes = await fetch(`${API_BASE_URL}/jsonapi/taxonomy_term/categories`, {
    cache: "no-store",
  });
  const { data: categoryData = [] } = await categoryRes.json();

  const categories = ["All", ...categoryData.map((cat) => cat.attributes.name)];

  const resolvedBlogs = blogs.map((blog) => {
    const categoryNames = resolveBlogCategories(blog, included).map((cat) => cat.attributes.name);

    return {
      id: blog.id,
      title: blog.attributes.title,
      imageUrl: resolveBlogImage(blog, included, "field_banner_image", "/recommended-blog.svg"),
      categoryName: categoryNames[0] || "Experiences",
      categoryNames,
      dateLabel: new Date(blog.attributes.created).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      slug: getBlogSlug(blog),
    };
  });

  return (
    <section className="w-full bg-white">
      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative w-full overflow-hidden">
        {/* ---------- MOBILE ----------
            390 Figma board scaled by --fig-u, so lines, title and image stay
            locked together at every width up to 767. Title 336x29 at (27,80),
            image 334x477 at (28,125). The loop bleeds off the right edge and the
            sweep comes in from off the left edge; the sweep's end sits exactly
            on the loop's start (behind the title) so they read as one line.
            Lines are painted first, so the title and image cover them. */}
        <div
          className="md:hidden relative w-full h-[calc(618*var(--fig-u))]"
          style={{ "--fig-u": "calc(100vw / 390)" }}
        >
          <DottedLine
            name="blogLoop"
            weight={3}
            dash={16}
            className="left-[calc(249*var(--fig-u))] top-[calc(20*var(--fig-u))] w-[calc(152*var(--fig-u))] h-[calc(82*var(--fig-u))]"
          />
          <DottedLine
            name="blogSweep"
            weight={3}
            dash={16}
            className="left-[calc(-83.2*var(--fig-u))] top-[calc(100*var(--fig-u))] w-[calc(334.2*var(--fig-u))] h-[calc(127.5*var(--fig-u))]"
          />

          <h1
            className={`${HERO_TITLE_CLASS} absolute z-10 flex items-center justify-center left-[calc(27*var(--fig-u))] top-[calc(80*var(--fig-u))] w-[calc(336*var(--fig-u))] h-[calc(29*var(--fig-u))] text-[calc(40*var(--fig-u))]`}
          >
            The TOS Journal
          </h1>

          <div className="absolute z-10 overflow-hidden left-[calc(28*var(--fig-u))] top-[calc(125*var(--fig-u))] w-[calc(334*var(--fig-u))] h-[calc(477*var(--fig-u))]">
            <Image src={heroImage} alt="Travel Journal" priority fill className="object-cover" />
          </div>
        </div>

        {/* ---------- DESKTOP ----------
            One full-width board sized in vw against the 1920 Figma frame, so the
            lines, title and image scale together and the loop always ends on the
            image's left edge (56.82vw). Lefts include Figma's 108px (5.625vw)
            page margin; the container used to be max-w-[1704px], which dropped
            that margin below 1704px and pulled the lines away from the image. */}
        <div className="hidden md:block relative mt-20 h-[38.75vw] w-full">
          {/* Dotted curve — upper, with the loop */}
          <DottedLine
            name="blogLoop"
            weight={5}
            dash={16}
            className="left-[29.69vw] top-[1.04vw] w-[27.14vw] h-[15.83vw]"
          />
          {/* Dotted curve — lower sweep, bleeds off the left edge. Its box is
              sized so the path's top-right end lands exactly on blogLoop's
              start point (24.2vw, 16.67vw), making the two one continuous line
              instead of crossing each other. */}
          <DottedLine
            name="blogSweep"
            weight={5}
            dash={16}
            className="left-[-7.72vw] top-[16.53vw] w-[37.69vw] h-[18.13vw]"
          />

          <div className="absolute left-[13.44vw] top-[15.16vw] z-10">
            <h1 className={`${HERO_TITLE_CLASS} inline-block px-[0.31em]! py-0 leading-[0.86]! text-[3.333vw]`}>
              The TOS Travel Journal
            </h1>
          </div>

          {/* Anchored by its left edge (where the loop ends) rather than right-0:
              100vw includes the scrollbar, so right-0 would slide the image under
              the loop. The few px past the edge are clipped by the section. */}
          <div className="absolute top-[1.04vw] left-[56.82vw] w-[43.18vw] h-[33.49vw] overflow-hidden">
            <Image src={heroImage} alt="Travel Journal" priority fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* =====================================================
          BLOG CONTENT
      ===================================================== */}
      <div className="h-[35px] md:h-[50px]" />

      <div className="mx-auto w-full max-w-[1280px] px-5 pb-12 sm:px-8 lg:px-12 min-[1920px]:max-w-[1920px] min-[1920px]:px-[108px]">
        {resolvedBlogs.length > 0 ? (
          <Suspense fallback={null}>
            <BlogGrid blogs={resolvedBlogs} categories={categories} />
          </Suspense>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <h2 className="font-[Nohemi] text-[28px] font-semibold tracking-[0.05em] text-ink">
              Coming Soon
            </h2>
            <p className="mt-3 max-w-[420px] text-[14px] text-[#4A4A4A]">
              We&apos;re working on new stories for The TOS Travel Journal. Check back soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
