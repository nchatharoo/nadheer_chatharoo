"use client";

import { motion } from "framer-motion";
import { fadeIn, slideUp, staggerContainer } from "@/lib/animations";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { App } from "@/lib/data";
import dynamic from "next/dynamic";

// Dynamically import icons
const icons: Record<string, LucideIcon> = {
  EarIcon: dynamic(() => import("lucide-react").then((mod) => mod.Ear)),
  WaveformIcon: dynamic(() => import("lucide-react").then((mod) => mod.Waveform)),
  BluetoothIcon: dynamic(() => import("lucide-react").then((mod) => mod.Bluetooth)),
  BookOpenIcon: dynamic(() => import("lucide-react").then((mod) => mod.BookOpen)),
  HeadphonesIcon: dynamic(() => import("lucide-react").then((mod) => mod.Headphones)),
  MoonIcon: dynamic(() => import("lucide-react").then((mod) => mod.Moon)),
  FileIcon: dynamic(() => import("lucide-react").then((mod) => mod.File)),
  LayoutIcon: dynamic(() => import("lucide-react").then((mod) => mod.Layout)),
  LibraryIcon: dynamic(() => import("lucide-react").then((mod) => mod.Library)),
};

interface AppFeaturesProps {
  app: App;
}

export default function AppFeatures({ app }: AppFeaturesProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer(0.1)}
      className="mt-12"
    >
      <motion.h2 
        className="text-2xl md:text-3xl font-bold mb-6"
        variants={slideUp(0.1)}
      >
        Key Features
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {app.features.map((feature, index) => {
          const IconComponent = icons[feature.icon] || icons.FileIcon;
          
          return (
            <motion.div
              key={feature.title}
              variants={fadeIn(0.2 + index * 0.1)}
            >
              <Card className="h-full hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}