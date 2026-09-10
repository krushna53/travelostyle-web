"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function BlogContent({
  blog,
  categories,
  allCategories = [],
  recommendedBlogs = [],
  bannerImage,
  galleryImages = [],
  previousPost,
  nextPost,
}) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [newsletterName, setNewsletterName] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterAgree, setNewsletterAgree] = useState(false);
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();

    if (!newsletterName.trim() || !newsletterEmail.trim()) {
      setNewsletterError("Please enter your name and email.");
      return;
    }

    if (!EMAIL_PATTERN.test(newsletterEmail.trim())) {
      setNewsletterError("Please enter a valid email address.");
      return;
    }

    if (!newsletterAgree) {
      setNewsletterError("Please agree to receive updates from TravelOStyle.");
      return;
    }

    setNewsletterError("");
    setNewsletterSubmitted(true);
  };

  const filteredRecommended = (
    selectedCategory === "All"
      ? recommendedBlogs
      : recommendedBlogs.filter((item) =>
          item.categoryNames.includes(selectedCategory)
        )
  ).slice(0, 3);

  return (
    <section className="px-5 md:px-8 overflow-x-hidden lg:px-[60px] pb-[60px] lg:pb-[80px] min-[768px]:lg:px-[58px] min-[1024px]:lg:px-[72px] min-[1280px]:lg:px-[77px] min-[1366px]:lg:px-[81px] min-[1441px]:lg:px-[84px] min-[1500px]:lg:px-[108px]">
      <div className="mt-8 min-[1040px]:mt-[44px] flex flex-col min-[1040px]:flex-row items-start gap-10 min-[1040px]:gap-[48px]">
        {/* LEFT SIDE */}
        <div className="min-w-0 flex-1 min-w-0">
          {blog.attributes.field_introduction?.processed && (
            <div
              className="min-w-0 max-w-full overflow-hidden font-nohemi font-normal text-[16px] leading-[30px] tracking-[0.02em] text-ink min-[768px]:w-[523px] min-[1024px]:w-[654px] min-[1280px]:w-[698px] min-[1366px]:w-[736px] min-[1441px]:w-[766px] min-[1500px]:w-[981px] min-[768px]:text-[10px] min-[768px]:leading-[19px] min-[768px]:tracking-[0.05em] min-[768px]:text-[#1A1A1A] min-[1024px]:text-[12px] min-[1024px]:leading-[24px] min-[1280px]:text-[13px] min-[1280px]:leading-[26px] min-[1366px]:text-[14px] min-[1366px]:leading-[27px] min-[1441px]:text-[14px] min-[1441px]:leading-[28px] min-[1500px]:text-[18px] min-[1500px]:leading-[36px]"
              dangerouslySetInnerHTML={{
                __html: blog.attributes.field_introduction.processed,
              }}
            />
          )}
          {bannerImage && (
            <Image
              src={bannerImage}
              alt="Golden Triangle"
              width={1008}
              height={410}
              className="mt-8 w-full h-auto aspect-[1008/410] max-w-full flex-shrink-0 object-cover min-[768px]:w-[538px] min-[768px]:h-[219px] min-[768px]:aspect-auto min-[1024px]:w-[672px] min-[1024px]:h-[273px] min-[1280px]:w-[717px] min-[1280px]:h-[292px] min-[1366px]:w-[756px] min-[1366px]:h-[308px] min-[1441px]:w-[788px] min-[1441px]:h-[320px] min-[1500px]:w-[1008px] min-[1500px]:h-[410px]"
            />
          )}

          {blog.attributes.field_body?.processed && (
            <div
              className="min-w-0 max-w-full overflow-hidden mt-[16px] font-nohemi font-normal text-[16px] leading-[30px] tracking-[0.02em] text-ink min-[768px]:w-[523px] min-[1024px]:w-[654px] min-[1280px]:w-[698px] min-[1366px]:w-[736px] min-[1441px]:w-[766px] min-[1500px]:w-[981px] min-[768px]:text-[10px] min-[768px]:leading-[19px] min-[768px]:tracking-[0.05em] min-[768px]:text-[#1A1A1A] min-[1024px]:text-[12px] min-[1024px]:leading-[24px] min-[1280px]:text-[13px] min-[1280px]:leading-[26px] min-[1366px]:text-[14px] min-[1366px]:leading-[27px] min-[1441px]:text-[14px] min-[1441px]:leading-[28px] min-[1500px]:text-[18px] min-[1500px]:leading-[36px]"
              dangerouslySetInnerHTML={{
                __html: blog.attributes.field_body.processed,
              }}
            />
          )}

          {galleryImages.length > 0 && (
            <div className="mt-10 grid grid-cols-1 min-[768px]:grid-cols-2 lg:max-w-[840px] gap-6 lg:gap-[24px]">
              {galleryImages.map(
                (image, index) =>
                  image?.attributes?.uri?.url && (
                    <Image
                      key={image.id || index}
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${image.attributes.uri.url}`}
                      alt={blog.attributes.title || "Blog image"}
                      width={408}
                      height={536}
                      className="w-full h-auto aspect-[333/438] object-cover object-center min-[768px]:aspect-[408/536]"
                    />
                  )
              )}
            </div>
          )}

          {/* Previous / Next */}
          {(previousPost || nextPost) && (
            <div className="mt-14 flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-center">
              {previousPost ? (
                <Link
                  href={`/blog/${previousPost.slug}`}
                  className="flex items-center gap-[12px] text-[14px] font-medium text-ink self-start sm:self-auto"
                >
                  <Image src="/ArrowLeft.svg" alt="Previous" width={24} height={24} />
                  <span>{previousPost.title}</span>
                </Link>
              ) : (
                <span />
              )}

              {nextPost ? (
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="flex items-center gap-[12px] text-[14px] font-medium text-ink self-end sm:self-auto"
                >
                  <span>{nextPost.title}</span>
                  <Image src="/ArrowUpRight.svg" alt="Next" width={24} height={24} />
                </Link>
              ) : (
                <span />
              )}
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="min-w-0 w-full lg:flex-1 lg:max-w-[360px] min-[768px]:lg:max-w-[294px] min-[1024px]:lg:max-w-[368px] min-[1280px]:lg:max-w-[393px] min-[1366px]:lg:max-w-[414px] min-[1441px]:lg:max-w-[431px] min-[1500px]:lg:max-w-[552px]">
          <div className="mb-[24px] border-b border-ink lg:hidden" />

          <h3 className="font-nohemi text-[20px] font-semibold leading-[30px] tracking-[0.02em] text-ink min-[768px]:text-[13px] min-[768px]:leading-[21px] min-[768px]:tracking-[0.05em] min-[768px]:text-[#000000] min-[1024px]:text-[16px] min-[1024px]:leading-[27px] min-[1280px]:text-[17px] min-[1280px]:leading-[28px] min-[1366px]:text-[18px] min-[1366px]:leading-[30px] min-[1441px]:text-[19px] min-[1441px]:leading-[31px] min-[1500px]:text-[24px] min-[1500px]:leading-[40px]">
            Categories
          </h3>

          <div className="mt-[16px] flex flex-wrap gap-[10px]">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`lg:hidden flex h-[31px] items-center justify-center px-[16px] text-[16px] leading-none rounded-full border border-ink font-normal text-ink ${
                selectedCategory === "All" ? "bg-[#F2E2DA]" : "bg-white"
              }`}
            >
              All
            </button>
            {allCategories.map((name) => (
              <button
                key={name}
                onClick={() => setSelectedCategory(name)}
                className={`flex h-[31px] items-center justify-center px-[16px] text-[16px] leading-none rounded-full border border-ink font-normal text-ink lg:pointer-events-none lg:!bg-white ${
                  selectedCategory === name ? "bg-[#F2E2DA]" : "bg-white"
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          <div className="mt-[28px] border-b border-ink" />

          <h3 className="mt-[28px] text-[20px] font-semibold leading-[30px] text-ink">
            Recommended Blogs
          </h3>
          {/* Mobile: filtered by selected category */}
          <div className="lg:hidden">
            {filteredRecommended.map((item) => (
              <div
                key={item.id}
                className="mt-5 flex flex-col overflow-hidden rounded-[10px] border-2 border-ink bg-[#FAFAFA]"
              >
                <div className="flex items-center justify-between px-[14px] py-[12px]">
                  <p className="text-[16px] font-semibold leading-[40px] tracking-[0.05em] text-[#000000]">
                    {item.dateLabel}
                  </p>
                  <button className="flex h-[31px] items-center justify-center rounded-full border border-ink bg-white px-[16px] text-[16px] leading-none text-ink">
                    {item.categoryName}
                  </button>
                </div>

                <div className="px-[14px]">
                  <div className="relative w-full aspect-[524/296]">
                    <Image
                      src={item.imageUrl}
                      alt="Recommended Blog"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="min-h-[105px] px-[12px] pt-[12px]">
                  <h4 className="font-[Nohemi] text-[21px] font-semibold leading-[32px] tracking-[0.05em] text-ink">
                    {item.title}
                  </h4>
                </div>

                <div className="mt-[10px] px-[14px] pb-[12px]">
                  <div className="border-t border-ink" />
                  <Link
                    href={`/blog/${item.slug}`}
                    className="mt-[10px] flex items-center justify-between"
                  >
                    <span className="text-[16px] font-semibold leading-[40px] tracking-[0.05em] text-ink">
                      READ MORE
                    </span>
                    <Image src="/ArrowUpRight.svg" alt="Arrow" width={24} height={24} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: always shows all, unfiltered */}
          <div className="hidden lg:block">
            {recommendedBlogs.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="mt-5 flex flex-col overflow-hidden rounded-[10px] border-2 border-ink bg-[#FAFAFA]"
              >
                <div className="flex items-center justify-between px-[14px] py-[12px]">
                  <p className="text-[16px] font-semibold leading-[40px] tracking-[0.05em] text-[#000000]">
                    {item.dateLabel}
                  </p>
                  <button className="flex h-[31px] items-center justify-center rounded-full border border-ink bg-white px-[16px] text-[16px] leading-none text-ink">
                    {item.categoryName}
                  </button>
                </div>

                <div className="px-[14px]">
                  <div className="relative w-full aspect-[524/296]">
                    <Image
                      src={item.imageUrl}
                      alt="Recommended Blog"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="min-h-[105px] px-[12px] pt-[12px]">
                  <h4 className="font-[Nohemi] text-[21px] font-semibold leading-[32px] tracking-[0.05em] text-ink">
                    {item.title}
                  </h4>
                </div>

                <div className="mt-[10px] px-[14px] pb-[12px]">
                  <div className="border-t border-ink" />
                  <Link
                    href={`/blog/${item.slug}`}
                    className="mt-[10px] flex items-center justify-between"
                  >
                    <span className="text-[16px] font-semibold leading-[40px] tracking-[0.05em] text-ink">
                      READ MORE
                    </span>
                    <Image src="/ArrowUpRight.svg" alt="Arrow" width={24} height={24} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-[24px] border-b border-ink hidden lg:block" />

          {/* Subscribe */}
          <div className="mt-[28px] hidden lg:block">
            <h3 className="text-[20px] font-semibold leading-[30px] text-ink">
              Subscribe To Our Newsletter
            </h3>

            {newsletterSubmitted ? (
              <p className="mt-[24px] text-[14px] font-semibold text-[#2C3078]">
                Submitted! Thanks for subscribing — we&apos;ll be in touch.
              </p>
            ) : (
              <form onSubmit={handleNewsletterSubmit} noValidate>
                <div className="mt-[24px]">
                  <label className="block text-[14px] text-ink">
                    Your Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newsletterName}
                    onChange={(e) => setNewsletterName(e.target.value)}
                    placeholder="Your first name"
                    className="mt-[8px] w-full border-b border-ink pb-[10px] text-[14px] outline-none placeholder:text-[#B5B5B5]"
                  />
                </div>

                <div className="mt-[22px]">
                  <label className="block text-[14px] text-ink">
                    Email ID<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Your Email ID"
                    className="mt-[8px] w-full border-b border-ink pb-[10px] text-[14px] outline-none placeholder:text-[#B5B5B5]"
                  />
                </div>

                <div className="mt-[22px] flex items-start gap-[12px]">
                  <input
                    type="checkbox"
                    checked={newsletterAgree}
                    onChange={(e) => setNewsletterAgree(e.target.checked)}
                    className="mt-[2px] h-[18px] w-[18px] accent-[#2C3078]"
                  />
                  <p className="text-[13px] leading-[20px] text-ink">
                    I agree to receive news, updates and more from TravelOStyle
                  </p>
                </div>

                {newsletterError && (
                  <p className="mt-[10px] text-[12px] text-red-600">{newsletterError}</p>
                )}

                <button
                  type="submit"
                  className="mt-6 w-auto h-[42px] rounded-full bg-[#2C3078] px-6 text-[14px] text-white"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}