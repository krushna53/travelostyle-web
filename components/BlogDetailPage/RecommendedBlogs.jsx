import Image from "next/image";
import Link from "next/link";
import { getAllBlogs, getBlogSlug, resolveBlogImage } from "@/lib/blog";

export default async function RecommendedBlogs({ currentBlogId }) {
  const { data, included } = await getAllBlogs();

  const filteredBlogs = data.filter((item) => item.id !== currentBlogId);

  return (
    <>
      {filteredBlogs.slice(0, 3).map((blog) => {
        const imageUrl = resolveBlogImage(
          blog,
          included,
          "field_banner_image",
          "/recommended-blog.svg",
        );

        const categoryId = blog.relationships?.field_categories?.data?.[0]?.id;

        const category = included.find(
          (item) => item.type === "taxonomy_term--categories" && item.id === categoryId,
        );

        const categoryName = category?.attributes?.name || "Experiences";
        const slug = getBlogSlug(blog);

        return (
          <div
            key={blog.id}
            className="mt-5 flex flex-col overflow-hidden rounded-[10px] border-2 border-ink bg-[#FAFAFA]"
          >
            {/* Top */}
            <div className="flex items-center justify-between px-[14px] py-[12px]">
              <p className="text-[16px] font-semibold leading-[40px] tracking-[0.05em] text-[#000000]">
                {new Date(blog.attributes.created).toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }
                )}
              </p>

              <button className="flex h-[31px] items-center justify-center rounded-full border border-ink bg-white px-[16px] text-[16px] leading-none text-ink">
                {categoryName}
              </button>
            </div>

            {/* Image */}
            <div className="px-[14px]">
              <div className="relative w-full aspect-[524/296]">
                <Image
                  src={imageUrl}
                  alt="Recommended Blog"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Title */}
                <div className="min-h-[105px] px-[12px] pt-[12px]">
  <h4 className="font-[Nohemi] text-[21px] font-semibold leading-[32px] tracking-[0.05em] text-ink min-[768px]:text-[11px] min-[768px]:leading-[17px] min-[768px]:text-[#1A1A1A] min-[1024px]:text-[14px] min-[1024px]:leading-[21px] min-[1280px]:text-[15px] min-[1280px]:leading-[23px] min-[1366px]:text-[16px] min-[1366px]:leading-[24px] min-[1441px]:text-[16px] min-[1441px]:leading-[25px] min-[1500px]:text-[21px] min-[1500px]:leading-[32px]">
    {blog.attributes.title}
  </h4>
</div>

{/* Bottom */}
<div className="mt-[10px] px-[14px] pb-[12px]">
  <div className="border-t border-ink" />
  <Link
    href={`/blog/${slug}`}
    className="mt-[10px] flex items-center justify-between"
  >
    <span className="text-[16px] font-semibold leading-[40px] tracking-[0.05em] text-ink">
      READ MORE
    </span>
    <Image src="/ArrowUpRight.svg" alt="Arrow" width={24} height={24} />
  </Link>
            </div>
          </div>
        );
      })}
    </>
  );
}
