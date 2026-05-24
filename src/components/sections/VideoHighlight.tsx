
"use client";

import React from "react";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { Play, Activity } from "lucide-react";

export function VideoHighlight() {
  const db = useFirestore();
  const settingsRef = db ? doc(db, "settings", "general") : null;
  const { data: settings, loading } = useDoc(settingsRef);

  if (loading || !settings?.heroVideoUrl) return null;

  return (
    <section className="py-24 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-widest">
            <Activity className="h-3 w-3" /> Operational Highlights
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold font-headline">SANEX in Action</h2>
          <p className="text-muted-foreground max-w-2xl">
            Watch our specialized vacuum trucks and decentralized treatment systems providing essential sanitation services across Rwanda.
          </p>
        </div>

        <div className="max-w-5xl mx-auto aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-black relative group">
          <iframe
            src={settings.heroVideoUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
}
