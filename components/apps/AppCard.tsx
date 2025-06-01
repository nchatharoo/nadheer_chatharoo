import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";
import { App } from "@/lib/data";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";

interface AppCardProps {
  app: App;
}

export default function AppCard({ app }: AppCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all group h-full flex flex-col">
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
      <CardContent className="p-6 flex-grow">
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {app.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {app.technologies.slice(0, 3).map(tech => (
            <Badge key={tech} variant="outline">
              {tech}
            </Badge>
          ))}
          {app.technologies.length > 3 && (
            <Badge variant="outline">+{app.technologies.length - 3}</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
        <Button asChild variant="default" className="w-full sm:w-auto">
          <Link href={app.appStoreLink} target="_blank" rel="noopener noreferrer">
            App Store
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full sm:w-auto group">
          <Link href={`/apps/${app.slug}`}>
            Details
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}