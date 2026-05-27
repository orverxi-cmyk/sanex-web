
"use client";

import React from "react";
import { 
  CheckCircle, 
  Leaf, 
  Users, 
  Globe, 
  Building2, 
  Sparkles, 
  Heart, 
  Scale, 
  ArrowRight,
  ShieldCheck,
  Cpu,
  Zap,
  Award,
  Target,
  HardHat,
  Activity,
  Droplets,
  Truck,
  Clock,
  Rocket,
  Briefcase
} from "lucide-react";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ImpactDashboard() {
  const db = useFirestore();
  const { data: impactData, loading } = useDoc(db ? doc(db, "settings", "impact") : null);

  const defaultImpacts = [
    {
      title: "Environmental Preservation",
      points: [
        "We have successfully treated and managed thousands of cubic meters of liquid waste, preventing harmful pollutants from contaminating natural ecosystems.",
        "Our decentralized wastewater treatment systems (DWTS) have contributed to cleaner water sources, promoting biodiversity and reducing environmental degradation."
      ],
      icon: "leaf"
    },
    {
      title: "Public Health Improvement",
      points: [
        "By reducing the risks associated with poor liquid waste management, we have helped to mitigate waterborne diseases, improving the overall health and well-being of the communities we serve.",
        "Our awareness campaigns on waste management have empowered local populations to adopt safer practices, fostering healthier living."
      ],
      icon: "heart"
    },
    {
      title: "Job Creation",
      points: [
        "SANEX has directly created jobs for skilled and unskilled workers, contributing to local economic growth.",
        "Our training programs have enhanced the capacities of local communities in managing liquid waste and understanding sustainable practices."
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
    const iconClass = "h-6 w-6 text-primary";
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
    <section className="py-12 bg-black text-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-10 space-y-4">
          <h2 className="text-3xl lg:text-4xl font-bold font-headline leading-tight text-white">{content.title}</h2>
          <p className="text-sm lg:text-base text-white/70 font-medium max-w-3xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {content.items.map((impact: any, i: number) => (
            <div key={i} className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-primary/40 transition-colors space-y-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                {getIcon(impact.icon)}
              </div>
              <div className="space-y-3">
                <h4 className="text-xl font-bold font-headline text-white">{impact.title}</h4>
                <ul className="space-y-2">
                  {impact.points?.map((point: string, pi: number) => (
                    <li key={pi} className="text-sm text-white/60 leading-relaxed flex gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div dangerouslySetInnerHTML={{ __html: point }} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-neutral-900 border border-neutral-800 text-center flex flex-col items-center gap-4">
          <p className="text-lg font-bold leading-relaxed italic text-primary">
            "Transforming Waste into Opportunity."
          </p>
          <Button asChild size="lg" variant="secondary" className="gap-2 font-bold bg-primary text-black hover:bg-primary/90 rounded-full px-8">
            <Link href="/articles">View Impact Articles <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
