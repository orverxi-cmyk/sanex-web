"use client";

import React from "react";
import { 
  ShieldCheck, 
  Cpu, 
  Globe, 
  Zap, 
  Award, 
  Target, 
  HardHat, 
  Activity,
  Droplets,
  Truck,
  Users,
  Leaf,
  Heart,
  Scale,
  Sparkles,
  Clock,
  Rocket,
  Building,
  CheckCircle,
  Lightbulb,
  Microscope,
  Stethoscope,
  Edit3
} from "lucide-react";
import { useDoc, useFirestore, useUser } from "@/firebase";
import { doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Highlights() {
  const db = useFirestore();
  const { user } = useUser();
  const userDocRef = React.useMemo(() => (db && user ? doc(db, "users", user.uid) : null), [db, user]);
  const { data: userProfile } = useDoc(userDocRef);
  const isAdmin = userProfile?.role === "admin";

  const highlightsRef = React.useMemo(() => (db ? doc(db, "settings", "highlights") : null), [db]);
  const { data: highlightsData, loading } = useDoc(highlightsRef);

  const defaultHighlights = [
    { icon: "shield", title: "Licensed Since 2021", description: "Trusted by over 114 clients nationwide with verified operational standards." },
    { icon: "cpu", title: "Advanced Technology", description: "Eco-friendly wastewater treatment systems using activated sludge technology." },
    { icon: "globe", title: "Nationwide Coverage", description: "Serving urban and rural communities from Kigali to Musanze and Huye." }
  ];

  const items = highlightsData?.items?.length ? highlightsData.items : defaultHighlights;

  const getIcon = (name: string) => {
    const iconClass = "h-6 w-6 text-primary";
    const normalized = name?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'shield';
    switch (normalized) {
      case 'shield': case 'shieldcheck': return <ShieldCheck className={iconClass} />;
      case 'cpu': return <Cpu className={iconClass} />;
      case 'globe': return <Globe className={iconClass} />;
      case 'zap': return <Zap className={iconClass} />;
      case 'award': return <Award className={iconClass} />;
      case 'target': return <Target className={iconClass} />;
      case 'hardhat': return <HardHat className={iconClass} />;
      case 'activity': return <Activity className={iconClass} />;
      case 'droplets': return <Droplets className={iconClass} />;
      case 'truck': return <Truck className={iconClass} />;
      case 'users': return <Users className={iconClass} />;
      case 'leaf': return <Leaf className={iconClass} />;
      case 'heart': return <Heart className={iconClass} />;
      case 'scale': return <Scale className={iconClass} />;
      case 'sparkles': return <Sparkles className={iconClass} />;
      case 'clock': return <Clock className={iconClass} />;
      case 'rocket': return <Rocket className={iconClass} />;
      case 'building': return <Building className={iconClass} />;
      case 'check': case 'checkcircle': return <CheckCircle className={iconClass} />;
      case 'lightbulb': return <Lightbulb className={iconClass} />;
      case 'microscope': return <Microscope className={iconClass} />;
      case 'stethoscope': return <Stethoscope className={iconClass} />;
      default: return <ShieldCheck className={iconClass} />;
    }
  };

  if (loading) return null;

  return (
    <section className="py-2.5 border-y bg-muted/30 relative group">
      {isAdmin && (
        <div className="absolute inset-0 z-20 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <Button asChild className="pointer-events-auto bg-black text-white hover:bg-black/80 gap-2">
            <Link href="/admin/content?tab=highlights">
              <Edit3 className="h-4 w-4" /> Edit Highlights
            </Link>
          </Button>
        </div>
      )}
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {items.map((item: any, i: number) => (
            <div key={i} className="flex gap-3 items-center">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-lg bg-white border border-primary/20 shadow-sm">
                {getIcon(item.icon)}
              </div>
              <div className="space-y-0">
                <h3 className="text-[16px] font-bold leading-tight">{item.title}</h3>
                <p className="text-[14px] font-normal text-muted-foreground leading-snug">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
