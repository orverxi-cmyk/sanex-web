
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
      description: "Modern vacuum trucks serving schools, hospitals, and hotels across Rwanda.", 
      imageUrl: "https://picsum.photos/seed/sanexslide1/1200/600",
      link: "/#services",
      buttonText: "Our Solutions"
    },
    { 
      title: "Clean Water Reuse", 
      description: "Advanced DWTS systems using activated sludge technology for irrigation.", 
      imageUrl: "https://picsum.photos/seed/sanexslide2/1200/600",
      link: "/#impact",
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
                <div className="relative h-[400px] lg:h-[500px] w-full rounded-2xl overflow-hidden bg-black shadow-xl border">
                  <Image
                    src={slide.imageUrl}
                    alt={slide.title}
                    fill
                    className="object-cover opacity-60"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 lg:p-12 space-y-4">
                    <h2 className="text-3xl lg:text-6xl font-bold font-headline text-primary tracking-tight">
                      {slide.title}
                    </h2>
                    <p className="text-white text-sm lg:text-xl max-w-2xl font-medium leading-relaxed">
                      {slide.description}
                    </p>
                    <Button asChild size="lg" className="rounded-full bg-primary text-black hover:bg-primary/90 gap-2 h-12 px-8">
                      <Link href={slide.link || "#"}>
                        {slide.buttonText || "Learn More"} <ArrowRight className="h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <CarouselPrevious className="relative left-0 bg-white/10 border-white/20 text-white hover:bg-white/20" />
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <CarouselNext className="relative right-0 bg-white/10 border-white/20 text-white hover:bg-white/20" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
