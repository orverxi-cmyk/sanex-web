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

  const { data: impactData, loading } = useDoc(db ? doc(db, "settings", "impact") : null);

  const defaultImpacts = [
    { title: "Environmental Preservation", points: ["<p>We have successfully treated and managed thousands of cubic meters of liquid waste.</p>"], icon: "leaf" },
    { title: "Public Health Improvement", points: ["<p>By reducing the risks associated with poor liquid waste management.</p>"], icon: "heart" },
    { title: "Job Creation", points: ["<p>SANEX has directly created jobs for skilled and unskilled workers.</p>"], icon: "briefcase" }
  ];

  const content = {
    title: impactData?.title || "Impact Since Our Inception",
    subtitle: impactData?.subtitle || "Since its establishment in 2017, SANEX Company Ltd has made a significant impact.",
    items: impactData?.items?.length ? impactData.items : defaultImpacts
  };

  const getIcon = (name: string) => {
    const iconClass = "h-6 w-6 text-black";
    const normalized = name?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'sparkles';
    switch (normalized) {
      case 'leaf': return <Leaf className={iconClass} />;
      case 'heart': return <Heart className={iconClass} />;
      case 'briefcase': return <Briefcase className={iconClass} />;
      default: return <Sparkles className={iconClass} />;
    }
  };

  if (loading) return null;

  return (
    <section className="py-2.5 bg-primary text-black relative overflow-hidden group">
      {isAdmin && (
        <div className="absolute inset-0 z-20 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <Button asChild className="pointer-events-auto bg-black text-white hover:bg-black/80 gap-2">
            <Link href="/admin/content?tab=impact">
              <Edit3 className="h-4 w-4" /> Edit Impact
            </Link>
          </Button>
        </div>
      )}
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-5 space-y-4">
          <h2 className="text-[16px] font-bold leading-tight">{content.title}</h2>
          <p className="text-[15px] font-bold text-black/70 max-w-3xl mx-auto">{content.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {content.items.map((impact: any, i: number) => (
            <div key={i} className="p-8 rounded-2xl bg-white/90 border border-black/5 hover:border-black/20 transition-colors shadow-sm space-y-4">
              <div className="h-12 w-12 rounded-xl bg-black/5 flex items-center justify-center">{getIcon(impact.icon)}</div>
              <div className="space-y-3">
                <h4 className="text-[16px] font-bold">{impact.title}</h4>
                <div className="space-y-3">
                  {impact.points?.map((point: string, pi: number) => (
                    <div key={pi} className="flex gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-black mt-2 flex-shrink-0" />
                      <div className="prose prose-xs text-[14px] font-normal text-black/70 leading-relaxed" dangerouslySetInnerHTML={{ __html: point }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
