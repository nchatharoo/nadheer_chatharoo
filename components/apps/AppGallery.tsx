"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";

interface AppGalleryProps {
  screenshots: string[];
  title: string;
}

export default function AppGallery({ screenshots, title }: AppGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [emblaRef, setEmblaRef] = useState<any>(null);

  const scrollPrev = () => {
    if (emblaRef) emblaRef.scrollPrev();
  };

  const scrollNext = () => {
    if (emblaRef) emblaRef.scrollNext();
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeIn()}
      className="relative"
    >
      <Swiper
        getRef={(ref) => setEmblaRef(ref)}
        onSlideChange={(ev) => setActiveIndex(ev.detail.index)}
        className="w-full"
        options={{ loop: true }}
      >
        {screenshots.map((screenshot, index) => (
          <SwiperSlide key={index}>
            <Dialog>
              <DialogTrigger asChild>
                <div className="cursor-pointer p-2">
                  <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <AspectRatio ratio={9/16} className="bg-muted overflow-hidden">
                      <Image 
                        src={screenshot} 
                        alt={`${title} screenshot ${index + 1}`}
                        fill
                        className="object-cover transition-transform hover:scale-105 duration-300"
                      />
                    </AspectRatio>
                  </Card>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
                <div className="relative aspect-[9/16] w-full max-h-[80vh] bg-transparent">
                  <Image 
                    src={screenshot} 
                    alt={`${title} screenshot ${index + 1}`}
                    fill
                    className="object-contain"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex justify-center mt-6 gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={scrollPrev}
          aria-label="Previous screenshot"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex gap-1 items-center px-2">
          {screenshots.map((_, index) => (
            <div 
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? "w-6 bg-primary" 
                  : "w-1.5 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={scrollNext}
          aria-label="Next screenshot"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-4">
        Tap on an image to view in full size
      </p>
    </motion.div>
  );
}