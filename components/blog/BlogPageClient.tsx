"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeIn, slideUp } from "@/lib/animations";
import BlogCard from "@/components/blog/BlogCard";
import BlogFilter from "@/components/blog/BlogFilter";
import { BlogPost } from "@/lib/types";

interface BlogPageClientProps {
  initialPosts: BlogPost[];
}

export default function BlogPageClient({ initialPosts }: BlogPageClientProps) {
  const [filteredPosts, setFilteredPosts] = useState(initialPosts);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn()}
        className="max-w-3xl mb-12"
      >
        <motion.h1 
          className="text-4xl font-bold mb-4"
          variants={slideUp(0.1)}
        >
          Technical Blog
        </motion.h1>
        <motion.p 
          className="text-xl text-muted-foreground"
          variants={slideUp(0.2)}
        >
          Articles and insights about iOS development, Swift, and mobile app design.
        </motion.p>
      </motion.div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn(0.3)}
      >
        <BlogFilter posts={initialPosts} onFilter={setFilteredPosts} />

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No matching articles found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}