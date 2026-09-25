import { API_BASE_URL } from "@/lib/config";
import { slugify } from "@/lib/slugify";

// Shared by app/sitemap.ts (the machine-readable /sitemap.xml) and
// app/site-map/page.tsx (the human-readable "Site Map" footer link) so
// both stay in sync with one fetch + URL-resolution implementation.

async function fetchCollection(resource) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/jsonapi/node/${resource}?filter[status][value]=1&fields[node--${resource}]=title,path,changed,created`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error(`sitemap: failed to fetch node/${resource}`, err);
    return [];
  }
}

function nodeUrl(node, basePath) {
  const alias = node.attributes?.path?.alias;
  if (alias) return alias.startsWith("/") ? alias : `/${alias}`;
  return `${basePath}/${slugify(node.attributes?.title || "")}`;
}

function lastMod(node) {
  const raw = node.attributes?.changed || node.attributes?.created;
  return raw ? new Date(raw) : new Date();
}

// Returns { journeys, blogs, pages }, each an array of
// { title, url, lastModified } sorted by title.
export async function getSitemapContent() {
  const [journeyNodes, blogNodes, pageNodes] = await Promise.all([
    fetchCollection("journey"),
    fetchCollection("blog_detail"),
    fetchCollection("page"),
  ]);

  const toEntry = (basePath) => (node) => ({
    title: node.attributes?.title || "Untitled",
    url: nodeUrl(node, basePath),
    lastModified: lastMod(node),
  });

  const byTitle = (a, b) => a.title.localeCompare(b.title);

  return {
    journeys: journeyNodes.map(toEntry("/journey")).sort(byTitle),
    blogs: blogNodes.map(toEntry("/blog")).sort(byTitle),
    pages: pageNodes.map(toEntry("")).sort(byTitle),
  };
}
