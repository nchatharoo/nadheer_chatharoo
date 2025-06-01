"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { fadeIn, slideUp } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { apps } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import AppGallery from "@/components/apps/AppGallery";
import AppFeatures from "@/components/apps/AppFeatures";
import AppStats from "@/components/apps/AppStats";

export default function AppDetailPage() {
  const { slug } = useParams();
  
  // Find the app by slug
  const app = apps.find(app => app.slug === slug);
  
  // If app not found, return 404
  if (!app) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn()}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-xl overflow-hidden relative">
            <Image 
              src={app.icon} 
              alt={`${app.title} icon`}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <motion.h1 
              className="text-3xl md:text-4xl font-bold"
              variants={slideUp(0.1)}
            >
              {app.title}
            </motion.h1>
          </div>
        </div>
        
        <motion.div 
          className="mb-8"
          variants={slideUp(0.2)}
        >
          <p className="text-xl text-muted-foreground">
            {app.description}
          </p>
        </motion.div>
        
        <motion.div 
          className="mb-8"
          variants={slideUp(0.3)}
        >
          <Button asChild size="lg">
            <Link href={app.appStoreLink} target="_blank" rel="noopener noreferrer">
              View on App Store
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
        
        <motion.div 
          className="mb-12"
          variants={slideUp(0.4)}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Screenshots</h2>
          <AppGallery screenshots={app.screenshots} title={app.title} />
        </motion.div>
        
        <AppFeatures app={app} />
        
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
            Technologies
          </motion.h2>
          
          <div className="flex flex-wrap gap-2">
            {app.technologies.map(tech => (
              <Badge key={tech} variant="secondary" className="text-base py-1.5 px-3">
                {tech}
              </Badge>
            ))}
          </div>
        </motion.div>
        
        <AppStats 
          downloads={app.stats.downloads}
          rating={app.stats.rating}
          reviews={app.stats.reviews}
        />
      </motion.div>
    </div>
  );
}