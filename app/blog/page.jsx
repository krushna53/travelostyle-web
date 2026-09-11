import Footer from "@/components/Footer";
import SearchBar from "@/components/JourneyDetailPage/SearchBar";
import Blog from "@/components/BlogListing/blog";

export default function BlogListingPage() {
  return (
    <>
      <SearchBar showAllJourneys={true} />

      <div className="w-full border-b-2 border-[#1A1A1A]" />

<Blog/>
      <Footer />
    </>
  )
}