"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { fadeIn, slideUp, slideInRight } from "@/lib/animations";

export default function Hero() {
  return (
    <div className="min-h-[90vh] flex items-center relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn()}
            className="space-y-6"
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
              variants={slideUp(0.1)}
            >
              Creating exceptional 
              <span className="text-primary"> iOS experiences</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-muted-foreground max-w-lg"
              variants={slideUp(0.2)}
            >
              Senior iOS developer specializing in building beautiful, 
              performant applications with Swift and SwiftUI.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 pt-4"
              variants={slideUp(0.3)}
            >
              <Button asChild size="lg">
                <Link href="/apps">
                  View My Work
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">
                  Get In Touch
                </Link>
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideInRight(0.3)}
            className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-xl backdrop-blur-sm">
              <div className="absolute inset-0 grid grid-cols-2 gap-4 p-8">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: 0.4 + (i * 0.1),
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    className="bg-background/80 backdrop-blur-md rounded-lg p-4 shadow-lg flex items-center justify-center"
                  >
                    <div className="w-full aspect-[9/16] bg-muted rounded-md relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-primary/20"></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="absolute -bottom-1/2 -right-1/4 w-[80%] h-[80%] rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute -top-1/4 -left-1/4 w-[50%] h-[50%] rounded-full bg-secondary/5 blur-3xl"></div>
    </div>
  );
}