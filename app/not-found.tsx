"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn, slideUp } from "@/lib/animations";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center justify-center text-center">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn()}
        className="max-w-md"
      >
        <motion.div 
          className="text-9xl font-bold text-primary/20 mb-4"
          variants={slideUp(0.1)}
        >
          404
        </motion.div>
        
        <motion.h1 
          className="text-4xl font-bold mb-4"
          variants={slideUp(0.2)}
        >
          Page Not Found
        </motion.h1>
        
        <motion.p 
          className="text-xl text-muted-foreground mb-8"
          variants={slideUp(0.3)}
        >
          Sorry, the page you are looking for doesn't exist or has been moved.
        </motion.p>
        
        <motion.div variants={slideUp(0.4)}>
          <Button asChild size="lg">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}