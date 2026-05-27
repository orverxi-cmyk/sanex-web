
"use client";

import React from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { MilestoneTracker } from "@/components/sections/MilestoneTracker";
import { Highlights } from "@/components/sections/Highlights";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-primary py-2.5">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl lg:text-5xl font-bold font-headline text-black">About SANEX</h1>
            <p className="mt-2 text-black/80 max-w-2xl mx-auto font-medium text-sm">
              Leading the way in sustainable liquid waste management in Rwanda since 2017.
            </p>
          </div>
        </div>
        <MilestoneTracker />
        <Highlights />
      </main>
      <Footer />
    </div>
  );
}
