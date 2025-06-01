"use client";

import { motion } from "framer-motion";
import { fadeIn, slideUp, staggerContainer } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { App } from "@/lib/data";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

interface FeaturedAppsProps {
  apps: App[];
}

export default function FeaturedApps({ apps }: FeaturedAppsProps) {
  return (
    <section className="py-20">
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
            Featured Apps
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground"
            variants={slideUp(0.2)}
          >
            Check out some of my latest iOS applications available on the App Store.
            Each app is crafted with attention to detail and user experience.
          </motion.p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer(0.1)}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {apps.map((app, index) => (
            <motion.div
              key={app.id}
              variants={fadeIn(0.2 + index * 0.1)}
              className="flex flex-col h-full"
            >
              <Card className="h-full overflow-hidden hover:shadow-lg transition-all group">
                <div className="relative">
                  <AspectRatio ratio={16 / 9}>
                    <Image 
                      src={app.screenshots[0]} 
                      alt={app.title}
                      fill
                      className="object-cover transition-all duration-500 group-hover:scale-105"
                    />
                  </AspectRatio>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden relative">
                        <Image 
                          src={app.icon} 
                          alt={`${app.title} icon`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-white drop-shadow-sm">{app.title}</h3>
                      </div>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className={cn(
                    "text-muted-foreground mb-4",
                    "line-clamp-3"
                  )}>
                    {app.description}
                  </p>
                  <div className="mt-auto pt-2">
                    <Button asChild variant="outline" className="w-full group">
                      <Link href={`/apps/${app.slug}`}>
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
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
            <Link href="/apps">
              View All Apps
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}