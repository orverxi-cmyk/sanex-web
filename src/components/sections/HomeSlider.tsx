
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
  const { data: sliderData, loading } = useDoc(db ? doc(db, "settings", "slider") : null);

  const defaultItems = [
    { 
      title: "Liquid Waste Collection", 
      description: "Modern vacuum trucks serving schools, hospitals, and hotels across Rwanda. We ensure efficient and hygienic collection processes tailored to your needs.", 
      imageUrl: "https://picsum.photos/seed/sanexslide1/1200/600",
      link: "/services",
      buttonText: "Our Solutions"
    },
    { 
      title: "Clean Water Reuse", 
      description: "Advanced DWTS systems using activated sludge technology for irrigation and flushing. Transform your waste into a sustainable resource for the future.", 
      imageUrl: "https://picsum.photos/seed/sanexslide2/1200/600",
      link: "/articles",
      buttonText: "Environmental Impact"
    }
  ];

  const items = sliderData?.items || defaultItems;

  if (loading) return (
    <div className="h-[400px] flex items-center justify-center bg-muted/20">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  return (
    <section className="py-5 bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <Carousel className="w-full relative group" opts={{ loop: true }}>
          <CarouselContent>
            {items.map((slide: any, i: number) => (
              <CarouselItem key={i}>
                <div className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden border bg-white shadow-xl min-h-[400px] lg:min-h-[500px]">
                  {/* Media Area - Now on the Left */}
                  <div className="relative h-[300px] lg:h-auto w-full bg-muted">
                    <Image
                      src={slide.imageUrl}
                      alt={slide.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Text Content Area - Now on the Right */}
                  <div className="flex flex-col justify-center p-8 lg:p-16 space-y-6">
                    <div className="space-y-4">
                      <h2 className="text-3xl lg:text-5xl font-bold font-headline text-primary tracking-tight leading-tight">
                        {slide.title}
                      </h2>
                      <p className="text-muted-foreground text-sm lg:text-lg max-w-xl leading-relaxed">
                        {slide.description}
                      </p>
                    </div>
                    <div className="pt-4">
                      <Button asChild size="lg" className="rounded-full bg-secondary text-primary hover:bg-secondary/90 gap-2 h-12 px-8">
                        <Link href={slide.link || "#"}>
                          {slide.buttonText || "Learn More"} <ArrowRight className="h-5 w-5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <CarouselPrevious className="relative left-0 bg-background/80 hover:bg-primary border-primary text-foreground" />
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <CarouselNext className="relative right-0 bg-background/80 hover:bg-primary border-primary text-foreground" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
