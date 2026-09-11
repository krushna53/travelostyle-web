import SearchBar from "@/components/JourneyDetailPage/SearchBar";
import Hero from "@/components/BlogDetailPage/Hero";
import BlogContent from "@/components/BlogDetailPage/BlogContent";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";
import {
  getAllBlogs,
  findBlogBySlug,
  getAdjacentPosts,
  resolveBlogImage,
  resolveBlogCategories,
  getBlogSlug,
} from "@/lib/blog";

export default async function BlogDetailBySlug({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: blogs, included } = await getAllBlogs();

  if (blogs.length === 0) {
    return (
      <div className="bg-[#FAFAFA] min-h-screen">
        <SearchBar />

        <div className="flex flex-col items-center justify-center py-24 text-center">
          <h2 className="font-[Nohemi] text-[28px] font-semibold tracking-[0.05em] text-ink">
            Coming Soon
          </h2>
          <p className="mt-3 max-w-[420px] text-[14px] text-[#4A4A4A]">
            We&apos;re working on new stories for The TOS Travel Journal.
            Check back soon.
          </p>
        </div>

        <Footer />
      </div>
    );
  }

  const blog = findBlogBySlug(blogs, slug);

  if (!blog) {
    notFound();
  }

  const { previousPost, nextPost } = getAdjacentPosts(blogs, blog.id);
  const categories = resolveBlogCategories(blog, included);
  const bannerImage = resolveBlogImage(
    blog,
    included,
    "field_banner_image",
    "/placeholder-image.svg",
  );

  const categoryRes = await fetch(
    `${API_BASE_URL}/jsonapi/taxonomy_term/categories`,
    { cache: "no-store" },
  );
  const { data: categoryData = [] } = await categoryRes.json();
  const allCategoryNames = categoryData.map((cat: any) => cat.attributes.name);

  const recommendedBlogs = blogs
    .filter((item: any) => item.id !== blog.id)
    .map((item: any) => {
      const cats = resolveBlogCategories(item, included).map(
        (cat: any) => cat.attributes.name,
      );
      return {
        id: item.id,
        title: item.attributes.title,
        dateLabel: new Date(item.attributes.created).toLocaleDateString(
          "en-US",
          { month: "long", day: "numeric", year: "numeric" },
        ),
        categoryName: cats[0] || "Experiences",
        categoryNames: cats,
        imageUrl: resolveBlogImage(
          item,
          included,
          "field_banner_image",
          "/recommended-blog.svg",
        ),
        slug: getBlogSlug(item),
      };
    });

  const galleryRefs = blog.relationships?.field_gallery_images?.data || [];
  const galleryImages = galleryRefs
    .map((ref: any) => {
      const media = included.find(
        (item: any) => item.type === "media--image" && item.id === ref.id,
      );
      return included.find(
        (item: any) =>
          item.type === "file--file" &&
          item.id === media?.relationships?.field_media_image?.data?.id,
      );
    })
    .filter(Boolean);

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <SearchBar showAllJourneys={true} />

      <div className="w-full border-b-2 border-[#1A1A1A]" />

      <Hero blog={blog} categories={categories} />

      <BlogContent
        blog={blog}
        categories={categories}
        allCategories={allCategoryNames}
        recommendedBlogs={recommendedBlogs}
        bannerImage={bannerImage}
        galleryImages={galleryImages}
        previousPost={previousPost}
        nextPost={nextPost}
      />

      <Footer />
    </div>
  );
}
