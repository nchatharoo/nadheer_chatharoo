"use client";

import { motion } from "framer-motion";
import { fadeIn, slideUp, staggerContainer } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import { BlogPost } from "@/lib/data";
import Image from "next/image";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface BlogPreviewProps {
  posts: BlogPost[];
}

export default function BlogPreview({ posts }: BlogPreviewProps) {
  // Take only the latest 3 posts
  const latestPosts = posts.slice(0, 3);

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn()}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            variants={slideUp(0.1)}
          >
            Latest Articles
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground"
            variants={slideUp(0.2)}
          >
            Technical insights, development tips, and industry trends from my experiences
            in iOS development.
          </motion.p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer(0.1)}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {latestPosts.map((post, index) => (
            <motion.div
              key={post.id}
              variants={fadeIn(0.2 + index * 0.1)}
              className="flex flex-col h-full"
            >
              <Card className="h-full overflow-hidden hover:shadow-lg transition-all group">
                <div className="relative">
                  <AspectRatio ratio={16 / 9}>
                    <Image 
                      src={post.coverImage} 
                      alt={post.title}
                      fill
                      className="object-cover transition-all duration-500 group-hover:scale-105"
                    />
                  </AspectRatio>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <Calendar className="mr-2 h-4 w-4" />
                    {format(new Date(post.date), 'MMMM d, yyyy')}
                    <span className="mx-2">•</span>
                    {post.readingTime}
                  </div>
                  <h3 className="font-semibold text-xl mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button asChild variant="outline" className="w-full group">
                    <Link href={`/blog/${post.slug}`}>
                      Read Article
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn(0.6)}
          className="text-center mt-12"
        >
          <Button asChild size="lg">
            <Link href="/blog">
              View All Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}