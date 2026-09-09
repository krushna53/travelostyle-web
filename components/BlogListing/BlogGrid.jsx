"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const ITEMS_PER_PAGE = 9;

export default function BlogGrid({ blogs, categories }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredBlogs = useMemo(() => {
    if (selectedCategory === "All") return blogs;

    return blogs.filter((blog) =>
      blog.categoryNames.includes(selectedCategory)
    );
  }, [blogs, selectedCategory]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE)
  );

  const paginatedBlogs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBlogs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredBlogs, currentPage]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <>
      {/* Categories */}
      <div className="mb-[24px] flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between md:gap-0">
        <h2 className="font-[Nohemi] text-[24px] font-semibold leading-[40px] tracking-[0.05em] text-[#000000]">
          Categories
        </h2>

        <div className="flex flex-wrap items-center justify-start gap-[10px] md:justify-end">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`
                flex
                items-center
                justify-center
                rounded-full
                border
                border-ink
                px-[16px]
                py-[10px]
                text-[16px]
                leading-none
                text-ink

                ${
                  selectedCategory === category
                    ? "bg-[#F2E2DA]"
                    : "bg-white"
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-[24px] w-full h-[2px] bg-ink" />

      {/* =====================================================
          BLOG GRID
      ===================================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-5
          sm:grid-cols-2
          lg:grid-cols-3
          lg:[grid-template-columns:repeat(3,524px)]
        "
      >
        {paginatedBlogs.map((blog) => (
          <div
            key={blog.id}
            className="
              flex
              w-[524px]
              max-w-full
              flex-col
              overflow-hidden
              rounded-[10px]
              border-2
              border-ink
              bg-[#FAFAFA]
            "
          >
            {/* TOP */}
            <div className="flex items-center justify-between px-[12px] py-[10px]">
              <p className="text-[16px] font-semibold leading-[40px] tracking-[0.05em] text-[#000000]">
                {blog.dateLabel}
              </p>

              <button
                className="
                  flex
                  h-[31px]
                  shrink-0
                  items-center
                  justify-center
                  whitespace-nowrap
                  rounded-full
                  border
                  border-ink
                  bg-white
                  px-[16px]
                  text-[16px]
                  leading-none
                  text-ink
                "
              >
                {blog.categoryName}
              </button>
            </div>

            {/* IMAGE */}
            <div className="px-[12px]">
              <Image
                src={blog.imageUrl}
                alt={blog.title || "Blog"}
                width={524}
                height={296}
                className="
                  block
                  h-[296px]
                  w-full
                  object-cover
                "
              />
            </div>

            {/* TITLE */}
            <div className="min-h-[105px] px-[12px] pt-[12px]">
              <h4
                className="
                  font-[Nohemi]
                  text-[21px]
                  font-semibold
                  leading-[32px]
                  tracking-[0.05em]
                  text-ink
                "
              >
                {blog.title}
              </h4>
            </div>

            {/* BOTTOM */}
            <div className="mt-auto px-[12px] pb-[10px]">
              <div className="border-t border-ink" />

              <Link
                href={`/blog/${blog.slug}`}
                className="mt-[10px] flex items-center justify-between"
              >
                <span
                  className="
                    text-[16px]
                    font-semibold
                    leading-[40px]
                    tracking-[0.05em]
                    text-ink
                  "
                >
                  READ MORE
                </span>

                <Image
                  src="/ArrowUpRight.svg"
                  alt="Arrow"
                  width={24}
                  height={24}
                />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* =====================================================
          PAGINATION
      ===================================================== */}

      <div className="flex items-center justify-center gap-4 pt-8">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={
              page === currentPage
                ? "flex w-[13px] h-[40px] md:w-auto md:h-auto items-center justify-center text-[13px] md:text-[9px] font-black md:font-semibold text-ink underline underline-offset-4"
                : "flex w-[13px] h-[40px] md:w-auto md:h-auto items-center justify-center text-[13px] md:text-[9px] font-normal text-[#9B9B9B]"
            }
          >
            {page}
          </button>
        ))}

        {currentPage < totalPages && (
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="text-[10px] text-ink"
          >
            →
          </button>
        )}
      </div>
    </>
  );
}
