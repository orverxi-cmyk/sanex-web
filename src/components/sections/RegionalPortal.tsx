"use client";

import React from "react";
import { MapPin } from "lucide-react";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";

export function RegionalPortal() {
  const db = useFirestore();
  const { data: regionalData, loading } = useDoc(db ? doc(db, "settings", "regional") : null);

  const defaultRegions = [
    { name: "Kigali", status: "Operational Headquarters", capacity: "Full Fleet" },
    { name: "Musanze", status: "Strategic Hub", capacity: "Service Center" },
    { name: "Huye", status: "Planned Expansion", capacity: "Regional Office" }
  ];

  const content = {
    title: regionalData?.title || "Our Presence",
    description: regionalData?.description || "Establishing operational offices in key towns across Rwanda, ensuring reliable sanitation services are always within reach.",
    items: regionalData?.items?.length ? regionalData.items : defaultRegions
  };

  if (loading) return null;

  return (
    <section className="py-2.5 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-5 items-center">
          <div className="lg:w-1/3 space-y-3">
            <h2 className="text-2xl lg:text-3xl font-bold font-headline leading-tight">{content.title}</h2>
            <p className="text-[11px] text-muted-foreground">
              {content.description}
            </p>
            <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/20">
              <div className="flex gap-2.5 items-center">
                <div className="h-7 w-7 rounded-full bg-secondary/20 flex items-center justify-center text-primary">
                  <MapPin className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold">Rwanda Nationwide</div>
                  <div className="text-[10px] text-muted-foreground">Urban & Rural Connectivity</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {content.items.map((region: any, i: number) => (
              <div key={i} className="group p-4 rounded-xl bg-white border shadow-sm hover:border-primary/50 transition-all">
                <div className="flex justify-between items-start mb-1.5">
                  <h3 className="text-base font-bold font-headline group-hover:text-primary transition-colors">{region.name}</h3>
                  <div className="px-1 py-0.5 rounded text-[7px] font-bold uppercase tracking-wider bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary">
                    ACTIVE
                  </div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                    <div className="h-1 w-1 rounded-full bg-secondary" />
                    {region.status}
                  </div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                    <div className="h-1 w-1 rounded-full bg-primary" />
                    {region.capacity}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}