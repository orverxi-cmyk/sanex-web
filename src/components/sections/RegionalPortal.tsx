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

  const regionalRef = React.useMemo(() => (db ? doc(db, "settings", "regional") : null), [db]);
  const { data: regionalData } = useDoc(regionalRef);

  const defaultRegions = [
    { name: "Kigali", status: "Operational Headquarters", capacity: "Full Fleet" },
    { name: "Musanze", status: "Strategic Hub", capacity: "Service Center" },
    { name: "Huye", status: "Planned Expansion", capacity: "Regional Office" }
  ];

  const content = {
    title: regionalData?.title || "Our Presence",
    description: regionalData?.description || "Establishing operational offices in key towns across Rwanda...",
    items: regionalData?.items?.length ? regionalData.items : defaultRegions
  };

  return (
    <div className="relative group">
      {isAdmin && (
        <div className="absolute -inset-2 z-20 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none rounded-xl">
          <Button asChild className="pointer-events-auto bg-black text-white hover:bg-black/80 gap-2 font-bold text-[14px]">
            <Link href="/admin/content?tab=regional">
              <Edit3 className="h-4 w-4" /> Edit Our Presence
            </Link>
          </Button>
        </div>
      )}
      
      <div className="space-y-1 mb-8">
        <h2 className="text-[16px] font-bold text-black uppercase tracking-widest">{content.title}</h2>
        <p className="text-[14px] font-normal text-muted-foreground leading-relaxed">{content.description}</p>
      </div>

      <div className="space-y-6">
        {/* Nationwide Status Card */}
        <div className="p-5 rounded-xl bg-white border border-border/50 shadow-sm">
          <div className="flex gap-4 items-center">
            <div className="h-10 w-10 rounded-full bg-muted/40 border flex items-center justify-center text-primary shadow-inner">
              <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
            </div>
            <div>
              <div className="text-[14px] font-bold text-black">Rwanda Nationwide</div>
              <div className="text-[14px] font-normal text-muted-foreground">Urban & Rural Connectivity</div>
            </div>
          </div>
        </div>

        {/* Vertical Stack of Regions */}
        <div className="space-y-4">
          {content.items.map((region: any, i: number) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-border shadow-sm hover:border-primary/40 transition-all group/card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[16px] font-bold text-black group-hover/card:text-primary transition-colors">{region.name}</h3>
                <div className="px-1.5 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider bg-muted text-muted-foreground border">ACTIVE</div>
              </div>
              
              <ul className="space-y-2.5">
                <li className="flex items-center gap-2.5 text-[14px] font-normal text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 flex-shrink-0" />
                  <span>{region.status}</span>
                </li>
                <li className="flex items-center gap-2.5 text-[14px] font-normal text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span>{region.capacity}</span>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
