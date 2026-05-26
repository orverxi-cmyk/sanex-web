"use client";

import React from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Services } from "@/components/sections/Services";
import { RegionalPortal } from "@/components/sections/RegionalPortal";
import { VideoHighlight } from "@/components/sections/VideoHighlight";
import { Hero } from "@/components/sections/Hero";

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-primary py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl lg:text-6xl font-bold font-headline text-black">Our Solutions</h1>
            <p className="mt-4 text-black/80 max-w-2xl mx-auto font-medium">
              Professional, eco-friendly, and nationwide liquid waste management services.
            </p>
          </div>
        </div>
        <Hero />
        <Services />
        <VideoHighlight />
        <RegionalPortal />
      </main>
      <Footer />
    </div>
  );
}
