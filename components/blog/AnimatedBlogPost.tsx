'use client';

import { motion } from "framer-motion";
import { fadeIn, slideUp } from "@/lib/animations";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Markdown from "markdown-to-jsx";
import { BlogPost } from "@/lib/types";

interface AnimatedBlogPostProps {
  post: BlogPost;
}

export function AnimatedBlogPost({ post }: AnimatedBlogPostProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn()}
    >
      <div className="mb-8">
        <motion.h1 
          className="text-3xl md:text-4xl font-bold mb-4"
          variants={slideUp(0.1)}
        >
          {post.title}
        </motion.h1>
        
        <motion.div 
          className="flex flex-wrap items-center text-muted-foreground gap-4 mb-6"
          variants={slideUp(0.2)}
        >
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            {format(new Date(post.date), 'MMMM d, yyyy')}
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            {post.readingTime}
          </div>
        </motion.div>
        
        <motion.div 
          className="flex flex-wrap gap-2 mb-8"
          variants={slideUp(0.3)}
        >
          {post.tags.map(tag => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </motion.div>
      </div>
      
      <motion.div 
        className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden mb-8"
        variants={fadeIn(0.4)}
      >
        <Image 
          src={post.coverImage} 
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
      </motion.div>
      
      <motion.div 
        variants={fadeIn(0.5)}
        className={cn(
          "prose prose-gray dark:prose-invert max-w-none",
          "prose-headings:font-bold prose-headings:tracking-tight",
          "prose-p:leading-relaxed prose-p:text-base",
          "prose-pre:bg-muted prose-pre:border prose-pre:border-border",
          "prose-code:text-primary-foreground prose-code:bg-primary/10 prose-code:rounded prose-code:px-1",
          "prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
        )}
      >
        <Markdown>{post.content}</Markdown>
      </motion.div>
    </motion.div>
  );
}