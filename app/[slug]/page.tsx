import { notFound } from "next/navigation";
import SearchBar from "@/components/HomePage/FindYourJourney/SearchBar";
import Footer from "@/components/Footer";
import { API_BASE_URL } from "@/lib/config";
import DynamicPolicyPage from "@/components/DynamicPolicyPage";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface PageNode {
  attributes?: {
    title?: string;
    drupal_internal__nid?: number;
    path?: { alias?: string };
    body?: { value?: string };
  };
}

export default async function PolicyDetails({ params }: PageProps) {
  const { slug } = await params;

  let res: Response | null = null;
  try {
    res = await fetch(`${API_BASE_URL}/jsonapi/node/page?filter[status][value]=1`, {
      cache: "no-store",
    });
  } catch (error) {
    console.error("Fetch error:", error);
  }

  if (!res || !res.ok) {
    notFound();
  }

  const data = await res.json();

  const nodes = data?.data || [];

  const matchedNode = nodes.find((node: PageNode) => {
    // Drupal mein path alias check karne ke kai tareeqe hote hain
    const alias =
      node.attributes?.path?.alias || node.attributes?.drupal_internal__nid;
    return (
      alias === `/${slug}` ||
      alias === slug ||
      node.attributes?.title?.toLowerCase().includes(slug.replace(/-/g, " "))
    );
  });

  if (!matchedNode) {
    notFound();
  }

  const title = matchedNode.attributes?.title;
  const bodyHtml = matchedNode.attributes?.body?.value || "";

  return (
    <div>
      <SearchBar />
      <DynamicPolicyPage title={title} description={bodyHtml} />
      <Footer />
    </div>
  );
}
