"use client";

import React from "react";
import { 
  Leaf, 
  Sparkles, 
  Heart, 
  Briefcase
} from "lucide-react";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";

export function ImpactDashboard() {
  const db = useFirestore();
  const { data: impactData, loading } = useDoc(db ? doc(db, "settings", "impact") : null);

  const defaultImpacts = [
    {
      title: "Environmental Preservation",
      points: [
        "<p>We have successfully treated and managed thousands of cubic meters of liquid waste, preventing harmful pollutants from contaminating natural ecosystems.</p>",
        "<p>Our decentralized wastewater treatment systems (DWTS) have contributed to cleaner water sources, promoting biodiversity and reducing environmental degradation.</p>"
      ],
      icon: "leaf"
    },
    {
      title: "Public Health Improvement",
      points: [
        "<p>By reducing the risks associated with poor liquid waste management, we have helped to mitigate waterborne diseases, improving the overall health and well-being of the communities we serve.</p>",
        "<p>Our awareness campaigns on waste management have empowered local populations to adopt safer practices, fostering healthier living.</p>"
      ],
      icon: "heart"
    },
    {
      title: "Job Creation",
      points: [
        "<p>SANEX has directly created jobs for skilled and unskilled workers, contributing to local economic growth.</p>",
        "<p>Our training programs have enhanced the capacities of local communities in managing liquid waste and understanding sustainable practices.</p>"
      ],
      icon: "briefcase"
    }
  ];

  const content = {
    title: impactData?.title || "Impact Since Our Inception",
    subtitle: impactData?.subtitle || "Since its establishment in 2017, SANEX Company Ltd has made a significant impact in addressing the challenges of liquid waste management across Rwanda.",
    items: impactData?.items?.length ? impactData.items : defaultImpacts
  };

  const getIcon = (name: string) => {
    const iconClass = "h-6 w-6 text-black";
    const normalized = name?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'sparkles';
    
    switch (normalized) {
      case 'leaf': return <Leaf className={iconClass} />;
      case 'heart': return <Heart className={iconClass} />;
      case 'briefcase': return <Briefcase className={iconClass} />;
      case 'sparkles': return <Sparkles className={iconClass} />;
      default: return <Sparkles className={iconClass} />;
    }
  };

  if (loading) return null;

  return (
    <section className="py-2.5 bg-primary text-black relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-5 space-y-4">
          <h2 className="text-3xl lg:text-4xl font-bold font-headline leading-tight">{content.title}</h2>
          <p className="text-sm lg:text-base text-black/70 font-medium max-w-3xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {content.items.map((impact: any, i: number) => (
            <div key={i} className="p-8 rounded-2xl bg-white/90 border border-black/5 hover:border-black/20 transition-colors shadow-sm space-y-4">
              <div className="h-12 w-12 rounded-xl bg-black/5 flex items-center justify-center">
                {getIcon(impact.icon)}
              </div>
              <div className="space-y-3">
                <h4 className="text-xl font-bold font-headline">{impact.title}</h4>
                <div className="space-y-3">
                  {impact.points?.map((point: string, pi: number) => (
                    <div key={pi} className="flex gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-black mt-2 flex-shrink-0" />
                      <div 
                        className="prose prose-xs lg:prose-sm max-w-none text-black/70 leading-relaxed font-medium" 
                        dangerouslySetInnerHTML={{ __html: point }} 
                      />
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
