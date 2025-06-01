import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { AnimatedBlogPost } from "@/components/blog/AnimatedBlogPost";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug
  }));
}

export default async function BlogPostPage({
  params
}: {
  params: { slug: string }
}) {
  // Get post data on the server
  const post = await getPostBySlug(params.slug);
  
  // If post not found, return 404
  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <article className="max-w-3xl mx-auto">
        <AnimatedBlogPost post={post} />
      </article>
    </div>
  );
}