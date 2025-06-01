import { getAllPosts } from "@/lib/blog";
import BlogPageClient from "@/components/blog/BlogPageClient";

export default async function BlogPage() {
  const posts = await getAllPosts();
  
  return <BlogPageClient initialPosts={posts} />;
}