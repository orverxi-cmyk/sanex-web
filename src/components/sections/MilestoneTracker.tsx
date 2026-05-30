
"use client";

import React from "react";
import { 
  Clock, 
  Shield, 
  Rocket, 
  TrendingUp,
  Edit3
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
    { year: "2017", title: "Founding", description: "Established to address Rwanda's liquid waste challenges.", icon: "clock" },
    { year: "2021", title: "Licensing", description: "Achieved official licensing for waste collection.", icon: "shield" },
    { year: "2024", title: "Expansion", description: "Expanded services to decentralized treatment systems.", icon: "rocket" }
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
    const iconClass = "h-5 w-5 text-black";
    const normalized = name?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'clock';
    switch (normalized) {
      case 'clock': return <Clock className={iconClass} />;
      case 'shield': return <Shield className={iconClass} />;
      case 'rocket': return <Rocket className={iconClass} />;
      default: return <Clock className={iconClass} />;
    }
  };

  if (loading) return null;

  return (
    <section className="py-0 bg-background relative group">
      {isAdmin && (
        <div className="absolute inset-0 z-20 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <Button asChild className="pointer-events-auto bg-black text-white hover:bg-black/80 gap-2 font-bold text-[14px]">
            <Link href="/admin/content?tab=milestones">
              <Edit3 className="h-4 w-4" /> Edit Who We Are
            </Link>
          </Button>
        </div>
      )}
      <div className="container mx-auto px-4 md:px-16 mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-5">
          {/* Left Column: Who We Are Story */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-[16px] font-bold text-black uppercase tracking-widest">{content.title}</h2>
              <div 
                className="text-[14px] font-normal text-muted-foreground leading-relaxed space-y-4 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: content.description }}
              />
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-white border border-border border-l-4 border-l-primary shadow-sm">
                <div className="flex items-center gap-2 mb-1 text-black">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <h3 className="text-[15px] font-bold">Our Vision</h3>
                </div>
                <p className="text-[14px] font-normal text-muted-foreground leading-relaxed">
                  To be Rwanda's leading provider of sustainable liquid waste management solutions, fostering a cleaner, healthier, and more sustainable environment for future generations.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white border border-border border-l-4 border-l-primary shadow-sm">
                <div className="flex items-center gap-2 mb-1 text-black">
                  <Shield className="h-4 w-4 text-primary" />
                  <h3 className="text-[15px] font-bold">Our Mission</h3>
                </div>
                <p className="text-[14px] font-normal text-muted-foreground leading-relaxed">
                  To deliver efficient, eco-friendly, and cost-effective liquid waste management services that empower communities, support businesses, and promote environmental conservation.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Evolution Timeline */}
          <div className="bg-white border border-border rounded-2xl p-6 lg:p-8 shadow-sm h-full">
            <h2 className="text-[16px] font-bold text-black text-center mb-10">Our Evolution</h2>
            
            <div className="relative space-y-12">
              {/* Vertical line */}
              <div className="absolute left-[20px] top-4 bottom-4 w-px bg-border z-0" />
              
              {content.items.map((milestone: any, i: number) => (
                <div key={i} className="relative z-10 flex gap-6 items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-md border-2 border-white">
                    {getIcon(milestone.icon)}
                  </div>
                  <div className="flex-grow pt-1">
                    <div className="text-[14px] font-bold text-primary mb-1">{milestone.year}</div>
                    <h4 className="text-[16px] font-bold text-black mb-1">{milestone.title}</h4>
                    <div 
                      className="text-[14px] font-normal text-muted-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: milestone.description }}
                    />
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
