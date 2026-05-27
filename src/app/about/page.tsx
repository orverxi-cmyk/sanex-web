"use client";

import React from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { MilestoneTracker } from "@/components/sections/MilestoneTracker";
import { Highlights } from "@/components/sections/Highlights";
import { RegionalPortal } from "@/components/sections/RegionalPortal";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col font-arial">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-primary py-2.5">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-[16px] font-bold text-black uppercase tracking-widest">About SANEX</h1>
            <p className="mt-1 text-black/80 max-w-2xl mx-auto font-bold text-[15px]">
              Leading the way in sustainable liquid waste management in Rwanda since 2017.
            </p>
          </div>
        </div>
        <MilestoneTracker />
        <Highlights />
        <RegionalPortal />
      </main>
      <Footer />
    </div>
  );
}
