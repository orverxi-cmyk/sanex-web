
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
        "<p>We have successfully treated and managed thousands of cubic meters of liquid waste, preventing harmful pollutants from contaminating natural ecosystems.</p><p>Our decentralized wastewater treatment systems (DWTS) have contributed to cleaner water sources, promoting biodiversity and reducing environmental degradation.</p>"
      ],
      icon: "leaf"
    },
    {
      title: "Public Health Improvement",
      points: [
        "<p>By reducing the risks associated with poor liquid waste management, we have helped to mitigate waterborne diseases, improving the overall health and well-being of the communities we serve.</p><p>Our awareness campaigns on waste management have empowered local populations to adopt safer practices, fostering healthier living.</p>"
      ],
      icon: "heart"
    },
    {
      title: "Job Creation",
      points: [
        "<p>SANEX has directly created jobs for skilled and unskilled workers, contributing to local economic growth.</p><p>Our training programs have enhanced the capacities of local communities in managing liquid waste and understanding sustainable practices.</p>"
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
    const iconClass = "h-5 w-5 text-primary";
    const normalized = name?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'sparkles';
    
    switch (normalized) {
      case 'leaf': return <Leaf className={iconClass} />;
      case 'check': case 'checkcircle': return <CheckCircle className={iconClass} />;
      case 'users': case 'team': return <Users className={iconClass} />;
      case 'globe': return <Globe className={iconClass} />;
      case 'building': case 'building2': return <Building2 className={iconClass} />;
      case 'heart': return <Heart className={iconClass} />;
      case 'scale': return <Scale className={iconClass} />;
      case 'sparkles': return <Sparkles className={iconClass} />;
      case 'shield': case 'shieldcheck': return <ShieldCheck className={iconClass} />;
      case 'cpu': return <Cpu className={iconClass} />;
      case 'zap': return <Zap className={iconClass} />;
      case 'award': return <Award className={iconClass} />;
      case 'target': return <Target className={iconClass} />;
      case 'hardhat': return <HardHat className={iconClass} />;
      case 'activity': return <Activity className={iconClass} />;
      case 'droplets': return <Droplets className={iconClass} />;
      case 'truck': return <Truck className={iconClass} />;
      case 'clock': return <Clock className={iconClass} />;
      case 'rocket': return <Rocket className={iconClass} />;
      case 'briefcase': return <Briefcase className={iconClass} />;
      default: return <Sparkles className={iconClass} />;
    }
  };

  if (loading) return null;

  return (
    <section className="py-2.5 bg-black text-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-5 space-y-1">
          <h2 className="text-2xl lg:text-3xl font-bold font-headline leading-tight text-white">{content.title}</h2>
          <p className="text-[11px] text-white/70 font-medium">
            {content.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
          {content.items.map((impact: any, i: number) => (
            <div key={i} className="p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-3">
              <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center">
                {getIcon(impact.icon)}
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold font-headline text-white">{impact.title}</h4>
                <div className="prose prose-xs prose-invert opacity-80">
                  {impact.points?.map((point: string, pi: number) => (
                    <div key={pi} dangerouslySetInnerHTML={{ __html: point }} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-xl mx-auto p-4 rounded-xl bg-white/5 border border-white/10 text-center flex flex-col items-center gap-3">
          <p className="text-sm font-bold leading-relaxed italic text-white/90">
            "Transforming Waste into Opportunity."
          </p>
          <Button asChild size="sm" variant="secondary" className="gap-2 font-bold bg-primary text-black hover:bg-primary/90 text-[10px] h-9">
            <Link href="/articles">View Impact Articles <ArrowRight className="h-3 w-3" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
