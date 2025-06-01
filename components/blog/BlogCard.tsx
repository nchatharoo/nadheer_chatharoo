import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { BlogPost } from "@/lib/data";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all group h-full flex flex-col">
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
      <CardContent className="p-6 flex-grow">
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
        <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, 4).map(tag => (
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
  );
}