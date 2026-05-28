
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import Image from "next/image";
import { Loader2, Camera, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function GalleryPage() {
  const db = useFirestore();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const galleryQuery = React.useMemo(() => {
    if (!db) return null;
    return query(collection(db, "gallery"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: photos, loading } = useCollection(galleryQuery);

  const handlePrevious = useCallback(() => {
    if (photos && selectedIndex !== null) {
      setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : photos.length - 1));
    }
  }, [photos, selectedIndex]);

  const handleNext = useCallback(() => {
    if (photos && selectedIndex !== null) {
      setSelectedIndex((prev) => (prev !== null && prev < photos.length - 1 ? prev + 1 : 0));
    }
  }, [photos, selectedIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setSelectedIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, handlePrevious, handleNext]);

  return (
    <div className="min-h-screen flex flex-col font-arial">
      <Navbar />
      <main className="flex-grow py-5 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-5 space-y-2">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Camera className="h-5 w-5" />
            </div>
            <h1 className="text-[16px] font-bold text-black uppercase tracking-widest">Service Gallery</h1>
            <p className="text-[14px] font-normal text-muted-foreground max-w-2xl mx-auto">
              Visual journey through our nationwide liquid waste management operations.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : photos && photos.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {photos.map((photo, index) => (
                  <div 
                    key={photo.id} 
                    className="group relative rounded-xl overflow-hidden bg-muted shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center p-2 cursor-pointer"
                    onClick={() => setSelectedIndex(index)}
                  >
                    {photo.imageUrl ? (
                      <Image
                        src={photo.imageUrl}
                        alt={photo.description || "Gallery photo"}
                        width={photo.width || 800}
                        height={photo.height || 600}
                        className="object-contain transition-transform duration-500 group-hover:scale-105 rounded-lg h-auto w-full"
                      />
                    ) : (
                      <div className="aspect-video w-full bg-muted flex items-center justify-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        No Image
                      </div>
                    )}
                    <div className="absolute inset-x-2 bottom-2 bg-black/80 p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white font-medium text-xs">
                        {photo.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Dialog open={selectedIndex !== null} onOpenChange={(open) => !open && setSelectedIndex(null)}>
                <DialogContent className="max-w-[95vw] max-h-[90vh] p-0 border-none bg-black/90 flex items-center justify-center overflow-hidden">
                  {selectedIndex !== null && photos[selectedIndex] && (
                    <div className="relative w-full h-full flex items-center justify-center p-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
                        onClick={() => setSelectedIndex(null)}
                      >
                        <X className="h-6 w-6" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 z-50 text-white hover:bg-white/20 bg-black/20 rounded-full h-12 w-12"
                        onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
                      >
                        <ChevronLeft className="h-8 w-8" />
                      </Button>

                      <div className="relative w-full h-full flex flex-col items-center justify-center gap-4">
                        <div className="relative w-full flex-grow flex items-center justify-center">
                          <Image
                            src={photos[selectedIndex].imageUrl}
                            alt={photos[selectedIndex].description}
                            fill
                            className="object-contain"
                            priority
                          />
                        </div>
                        <div className="text-center p-4">
                          <p className="text-white text-[14px] font-bold">{photos[selectedIndex].description}</p>
                          <p className="text-white/50 text-[10px] uppercase font-bold tracking-widest mt-1">
                            {selectedIndex + 1} / {photos.length}
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 z-50 text-white hover:bg-white/20 bg-black/20 rounded-full h-12 w-12"
                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                      >
                        <ChevronRight className="h-8 w-8" />
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <div className="text-center py-10 opacity-50">
              <p className="text-[14px] font-normal">No photos uploaded yet.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
