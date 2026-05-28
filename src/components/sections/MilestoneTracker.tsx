
"use client";

import React from "react";
import { 
  Clock, 
  Rocket, 
  Shield, 
  Target, 
  Zap, 
  Edit3,
  TrendingUp,
  Award
} from "lucide-react";
import { useDoc, useFirestore, useUser } from "@/firebase";
import { doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function MilestoneTracker() {
  const db = useFirestore();
  const { user } = useUser();
  const userDocRef = React.useMemo(() => (db && user ? doc(db, "users", user.uid) : null), [db, user]);
  const { data: userProfile } = useDoc(userDocRef);
  const isAdmin = userProfile?.role === "admin";

  const { data: milestonesData, loading } = useDoc(db ? doc(db, "settings", "milestones") : null);

  const defaultMilestones = [
    { year: "2017", title: "Founding", description: "<p>Established to address Rwanda's liquid waste challenges.</p>", icon: "clock" },
    { year: "2021", title: "Licensing", description: "<p>Achieved official licensing for waste collection.</p>", icon: "shield" },
    { year: "2024", title: "Expansion", description: "<p>Expanded services to decentralized treatment systems.</p>", icon: "rocket" }
  ];

  const content = {
    title: milestonesData?.title || "Who We Are",
    description: milestonesData?.description || `
      <p>Founded in 2017, SANEX Company Ltd was born out of a commitment to address Rwanda's pressing liquid waste management challenges. Recognizing the critical need for sustainable solutions, we embarked on a journey to protect the environment, improve public health, and contribute to sustainable development.</p>
      <p>Over the years, our dedication to innovation and customer satisfaction has positioned SANEX as a trusted name in the waste management sector. We take pride in offering end-to-end solutions, from waste collection and transportation to the installation of cutting-edge decentralized wastewater treatment systems (DWTS). Our holistic approach ensures we deliver services that are not only efficient but also environmentally responsible.</p>
    `,
    items: milestonesData?.items?.length ? milestonesData.items : defaultMilestones
  };

  const getIcon = (name: string) => {
    const iconClass = "h-5 w-5 text-primary";
    const normalized = name?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'clock';
    switch (normalized) {
      case 'clock': return <Clock className={iconClass} />;
      case 'shield': return <Shield className={iconClass} />;
      case 'rocket': return <Rocket className={iconClass} />;
      case 'trendingup': return <TrendingUp className={iconClass} />;
      case 'award': return <Award className={iconClass} />;
      case 'zap': return <Zap className={iconClass} />;
      default: return <Clock className={iconClass} />;
    }
  };

  if (loading) return null;

  return (
    <section className="py-2.5 bg-background relative group">
      {isAdmin && (
        <div className="absolute inset-0 z-20 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <Button asChild className="pointer-events-auto bg-black text-white hover:bg-black/80 gap-2 font-bold text-[14px]">
            <Link href="/admin/content?tab=milestones">
              <Edit3 className="h-4 w-4" /> Edit Who We Are
            </Link>
          </Button>
        </div>
      )}
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                Our Story
              </div>
              <h2 className="text-[16px] font-bold">{content.title}</h2>
              <div 
                className="text-[14px] font-normal text-muted-foreground leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: content.description }}
              />
            </div>

            <div className="space-y-4 pt-4">
              <div className="p-6 rounded-2xl bg-muted/30 border-l-4 border-primary shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <TrendingUp className="h-4 w-4" />
                  <h3 className="text-[16px] font-bold">Our Vision</h3>
                </div>
                <p className="text-[14px] font-normal leading-relaxed">
                  To be Rwanda's leading provider of sustainable liquid waste management solutions, fostering a cleaner, healthier, and more sustainable environment for future generations.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-muted/30 border-l-4 border-primary shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <Shield className="h-4 w-4" />
                  <h3 className="text-[16px] font-bold">Our Mission</h3>
                </div>
                <p className="text-[14px] font-normal leading-relaxed">
                  To deliver efficient, eco-friendly, and cost-effective liquid waste management services that empower communities, support businesses, and promote environmental conservation.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {content.items.map((milestone: any, i: number) => (
              <div key={i} className="p-6 rounded-2xl bg-white border border-primary/10 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center">
                  {getIcon(milestone.icon)}
                </div>
                <div className="text-primary font-bold text-[15px]">{milestone.year}</div>
                <h4 className="text-[16px] font-bold leading-tight">{milestone.title}</h4>
                <div 
                  className="text-[14px] font-normal text-muted-foreground leading-snug"
                  dangerouslySetInnerHTML={{ __html: milestone.description }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
