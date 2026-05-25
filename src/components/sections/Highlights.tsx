
"use client";

import React from "react";
import { ShieldCheck, Cpu, Globe, Zap, Award, Target, HardHat } from "lucide-react";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";

export function Highlights() {
  const db = useFirestore();
  const { data: highlightsData, loading } = useDoc(db ? doc(db, "settings", "highlights") : null);

  const defaultHighlights = [
    {
      icon: "shield",
      title: "Licensed Since 2021",
      description: "Trusted by over 114 clients nationwide with verified operational standards."
    },
    {
      icon: "cpu",
      title: "Advanced Technology",
      description: "Eco-friendly wastewater treatment systems using activated sludge technology."
    },
    {
      icon: "globe",
      title: "Nationwide Coverage",
      description: "Serving urban and rural communities from Kigali to Musanze and Huye."
    }
  ];

  const items = highlightsData?.items?.length ? highlightsData.items : defaultHighlights;

  const getIcon = (name: string) => {
    const iconClass = "h-8 w-8 text-primary";
    switch (name.toLowerCase()) {
      case 'shield': return <ShieldCheck className={iconClass} />;
      case 'cpu': return <Cpu className={iconClass} />;
      case 'globe': return <Globe className={iconClass} />;
      case 'zap': return <Zap className={iconClass} />;
      case 'award': return <Award className={iconClass} />;
      case 'target': return <Target className={iconClass} />;
      case 'hardhat': return <HardHat className={iconClass} />;
      default: return <ShieldCheck className={iconClass} />;
    }
  };

  if (loading) return null;

  return (
    <section className="py-5 border-y bg-white/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {items.map((item: any, i: number) => (
            <div key={i} className="flex gap-5 animate-in fade-in slide-in-from-bottom duration-500" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-xl bg-background border border-border shadow-sm">
                {getIcon(item.icon)}
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-headline">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-snug">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
