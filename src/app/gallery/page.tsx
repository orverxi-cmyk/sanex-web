
"use client";

import React from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import Image from "next/image";
import { Loader2, Camera } from "lucide-react";

export default function GalleryPage() {
  const db = useFirestore();
  const galleryQuery = React.useMemo(() => {
    if (!db) return null;
    return query(collection(db, "gallery"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: photos, loading } = useCollection(galleryQuery);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-5 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-5 space-y-2">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Camera className="h-5 w-5" />
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold font-headline">Service Gallery</h1>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Visual journey through our nationwide liquid waste management operations.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : photos && photos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {photos.map((photo) => (
                <div 
                  key={photo.id} 
                  className="group relative rounded-xl overflow-hidden bg-muted shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center p-2"
                >
                  {photo.imageUrl && (
                    <Image
                      src={photo.imageUrl}
                      alt={photo.description || "Gallery photo"}
                      width={photo.width || 800}
                      height={photo.height || 600}
                      className="object-contain transition-transform duration-500 group-hover:scale-105 rounded-lg h-auto w-full"
                    />
                  )}
                  <div className="absolute inset-x-2 bottom-2 bg-black/80 p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white font-medium text-xs">
                      {photo.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 opacity-50">
              <p className="text-base">No photos uploaded yet.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
