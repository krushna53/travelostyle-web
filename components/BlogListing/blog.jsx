import { Suspense } from "react";
import Image from "next/image";
import heroImage from "./Hero.png";
import BlogGrid from "./BlogGrid";
import { API_BASE_URL } from "@/lib/config";
import { getAllBlogs, getBlogSlug, resolveBlogImage, resolveBlogCategories } from "@/lib/blog";

export default async function Blog() {
  // Pagination (9 per page = 3 columns x 3 rows) is handled client-side
  // inside BlogGrid, so all blogs are resolved here.
  const { data: blogs, included } = await getAllBlogs();

  const categoryRes = await fetch(`${API_BASE_URL}/jsonapi/taxonomy_term/categories`, {
    cache: "no-store",
  });

  const { data: categoryData = [] } = await categoryRes.json();

  const categories = [
    "All",
    ...categoryData.map((cat) => cat.attributes.name),
  ];

  const resolvedBlogs = blogs.map((blog) => {
    const imageUrl = resolveBlogImage(
      blog,
      included,
      "field_banner_image",
      "/recommended-blog.svg",
    );

    const categoryNames = resolveBlogCategories(blog, included).map((cat) => cat.attributes.name);
    const categoryName = categoryNames[0] || "Experiences";

    const dateLabel = new Date(blog.attributes.created).toLocaleDateString(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );

    return {
      id: blog.id,
      title: blog.attributes.title,
      imageUrl,
      categoryName,
      categoryNames,
      dateLabel,
      slug: getBlogSlug(blog),
    };
  });

  return (
    <section className="w-full bg-white">

    {/* =====================================================
    HERO
===================================================== */}

{/* HERO */}

<section className="relative w-full overflow-hidden">

  {/* MOBILE HERO */}
  <div className="md:hidden flex flex-col items-center px-5 mt-20 md:pt-6 pb-4">
    <div className="relative">
      <img
        src="/blog-journal-dots-mobile.svg"
        alt=""
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          md:-top-[55px]
          md:right-[15px]
          md:h-[74px]
          md:w-[153px]
          h-[82px]
          w-[152px]
          -top-[55px]
          -right-[38px]
          z-0
        "
      />
      <img
        src="/blog-journal-dots-bottom-mobile.svg"
        alt=""
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          md:-bottom-[95px]
          -bottom-[130px]
          -left-[70px]
          h-[113px]
          w-[196px]
        "
      />
      <h1
        className="
          font-taprom
          inline-block
          bg-[#F2E2DA]
          w-[336px]
          h-[29px]
          max-w-full
          px-[5px]
          text-[40px]
          font-normal
          not-italic
          leading-none
          tracking-[0.05em]
          text-center
          text-[#000000]
          flex
          items-center
          justify-center
          z-[2]
          relative
        "
      >
        The TOS Journal
      </h1>
    </div>

    <div className="relative mt-4 w-[334px] h-[477px] max-w-full overflow-hidden">
      <Image
        src={heroImage}
        alt="Travel Journal"
        priority
        fill
        className="object-cover"
      />
    </div>
  </div>

  <div
    className="
      hidden
      md:block
      relative
      mx-auto
      h-[500px]
      w-full
      max-w-[1704px]
    "
  >

    {/* DOTTED CURVE - upper (image to title) */}
  <img
  src="/blog-journal-dots.svg"
  alt=""
  aria-hidden="true"
  className="
    pointer-events-none
    absolute
    left-[350px]
    top-[-70px]
    h-[500px]
    w-[550px]
   max-md:hidden
  "
/>
    {/* DOTTED CURVE - lower (title to screen edge) */}
  <img
  src="/blog-journal-dots-bottom.svg"
  alt=""
  aria-hidden="true"
  className="
    pointer-events-none
    absolute
    left-[-266px]
    top-[307px]
    h-[300px]
    w-[800px]
   max-md:hidden
  "
/>
    {/* TITLE */}
   <div
  className="
    absolute
    left-[150px]
    top-[285px]
    z-10

  "
>
      <h1
        className="
          font-taprom
          inline-block
          bg-[#F2E2DA]
          px-[5px]
          py-[2px]
          text-[50px]
          font-normal
          not-italic
          leading-none
          tracking-[0.05em]
          text-center
          text-[#000000]
        "
      >
        The TOS Travel Journal
      </h1>
    </div>
    {/* MOBILE JOURNAL TITLE */}



    {/* HERO IMAGE */}

  {/* HERO IMAGE */}
<div
  className="
    absolute
    right-15
    top-5
    h-[500px]
    w-[600px]
    max-md:top-[90px]
    overflow-hidden
  "
>
  <Image
    src={heroImage}
    alt="Travel Journal"
    priority
    fill
    className="object-cover"
  />

</div>
</div>

</section>
<div className="h-[20px] md:h-[30px]" />
<div className="h-[15px] md:h-[20px]" />
      {/* =====================================================
          BLOG CONTENT
      ===================================================== */}
      <div className="mx-auto w-full max-w-[1280px] px-5 pb-12 sm:px-8 lg:px-12">

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
              We&apos;re working on new stories for The TOS Travel Journal.
              Check back soon.
            </p>
          </div>
        )}

      </div>

    </section>
  );
}
