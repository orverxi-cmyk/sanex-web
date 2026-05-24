
"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Users, Building2, Landmark, GraduationCap, Bed } from "lucide-react";

export function PartnershipsDirectory() {
  const sectors = [
    { icon: <Building2 className="h-6 w-6" />, label: "Commercial Buildings", count: "45+" },
    { icon: <Landmark className="h-6 w-6" />, label: "Government Entities", count: "12+" },
    { icon: <Bed className="h-6 w-6" />, label: "Hotels & Tourism", count: "28+" },
    { icon: <GraduationCap className="h-6 w-6" />, label: "Schools & Colleges", count: "30+" }
  ];

  return (
    <section id="projects" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl lg:text-5xl font-bold font-headline">Sustainable Partnerships</h2>
          <p className="text-muted-foreground max-w-[800px] mx-auto text-lg">
            Proudly collaborating with over 114 government and private clients nationwide to build a cleaner future.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sectors.map((sector, i) => (
            <Card key={i} className="p-8 text-center flex flex-col items-center justify-center gap-4 border-none shadow-sm hover:shadow-md transition-shadow">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {sector.icon}
              </div>
              <div>
                <div className="text-3xl font-bold font-headline text-primary">{sector.count}</div>
                <div className="text-sm font-medium text-muted-foreground">{sector.label}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Client Logos placeholder gallery */}
        <div className="mt-16 pt-8 border-t">
          <div className="flex flex-wrap justify-center items-center gap-12 grayscale opacity-40">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="text-2xl font-bold italic font-headline">CLIENT LOGO</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
