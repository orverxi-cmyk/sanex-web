import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Truck, Settings, Users, Droplets } from "lucide-react";

export function Services() {
  const services = [
    {
      id: "liquid-waste",
      title: "Liquid Waste Collection and Transport",
      description: "Modern vacuum trucks for efficient waste collection serving schools, hospitals, and hotels.",
      image: PlaceHolderImages.find(img => img.id === "vacuum-truck"),
      icon: <Truck className="h-6 w-6" />
    },
    {
      id: "dwts",
      title: "2. Installation of Decentralized Wastewater Treatment Systems (DWTS)",
      description: "Advanced systems for clean water reuse in irrigation and flushing using activated sludge technology.",
      image: PlaceHolderImages.find(img => img.id === "dwts-system"),
      icon: <Droplets className="h-6 w-6" />
    },
    {
      id: "maintenance",
      title: "Maintenance & Consultancy",
      description: "Quarterly maintenance services and expert advice for optimal wastewater management.",
      image: PlaceHolderImages.find(img => img.id === "maintenance-service"),
      icon: <Settings className="h-6 w-6" />
    }
  ];

  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl lg:text-5xl font-bold font-headline">Comprehensive Liquid Waste Solutions</h2>
          <p className="text-muted-foreground max-w-[800px] mx-auto text-lg">
            At SANEX, we offer a full suite of services designed to promote public health and sustainable environmental growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <Card key={service.id} className="group overflow-hidden border-none shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative h-64 overflow-hidden bg-muted">
                {service.image?.imageUrl && (
                  <Image
                    src={service.image.imageUrl}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}
                <div className="absolute top-4 left-4 h-12 w-12 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-primary shadow-lg">
                  {service.icon}
                </div>
              </div>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
