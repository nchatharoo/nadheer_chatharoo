"use client";

import { motion } from "framer-motion";
import { fadeIn, slideUp } from "@/lib/animations";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Star, MessageCircle } from "lucide-react";

interface AppStatsProps {
  downloads: string;
  rating: number;
  reviews: number;
}

export default function AppStats({ downloads, rating, reviews }: AppStatsProps) {
  // Generate an array of stars based on the rating
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i < Math.floor(rating);
    const partial = i === Math.floor(rating) && rating % 1 > 0;
    return { filled, partial };
  });

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeIn()}
      className="mt-12"
    >
      <motion.h2 
        className="text-2xl md:text-3xl font-bold mb-6"
        variants={slideUp(0.1)}
      >
        App Performance
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-all">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <div className="bg-primary/10 p-3 rounded-full text-primary mb-4">
              <Download className="h-6 w-6" />
            </div>
            <div className="text-3xl font-bold mb-1">{downloads}</div>
            <p className="text-muted-foreground">Downloads</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <div className="bg-primary/10 p-3 rounded-full text-primary mb-4">
              <Star className="h-6 w-6" />
            </div>
            <div className="text-3xl font-bold mb-1">{rating.toFixed(1)}</div>
            <div className="flex items-center justify-center mb-1">
              {stars.map((star, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${
                    star.filled 
                      ? 'text-yellow-500 fill-yellow-500' 
                      : star.partial 
                        ? 'text-yellow-500 fill-yellow-500 opacity-50' 
                        : 'text-muted-foreground'
                  }`} 
                />
              ))}
            </div>
            <p className="text-muted-foreground">Rating</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <div className="bg-primary/10 p-3 rounded-full text-primary mb-4">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div className="text-3xl font-bold mb-1">{reviews}</div>
            <p className="text-muted-foreground">User Reviews</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}