
"use client";

import React from "react";
import { Clock, Rocket, Shield, Globe, Target, Eye, Loader2, Award, Zap, Building } from "lucide-react";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";

export function MilestoneTracker() {
  const db = useFirestore();
  const { data: milestonesData, loading } = useDoc(db ? doc(db, "settings", "milestones") : null);

  const defaultMilestones = [
    {
      year: "2017",
      title: "Founding",
      description: "SANEX Company Ltd was established to address Rwanda's liquid waste challenges.",
      icon: "clock"
    },
    {
      year: "2021",
      title: "Licensing",
      description: "Achieved official licensing for liquid waste collection and transportation.",
      icon: "shield"
    },
    {
      year: "2024",
      title: "Expansion",
      description: "Expanded services to decentralized wastewater treatment systems (DWTS).",
      icon: "rocket"
    }
  ];

  const content = {
    title: milestonesData?.title || "Who We Are",
    description: milestonesData?.description || "SANEX Company Ltd is dedicated to delivering comprehensive liquid waste management solutions across Rwanda. Our core services include the collection, transportation, and installation of decentralized wastewater treatment systems (DWTS). Committed to sustainability and efficiency, SANEX strives to lead the industry by addressing the increasing demand for improved wastewater management in both urban and rural areas.",
    items: milestonesData?.items?.length ? milestonesData.items : defaultMilestones
  };

  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'clock': return <Clock className="h-6 w-6" />;
      case 'shield': return <Shield className="h-6 w-6" />;
      case 'rocket': return <Rocket className="h-6 w-6" />;
      case 'globe': return <Globe className="h-6 w-6" />;
      case 'award': return <Award className="h-6 w-6" />;
      case 'zap': return <Zap className="h-6 w-6" />;
      case 'building': return <Building className="h-6 w-6" />;
      default: return <Target className="h-6 w-6" />;
    }
  };

  if (loading) return null;

  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-5xl font-bold font-headline">{content.title}</h2>
              <div className="text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap">
                {content.description}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-3">
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <Eye className="h-5 w-5" />
                </div>
                <h4 className="text-xl font-bold font-headline">Our Vision</h4>
                <p className="text-sm text-muted-foreground">
                  To be Rwanda's leading provider of sustainable liquid waste management solutions.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-secondary/5 border border-secondary/10 space-y-3">
                <div className="h-10 w-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                  <Target className="h-5 w-5" />
                </div>
                <h4 className="text-xl font-bold font-headline">Our Mission</h4>
                <p className="text-sm text-muted-foreground">
                  To deliver efficient, eco-friendly, and cost-effective sanitation solutions.
                </p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-primary/5 rounded-3xl -rotate-3 -z-10" />
            <div className="p-8 lg:p-12 bg-white rounded-3xl border shadow-sm">
              <h3 className="text-2xl font-bold font-headline mb-8 text-center">Our Evolution</h3>
              <div className="space-y-10">
                {content.items.map((milestone: any, i: number) => (
                  <div key={i} className="flex gap-6 items-start relative">
                    {i !== content.items.length - 1 && (
                      <div className="absolute left-6 top-12 bottom-[-40px] w-0.5 bg-border" />
                    )}
                    <div className="h-12 w-12 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-white shadow-sm relative z-10">
                      {getIcon(milestone.icon)}
                    </div>
                    <div className="space-y-1">
                      <span className="text-primary font-bold text-sm uppercase tracking-wider">{milestone.year}</span>
                      <h4 className="text-lg font-bold font-headline">{milestone.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
