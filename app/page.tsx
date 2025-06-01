import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import FeaturedApps from "@/components/home/FeaturedApps";
import BlogPreview from "@/components/home/BlogPreview";
import { apps, blogPosts } from "@/lib/data";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <FeaturedApps apps={apps} />
      <BlogPreview posts={blogPosts} />
    </main>
  );
}