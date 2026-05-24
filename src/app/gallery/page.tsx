
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
      <main className="flex-grow py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
              <Camera className="h-6 w-6" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold font-headline">Service Gallery</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A visual journey through our nationwide liquid waste management operations and sustainable sanitation projects.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : photos && photos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {photos.map((photo) => (
                <div 
                  key={photo.id} 
                  className="group relative rounded-2xl overflow-hidden bg-muted aspect-[4/3] shadow-lg hover:shadow-2xl transition-all duration-500"
                >
                  <Image
                    src={photo.imageUrl}
                    alt={photo.description}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                    <p className="text-white font-medium text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      {photo.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 opacity-50">
              <p className="text-lg">No photos uploaded yet.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
