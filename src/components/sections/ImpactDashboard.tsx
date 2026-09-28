
"use client";

import React from "react";
import Link from "next/link";
import { Leaf, Sparkles, Heart, Briefcase, Edit3 } from "lucide-react";
import { useDoc, useFirestore, useUser } from "@/firebase";
import { doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";

export function ImpactDashboard() {
  const db = useFirestore();
  const { user } = useUser();
  const userDocRef = React.useMemo(() => (db && user ? doc(db, "users", user.uid) : null), [db, user]);
  const { data: userProfile } = useDoc(userDocRef);
  const isAdmin = userProfile?.role === "admin";

  const impactRef = React.useMemo(() => (db ? doc(db, "settings", "impact") : null), [db]);
  const { data: impactData } = useDoc(impactRef);

  const defaultImpacts = [
    { title: "Environmental Preservation", points: ["<p>We have successfully treated and managed thousands of cubic meters of liquid waste, preventing harmful pollutants from contaminating natural ecosystems.</p>"], icon: "leaf" },
    { title: "Public Health Improvement", points: ["<p>By reducing the risks associated with poor liquid waste management, we have helped to mitigate waterborne diseases.</p>"], icon: "heart" },
    { title: "Job Creation", points: ["<p>SANEX has directly created jobs for skilled and unskilled workers, contributing to local economic growth.</p>"], icon: "briefcase" }
  ];

  const content = {
    title: impactData?.title || "Impact Since Our Inception",
    subtitle: impactData?.subtitle || "Since its establishment in 2017, SANEX Company Ltd has made a significant impact in addressing the challenges of liquid waste management across Rwanda.",
    items: impactData?.items?.length ? impactData.items : defaultImpacts
  };

  const getIcon = (name: string) => {
    const iconClass = "h-6 w-6 text-primary";
    const normalized = name?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'sparkles';
    switch (normalized) {
      case 'leaf': return <Leaf className={iconClass} />;
      case 'heart': return <Heart className={iconClass} />;
      case 'briefcase': return <Briefcase className={iconClass} />;
      default: return <Sparkles className={iconClass} />;
    }
  };

  return (
    <section className="py-2.5 bg-background relative group overflow-hidden">
      {isAdmin && (
        <div className="absolute inset-0 z-20 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <Button asChild className="pointer-events-auto bg-black text-white hover:bg-black/80 gap-2 font-bold text-[14px]">
            <Link href="/admin/content?tab=impact">
              <Edit3 className="h-4 w-4" /> Edit Impact
            </Link>
          </Button>
        </div>
      )}
      <div className="container mx-auto px-4 md:px-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-5 space-y-1">
          <h2 className="text-[16px] font-bold leading-tight">{content.title}</h2>
          <p className="text-[14px] font-normal text-muted-foreground max-w-3xl mx-auto">{content.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {content.items.map((impact: any, i: number) => (
            <div key={i} className="p-8 rounded-2xl bg-black border border-white/5 hover:border-primary/20 transition-all shadow-xl flex flex-col space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  {getIcon(impact.icon)}
                </div>
                <h4 className="text-[16px] font-bold text-white leading-tight">
                  {impact.title}
                </h4>
              </div>
              
              <div className="space-y-3">
                {impact.points?.map((point: string, pi: number) => (
                  <div key={pi} className="flex gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div 
                      className="text-[14px] font-normal text-white/70 leading-relaxed" 
                      dangerouslySetInnerHTML={{ __html: point }} 
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
