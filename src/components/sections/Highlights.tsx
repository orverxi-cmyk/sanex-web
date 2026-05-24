
"use client";

import React from "react";
import { ShieldCheck, Cpu, Globe, Loader2, Zap, Award, Target, HardHat } from "lucide-react";
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
    switch (name.toLowerCase()) {
      case 'shield': return <ShieldCheck className="h-8 w-8 text-primary" />;
      case 'cpu': return <Cpu className="h-8 w-8 text-secondary" />;
      case 'globe': return <Globe className="h-8 w-8 text-primary" />;
      case 'zap': return <Zap className="h-8 w-8 text-secondary" />;
      case 'award': return <Award className="h-8 w-8 text-primary" />;
      case 'target': return <Target className="h-8 w-8 text-secondary" />;
      case 'hardhat': return <HardHat className="h-8 w-8 text-primary" />;
      default: return <ShieldCheck className="h-8 w-8 text-primary" />;
    }
  };

  if (loading) return null;

  return (
    <section className="py-16 border-y bg-white/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {items.map((item: any, i: number) => (
            <div key={i} className="flex gap-6 animate-in fade-in slide-in-from-bottom duration-500" style={{ animationDelay: `${i * 150}ms` }}>
              <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-2xl bg-background border border-border shadow-sm">
                {getIcon(item.icon)}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold font-headline">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
