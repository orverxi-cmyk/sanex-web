"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";

export function HomeSlider() {
  const db = useFirestore();
  const sliderRef = React.useMemo(() => (db ? doc(db, "settings", "slider") : null), [db]);
  const { data: sliderData, loading } = useDoc(sliderRef);

  const defaultItems = [
    { 
      title: "Liquid Waste Collection", 
      description: "<p>Modern vacuum trucks serving schools, hospitals, and hotels across Rwanda. We ensure efficient and hygienic collection processes tailored to your needs.</p>", 
      imageUrl: "https://picsum.photos/seed/sanexslide1/1200/600",
      width: 1200,
      height: 600,
      link: "/services",
      buttonText: "Our Solutions"
    },
    { 
      title: "Clean Water Reuse", 
      description: "<p>Advanced DWTS systems using activated sludge technology for irrigation and flushing. Transform your waste into a sustainable resource for the future.</p>", 
      imageUrl: "https://picsum.photos/seed/sanexslide2/1200/600",
      width: 1200,
      height: 600,
      link: "/articles",
      buttonText: "Environmental Impact"
    }
  ];

  const items = sliderData?.items || defaultItems;

  const isVideo = (url: string) => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext)) || (url.includes('firebasestorage') && url.toLowerCase().includes('.mp4'));
  };

  if (loading) return (
    <div className="h-[200px] flex items-center justify-center bg-muted/20">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );

  return (
    <section className="py-2.5 bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <Carousel className="w-full relative group" opts={{ loop: true }}>
          <CarouselContent>
            {items.map((slide: any, i: number) => (
              <CarouselItem key={i} className="h-full">
                <div className="grid grid-cols-1 lg:grid-cols-4 rounded-xl overflow-hidden border bg-white shadow-lg min-h-0 lg:h-[500px]">
                  <div className="relative w-full h-[200px] lg:h-full lg:col-span-3 bg-muted border-b lg:border-b-0 lg:border-r border-primary/10">
                    {slide.imageUrl && isVideo(slide.imageUrl) ? (
                      <video 
                        src={slide.imageUrl} 
                        controls
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : slide.imageUrl ? (
                      <Image
                        src={slide.imageUrl}
                        alt={slide.title || "Slide media"}
                        fill
                        className="object-cover"
                        priority={i === 0}
                      />
                    ) : (
                      <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground text-[10px] uppercase font-bold">
                        Media Pending
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-center p-5 lg:p-8 space-y-4 lg:col-span-1 bg-primary text-black">
                    <div className="space-y-2">
                      <h2 className="text-lg lg:text-2xl font-bold font-headline text-black tracking-tight leading-tight">
                        {slide.title}
                      </h2>
                      <div 
                        className="text-black text-[11px] lg:text-xs leading-relaxed font-medium line-clamp-4 lg:line-clamp-none prose prose-sm max-w-none prose-p:leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: slide.description }}
                      />
                    </div>
                    <div className="pt-1">
                      <Button asChild className="w-full rounded-full bg-black text-primary font-bold uppercase tracking-widest hover:bg-black/90 gap-2 h-9 lg:h-10 px-6 text-[9px]">
                        <Link href={slide.link || "#"}>
                          {slide.buttonText || "Learn More"} <ArrowRight className="h-3.5 w-3.5 text-primary" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden lg:block absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <CarouselPrevious className="relative left-0 h-9 w-9 bg-background/80 hover:bg-primary border-primary text-foreground" />
          </div>
          <div className="hidden lg:block absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <CarouselNext className="relative right-0 h-9 w-9 bg-background/80 hover:bg-primary border-primary text-foreground" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
