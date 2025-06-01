"use client";

import { motion } from "framer-motion";
import { fadeIn, slideUp } from "@/lib/animations";
import AppCard from "@/components/apps/AppCard";
import { apps } from "@/lib/data";

export default function AppsPage() {
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
          iOS Applications
        </motion.h1>
        <motion.p 
          className="text-xl text-muted-foreground"
          variants={slideUp(0.2)}
        >
          A showcase of my published iOS applications available on the App Store.
          Each app is designed with user experience and performance in mind.
        </motion.p>
      </motion.div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn(0.3)}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {apps.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </motion.div>
    </div>
  );
}