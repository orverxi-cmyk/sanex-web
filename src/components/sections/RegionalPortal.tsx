
"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Edit3 } from "lucide-react";
import { useDoc, useFirestore, useUser } from "@/firebase";
import { doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";

export function RegionalPortal() {
  const db = useFirestore();
  const { user } = useUser();
  const userDocRef = React.useMemo(() => (db && user ? doc(db, "users", user.uid) : null), [db, user]);
  const { data: userProfile } = useDoc(userDocRef);
  const isAdmin = userProfile?.role === "admin";

  const { data: regionalData, loading } = useDoc(db ? doc(db, "settings", "regional") : null);

  const defaultRegions = [
    { name: "Kigali", status: "Operational Headquarters", capacity: "Full Fleet" },
    { name: "Musanze", status: "Strategic Hub", capacity: "Service Center" },
    { name: "Huye", status: "Planned Expansion", capacity: "Regional Office" }
  ];

  const content = {
    title: regionalData?.title || "Our Presence",
    description: regionalData?.description || "Establishing operational offices in key towns across Rwanda.",
    items: regionalData?.items?.length ? regionalData.items : defaultRegions
  };

  if (loading) return null;

  return (
    <section className="py-2.5 bg-background relative group">
      {isAdmin && (
        <div className="absolute inset-0 z-20 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <Button asChild className="pointer-events-auto bg-black text-white hover:bg-black/80 gap-2 font-bold text-[14px]">
            <Link href="/admin/content?tab=regional">
              <Edit3 className="h-4 w-4" /> Edit Our Presence
            </Link>
          </Button>
        </div>
      )}
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-5 items-center">
          <div className="lg:w-1/3 space-y-3 text-center lg:text-left">
            <h2 className="text-[16px] font-bold leading-tight uppercase tracking-widest">{content.title}</h2>
            <p className="text-[14px] font-normal text-muted-foreground leading-relaxed">{content.description}</p>
            <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/20 inline-block lg:block">
              <div className="flex gap-2.5 items-center">
                <div className="h-7 w-7 rounded-full bg-secondary/20 flex items-center justify-center text-primary"><MapPin className="h-3.5 w-3.5" /></div>
                <div className="text-left">
                  <div className="text-[16px] font-bold">Rwanda Nationwide</div>
                  <div className="text-[14px] font-normal text-muted-foreground">Urban & Rural Connectivity</div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {content.items.map((region: any, i: number) => (
              <div key={i} className="group/item p-4 rounded-xl bg-white border shadow-sm hover:border-primary/50 transition-all">
                <div className="flex justify-between items-start mb-1.5">
                  <h3 className="text-[16px] font-bold group-hover/item:text-primary transition-colors">{region.name}</h3>
                  <div className="px-1 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground">ACTIVE</div>
                </div>
                <div className="space-y-0.5 text-[14px] font-normal text-muted-foreground">
                  <div className="flex items-center gap-1.5"><div className="h-1 w-1 rounded-full bg-secondary" />{region.status}</div>
                  <div className="flex items-center gap-1.5"><div className="h-1 w-1 rounded-full bg-primary" />{region.capacity}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
