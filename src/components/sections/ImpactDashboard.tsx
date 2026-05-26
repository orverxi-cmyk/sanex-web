
"use client";

import React from "react";
import { CheckCircle, Leaf, Users, Globe, Building2, Sparkles, Heart, Scale, ArrowRight } from "lucide-react";
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
        "<p>We have successfully treated and managed thousands of cubic meters of liquid waste.</p><p>Our systems have contributed to cleaner water sources, promoting biodiversity.</p>"
      ],
      icon: "leaf"
    },
    {
      title: "Public Health Improvement",
      points: [
        "<p>Helping to mitigate waterborne diseases and improving overall community health.</p><p>Our awareness campaigns empowered local populations to adopt safer practices.</p>"
      ],
      icon: "check"
    }
  ];

  const content = {
    title: impactData?.title || "Impact Since Our Inception",
    subtitle: impactData?.subtitle || "Since 2017, SANEX Company Ltd has made a significant impact in addressing the challenges of liquid waste management across Rwanda.",
    items: impactData?.items?.length ? impactData.items : defaultImpacts
  };

  const getIcon = (name: string) => {
    const iconClass = "h-6 w-6 text-black";
    switch (name.toLowerCase()) {
      case 'leaf': return <Leaf className={iconClass} />;
      case 'check': return <CheckCircle className={iconClass} />;
      case 'users': return <Users className={iconClass} />;
      case 'globe': return <Globe className={iconClass} />;
      case 'building': return <Building2 className={iconClass} />;
      case 'heart': return <Heart className={iconClass} />;
      case 'scale': return <Scale className={iconClass} />;
      default: return <Sparkles className={iconClass} />;
    }
  };

  if (loading) return null;

  return (
    <section className="py-5 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-5 space-y-2">
          <h2 className="text-2xl lg:text-4xl font-bold font-headline leading-tight text-black">{content.title}</h2>
          <p className="text-sm text-black/80 font-medium">
            {content.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
          {content.items.map((impact: any, i: number) => (
            <div key={i} className="p-6 rounded-xl bg-black/5 border border-black/10 backdrop-blur-sm space-y-4">
              <div className="h-10 w-10 rounded-lg bg-black/10 flex items-center justify-center">
                {getIcon(impact.icon)}
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold font-headline text-black">{impact.title}</h4>
                <div className="prose prose-sm prose-black">
                  {impact.points?.map((point: string, pi: number) => (
                    <div key={pi} dangerouslySetInnerHTML={{ __html: point }} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto p-6 rounded-2xl bg-black/10 border border-black/20 text-center flex flex-col items-center gap-4">
          <p className="text-base font-bold leading-relaxed italic text-black">
            "Transforming Waste into Opportunity."
          </p>
          <Button asChild variant="secondary" className="gap-2 font-bold bg-black text-primary hover:bg-black/90">
            <Link href="/articles">View Detailed Impact Articles <ArrowRight className="h-4 w-4 text-primary" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
