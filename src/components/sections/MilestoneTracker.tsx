
"use client";

import React from "react";
import { Clock, Rocket, Shield, Globe, Target, Eye, Award, Zap, Building } from "lucide-react";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";

export function MilestoneTracker() {
  const db = useFirestore();
  const { data: milestonesData, loading } = useDoc(db ? doc(db, "settings", "milestones") : null);

  const defaultMilestones = [
    {
      year: "2017",
      title: "Founding",
      description: "<p>Established to address Rwanda's liquid waste challenges.</p>",
      icon: "clock"
    },
    {
      year: "2021",
      title: "Licensing",
      description: "<p>Achieved official licensing for waste collection.</p>",
      icon: "shield"
    },
    {
      year: "2024",
      title: "Expansion",
      description: "<p>Expanded services to decentralized treatment systems.</p>",
      icon: "rocket"
    }
  ];

  const content = {
    title: milestonesData?.title || "Who We Are",
    description: milestonesData?.description || "SANEX Company Ltd is dedicated to delivering comprehensive liquid waste management solutions across Rwanda.",
    items: milestonesData?.items?.length ? milestonesData.items : defaultMilestones
  };

  const getIcon = (name: string) => {
    const iconClass = "h-5 w-5 text-black";
    switch (name.toLowerCase()) {
      case 'clock': return <Clock className={iconClass} />;
      case 'shield': return <Shield className={iconClass} />;
      case 'rocket': return <Rocket className={iconClass} />;
      case 'globe': return <Globe className={iconClass} />;
      case 'award': return <Award className={iconClass} />;
      case 'zap': return <Zap className={iconClass} />;
      case 'building': return <Building className={iconClass} />;
      default: return <Target className={iconClass} />;
    }
  };

  if (loading) return null;

  return (
    <section id="about" className="py-5 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          <div className="space-y-5">
            <div className="space-y-2">
              <h2 className="text-2xl lg:text-4xl font-bold font-headline">{content.title}</h2>
              <div className="text-muted-foreground text-sm leading-relaxed prose prose-sm max-w-none">
                <div dangerouslySetInnerHTML={{ __html: content.description }} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-black">
                  <Eye className="h-4 w-4" />
                </div>
                <h4 className="text-lg font-bold font-headline">Vision</h4>
                <p className="text-xs text-muted-foreground">Leading provider of sustainable waste solutions.</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/10 space-y-2">
                <div className="h-8 w-8 rounded-full bg-secondary text-primary flex items-center justify-center">
                  <Target className="h-4 w-4" />
                </div>
                <h4 className="text-lg font-bold font-headline">Mission</h4>
                <p className="text-xs text-muted-foreground">Efficient, eco-friendly, and cost-effective sanitation.</p>
              </div>
            </div>
          </div>
          
          <div className="relative p-6 bg-muted/5 rounded-2xl border shadow-sm">
            <h3 className="text-xl font-bold font-headline mb-5 text-center">Our Evolution</h3>
            <div className="space-y-5">
              {content.items.map((milestone: any, i: number) => (
                <div key={i} className="flex gap-4 items-start relative">
                  {i !== content.items.length - 1 && (
                    <div className="absolute left-5 top-10 bottom-[-20px] w-0.5 bg-border" />
                  )}
                  <div className="h-10 w-10 rounded-full bg-primary flex-shrink-0 flex items-center justify-center shadow-sm relative z-10">
                    {getIcon(milestone.icon)}
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-primary font-bold text-[10px] uppercase tracking-wider">{milestone.year}</span>
                    <h4 className="text-base font-bold font-headline">{milestone.title}</h4>
                    <div className="text-xs text-muted-foreground leading-snug prose prose-xs">
                      <div dangerouslySetInnerHTML={{ __html: milestone.description }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
