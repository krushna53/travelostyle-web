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
        {/* ---------- MOBILE ---------- */}
        <div className="md:hidden flex flex-col items-center px-5 mt-20 pb-4">
          <div className="relative">
            <img
              src="/blog-journal-dots-mobile.svg"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -top-[60px] -right-[38px] h-[82px] w-[152px] z-0"
            />
            <img
              src="/blog-journal-dots-bottom-mobile.svg"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-[119px] -left-[70px] h-[113px] w-[196px]"
            />
            <h1
              className={`${HERO_TITLE_CLASS} relative z-[2] flex items-center justify-center w-[336px] h-[29px] max-w-full text-[40px]`}
            >
              The TOS Journal
            </h1>
          </div>

          <div className="relative mt-4 w-[334px] h-[477px] max-w-full overflow-hidden">
            <Image src={heroImage} alt="Travel Journal" priority fill className="object-cover" />
          </div>
        </div>

        {/* ---------- DESKTOP ----------
            Sized in vw against the 1920 Figma frame, so the whole hero scales as
            one unit instead of drifting apart at other widths. Container is
            825px tall at 1920 (was 500px, which cut 120px off the hero image and
            left no room for the lower dotted sweep to reach the left edge); that
            height is what puts "Categories" on Figma's y=985 and the card grid
            on y=1080. */}
        <div className="hidden md:block relative mx-auto mt-20 h-[38.75vw] w-full max-w-[1704px]">
          {/* Dotted curve — upper, with the loop */}
          <DottedLine
            name="blogLoop"
            weight={5}
            dash={16}
            className="left-[24.06vw] top-[1.04vw] w-[27.14vw] h-[15.83vw]"
          />
          {/* Dotted curve — lower sweep, bleeds off the left edge */}
          <DottedLine
            name="blogSweep"
            weight={5}
            dash={16}
            className="-left-[13.36vw] top-[11.2vw] w-[42.08vw] h-[23.33vw]"
          />

          <div className="absolute left-[7.81vw] top-[15.16vw] z-10">
            <h1 className={`${HERO_TITLE_CLASS} inline-block py-[2px] text-[2.6vw]`}>
              The TOS Travel Journal
            </h1>
          </div>

          {/* Figma runs the image to the frame edge, past the 1704px container.
              The calc resolves to -108px at 1920 and to 0 once the container is
              full-width, so it hugs the viewport edge without overflowing. */}
          <div className="absolute top-[1.04vw] right-[calc((100%-100vw)/2)] w-[43.18vw] h-[33.49vw] overflow-hidden">
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
