import { API_BASE_URL, buildFileUrl } from "@/lib/config";
import { slugify } from "@/lib/slugify";

const DETAIL_INCLUDE =
  "field_banner_image.field_media_image,field_gallery_images.field_media_image,field_categories";

export function getBlogSlug(item) {
  const alias = (item.attributes?.path?.alias || "").replace(/^\/+/, "");
  return alias || slugify(item.attributes?.title || "");
}

// Fetches every blog_detail node with the includes needed for the detail
// page and recommended-blogs sidebar, so callers share one request shape
// instead of each re-declaring the same `include` string.
export async function getAllBlogs() {
  const res = await fetch(
    `${API_BASE_URL}/jsonapi/node/blog_detail?filter[status][value]=1&include=${DETAIL_INCLUDE}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    console.error("Failed to fetch blog_detail collection");
    return { data: [], included: [] };
  }

  const { data = [], included = [] } = await res.json();
  return { data, included };
}

export function findBlogBySlug(blogs, slug) {
  return blogs.find((item) => getBlogSlug(item) === slug) || null;
}

// Derives Previous/Next in Drupal publish order (oldest -> newest by
// `created`), matching the order the two blog-detail routes previously
// duplicated independently.
export function getAdjacentPosts(blogs, currentId) {
  const sorted = [...blogs].sort(
    (a, b) => new Date(a.attributes.created).getTime() - new Date(b.attributes.created).getTime(),
  );
  const currentIndex = sorted.findIndex((item) => item.id === currentId);

  const previousBlog = currentIndex > 0 ? sorted[currentIndex - 1] : null;
  const nextBlog =
    currentIndex >= 0 && currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null;

  return {
    previousPost: previousBlog
      ? { title: previousBlog.attributes.title, slug: getBlogSlug(previousBlog) }
      : null,
    nextPost: nextBlog
      ? { title: nextBlog.attributes.title, slug: getBlogSlug(nextBlog) }
      : null,
  };
}

/**
 * @param {any} entity
 * @param {any[]} included
 * @param {string} fieldName
 * @param {string | null} [fallback] image used when the entity has none
 * @returns {string | null}
 */
export function resolveBlogImage(entity, included, fieldName, fallback = null) {
  const mediaId = entity.relationships?.[fieldName]?.data?.id;
  const media = included.find((item) => item.type === "media--image" && item.id === mediaId);
  const fileId = media?.relationships?.field_media_image?.data?.id;
  const file = included.find((item) => item.type === "file--file" && item.id === fileId);

  return buildFileUrl(file?.attributes?.uri?.url) || fallback;
}

export function resolveBlogCategories(blog, included) {
  const refs = blog.relationships?.field_categories?.data || [];
  return refs
    .map((ref) => included.find((item) => item.type === "taxonomy_term--categories" && item.id === ref.id))
    .filter(Boolean);
}
