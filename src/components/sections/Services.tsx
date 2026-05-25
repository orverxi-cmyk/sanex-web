
"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { Truck, Settings, Droplets, Users, Loader2 } from "lucide-react";

export function Services() {
  const db = useFirestore();
  const { data: servicesData, loading } = useDoc(db ? doc(db, "settings", "services") : null);

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
    const iconClass = "h-6 w-6 text-primary";
    switch (name.toLowerCase()) {
      case 'truck': return <Truck className={iconClass} />;
      case 'droplets': return <Droplets className={iconClass} />;
      case 'settings': return <Settings className={iconClass} />;
      default: return <Users className={iconClass} />;
    }
  };

  if (loading) return <div className="py-5 text-center"><Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" /></div>;

  return (
    <section id="services" className="py-5 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-5 space-y-2">
          <h2 className="text-2xl lg:text-4xl font-bold font-headline">{content.title}</h2>
          <p className="text-sm text-muted-foreground max-w-[800px] mx-auto">{content.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {content.items.map((service: any, i: number) => (
            <Card key={i} className="group overflow-hidden border-none shadow-md transition-all duration-300 hover:shadow-lg">
              <div className="relative h-48 overflow-hidden bg-muted">
                <Image
                  src={service.imageUrl}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 h-10 w-10 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
                  {getIcon(service.icon || 'users')}
                </div>
              </div>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="font-headline text-lg lg:text-xl leading-tight">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-muted-foreground text-xs leading-relaxed">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
