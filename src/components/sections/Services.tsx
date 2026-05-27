"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { 
  Truck, 
  Settings, 
  Droplets, 
  Users, 
  Loader2, 
  ShieldCheck, 
  Cpu, 
  Globe, 
  Zap, 
  Award, 
  Target, 
  HardHat, 
  Activity, 
  Leaf, 
  Heart, 
  Scale, 
  Sparkles, 
  Clock, 
  Rocket, 
  Building, 
  CheckCircle,
  Stethoscope
} from "lucide-react";

export function Services() {
  const db = useFirestore();
  const servicesRef = React.useMemo(() => (db ? doc(db, "settings", "services") : null), [db]);
  const { data: servicesData, loading } = useDoc(servicesRef);

  const defaultServices = [
    {
      title: "Liquid Waste Collection and Transport",
      description: "Modern vacuum trucks for efficient waste collection serving schools, hospitals, and hotels.",
      imageUrl: "https://picsum.photos/seed/sanex2/800/600",
      icon: "truck"
    },
    {
      title: "Installation of DWTS",
      description: "Advanced systems for clean water reuse in irrigation and flushing using activated sludge technology.",
      imageUrl: "https://picsum.photos/seed/sanex3/800/600",
      icon: "droplets"
    },
    {
      title: "Maintenance & Consultancy",
      description: "Quarterly maintenance services and expert advice for optimal wastewater management.",
      imageUrl: "https://picsum.photos/seed/sanex4/800/600",
      icon: "settings"
    },
    {
      title: "Sanitation Projects",
      description: "Collaborating with government and private organizations to promote public health.",
      imageUrl: "https://picsum.photos/seed/sanex6/800/600",
      icon: "users"
    }
  ];

  const content = {
    title: servicesData?.title || "Comprehensive Liquid Waste Solutions",
    subtitle: servicesData?.subtitle || "At SANEX, we offer a full suite of services designed to promote public health and sustainable environmental growth.",
    items: servicesData?.items?.length ? servicesData.items : defaultServices
  };

  const getIcon = (name: string) => {
    const iconClass = "h-4 w-4 text-primary";
    const normalized = name?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'users';
    
    switch (normalized) {
      case 'truck': return <Truck className={iconClass} />;
      case 'droplets': case 'water': return <Droplets className={iconClass} />;
      case 'settings': case 'tools': return <Settings className={iconClass} />;
      case 'users': case 'team': return <Users className={iconClass} />;
      case 'shield': case 'shieldcheck': return <ShieldCheck className={iconClass} />;
      case 'cpu': return <Cpu className={iconClass} />;
      case 'globe': return <Globe className={iconClass} />;
      case 'zap': case 'energy': return <Zap className={iconClass} />;
      case 'award': return <Award className={iconClass} />;
      case 'target': return <Target className={iconClass} />;
      case 'hardhat': return <HardHat className={iconClass} />;
      case 'activity': return <Activity className={iconClass} />;
      case 'leaf': return <Leaf className={iconClass} />;
      case 'heart': return <Heart className={iconClass} />;
      case 'scale': return <Scale className={iconClass} />;
      case 'sparkles': return <Sparkles className={iconClass} />;
      case 'clock': return <Clock className={iconClass} />;
      case 'rocket': return <Rocket className={iconClass} />;
      case 'building': return <Building className={iconClass} />;
      case 'check': case 'checkcircle': return <CheckCircle className={iconClass} />;
      case 'stethoscope': return <Stethoscope className={iconClass} />;
      default: return <Users className={iconClass} />;
    }
  };

  if (loading) return <div className="py-2.5 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></div>;

  return (
    <section id="services" className="py-2.5 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-5 space-y-1">
          <h2 className="text-2xl lg:text-3xl font-bold font-headline">{content.title}</h2>
          <p className="text-[11px] text-muted-foreground max-w-[800px] mx-auto font-medium">{content.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {content.items.map((service: any, i: number) => (
            <Card key={i} className="group overflow-hidden border shadow-sm transition-all duration-300 hover:shadow-md bg-white rounded-xl">
              <div className="relative h-40 overflow-hidden bg-muted">
                {service.imageUrl && (
                  <Image
                    src={service.imageUrl}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute top-2 left-2 h-8 w-8 rounded-lg bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-sm border border-primary/20">
                  {getIcon(service.icon || 'users')}
                </div>
              </div>
              <CardHeader className="p-4 pb-1">
                <CardTitle className="font-headline text-base lg:text-lg leading-tight group-hover:text-primary transition-colors">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-muted-foreground text-[10px] leading-relaxed font-medium prose prose-invert prose-xs">
                  <div dangerouslySetInnerHTML={{ __html: service.description }} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
