
"use client";

import React from "react";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { Activity, Loader2 } from "lucide-react";

export function VideoHighlight() {
  const db = useFirestore();
  const { data: videoData, loading } = useDoc(db ? doc(db, "settings", "video") : null);

  const content = {
    title: videoData?.title || "SANEX in Action",
    description: videoData?.description || "Watch our specialized vacuum trucks and decentralized treatment systems providing essential sanitation services across Rwanda.",
    videoUrl: videoData?.videoUrl || ""
  };

  if (loading) return null;
  if (!content.videoUrl) return null;

  const isYouTube = content.videoUrl.includes("youtube.com") || content.videoUrl.includes("youtu.be");

  return (
    <section className="py-5 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-5 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-widest">
            <Activity className="h-3 w-3" /> Operational Highlights
          </div>
          <h2 className="text-2xl lg:text-4xl font-bold font-headline">{content.title}</h2>
          <p className="text-sm text-muted-foreground max-w-2xl">{content.description}</p>
        </div>

        <div className="max-w-4xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-black relative">
          {isYouTube ? (
            <iframe
              src={content.videoUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <video 
              src={content.videoUrl} 
              controls 
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>
    </section>
  );
}
