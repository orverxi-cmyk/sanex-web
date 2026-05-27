"use client";

import React from "react";
import { 
  Clock, 
  Rocket, 
  Shield, 
  Globe, 
  Target, 
  Eye, 
  Award, 
  Zap, 
  Building,
  ShieldCheck,
  Cpu,
  HardHat,
  Activity,
  Droplets,
  Truck,
  Users,
  Leaf,
  Heart,
  Scale,
  Sparkles,
  CheckCircle,
  Stethoscope
} from "lucide-react";
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
    const iconClass = "h-4 w-4 text-black";
    const normalized = name?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'target';
    
    switch (normalized) {
      case 'clock': case 'time': return <Clock className={iconClass} />;
      case 'shield': case 'shieldcheck': return <Shield className={iconClass} />;
      case 'rocket': case 'launch': return <Rocket className={iconClass} />;
      case 'globe': return <Globe className={iconClass} />;
      case 'award': case 'medal': return <Award className={iconClass} />;
      case 'zap': case 'energy': return <Zap className={iconClass} />;
      case 'building': case 'company': return <Building className={iconClass} />;
      case 'cpu': return <Cpu className={iconClass} />;
      case 'hardhat': return <HardHat className={iconClass} />;
      case 'activity': return <Activity className={iconClass} />;
      case 'droplets': return <Droplets className={iconClass} />;
      case 'truck': return <Truck className={iconClass} />;
      case 'users': return <Users className={iconClass} />;
      case 'leaf': return <Leaf className={iconClass} />;
      case 'heart': return <Heart className={iconClass} />;
      case 'scale': return <Scale className={iconClass} />;
      case 'sparkles': return <Sparkles className={iconClass} />;
      case 'check': case 'checkcircle': return <CheckCircle className={iconClass} />;
      case 'stethoscope': return <Stethoscope className={iconClass} />;
      default: return <Target className={iconClass} />;
    }
  };

  if (loading) return null;

  return (
    <section id="about" className="py-2.5 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-2xl lg:text-3xl font-bold font-headline">{content.title}</h2>
              <div className="text-muted-foreground text-[11px] leading-relaxed prose prose-sm max-w-none">
                <div dangerouslySetInnerHTML={{ __html: content.description }} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 space-y-1">
                <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-black">
                  <Eye className="h-3.5 w-3.5" />
                </div>
                <h4 className="text-sm font-bold font-headline">Vision</h4>
                <p className="text-[10px] text-muted-foreground">Leading provider of sustainable waste solutions.</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/10 space-y-1">
                <div className="h-7 w-7 rounded-full bg-secondary text-primary flex items-center justify-center">
                  <Target className="h-3.5 w-3.5" />
                </div>
                <h4 className="text-sm font-bold font-headline">Mission</h4>
                <p className="text-[10px] text-muted-foreground">Efficient, eco-friendly, and cost-effective sanitation.</p>
              </div>
            </div>
          </div>
          
          <div className="relative p-5 bg-muted/5 rounded-xl border shadow-sm">
            <h3 className="text-lg font-bold font-headline mb-4 text-center">Our Evolution</h3>
            <div className="space-y-4">
              {content.items.map((milestone: any, i: number) => (
                <div key={i} className="flex gap-3 items-start relative">
                  {i !== content.items.length - 1 && (
                    <div className="absolute left-[17px] top-[34px] bottom-[-16px] w-0.5 bg-border" />
                  )}
                  <div className="h-9 w-9 rounded-full bg-primary flex-shrink-0 flex items-center justify-center shadow-sm relative z-10">
                    {getIcon(milestone.icon)}
                  </div>
                  <div className="space-y-0">
                    <span className="text-primary font-bold text-[9px] uppercase tracking-wider">{milestone.year}</span>
                    <h4 className="text-sm font-bold font-headline leading-tight">{milestone.title}</h4>
                    <div className="text-[10px] text-muted-foreground leading-snug prose prose-xs">
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
