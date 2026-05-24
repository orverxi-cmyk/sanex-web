
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { ArrowRight, Calendar, Loader2 } from "lucide-react";

export function Hero() {
  const db = useFirestore();
  const { data: heroData, loading } = useDoc(db ? doc(db, "settings", "hero") : null);

  // Fallback defaults
  const content = {
    badge: heroData?.badge || "Leading Sanitation Partner in Rwanda",
    title: heroData?.title || "Transforming",
    titleAccent: heroData?.titleAccent || "Waste Into Opportunity",
    description: heroData?.description || "Leading Liquid Waste Management Solutions in Rwanda. We protect public health and environmental integrity through advanced technology and nationwide coverage.",
    imageUrl: heroData?.imageUrl || "https://picsum.photos/seed/sanex1/1200/800",
    ctaText: heroData?.ctaText || "Book a Service",
    ctaLink: heroData?.ctaLink || "/book"
  };

  if (loading) return (
    <div className="h-[600px] flex items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  return (
    <section className="relative overflow-hidden pt-12 lg:pt-20 pb-24 lg:pb-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              {content.badge}
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold font-headline tracking-tighter leading-[1.1]">
              {content.title} <span className="text-primary">{content.titleAccent}</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-[600px] leading-relaxed">
              {content.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="h-14 px-8 text-lg rounded-full gap-2">
                <Link href={content.ctaLink}><Calendar className="h-5 w-5" /> {content.ctaText}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-primary text-primary hover:bg-primary/5">
                <Link href="/#about">Learn More About Us <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>

          <div className="relative animate-in fade-in slide-in-from-right duration-1000">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl rotate-2 bg-muted">
              <Image
                src={content.imageUrl}
                alt="Sanitation facility"
                width={800}
                height={600}
                className="object-cover"
              />
            </div>
            <div className="absolute -top-6 -right-6 w-full h-full bg-secondary/10 rounded-2xl -z-10 -rotate-3 border border-secondary/20" />
            <div className="absolute -bottom-10 -left-10 w-2/3 h-2/3 bg-primary/10 rounded-2xl -z-20 rotate-6 border border-primary/20" />
          </div>
        </div>
      </div>
    </section>
  );
}
