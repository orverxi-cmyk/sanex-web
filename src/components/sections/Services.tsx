import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Truck, Settings, Droplets, Users, ShieldCheck, Leaf, Globe, Sparkles } from "lucide-react";

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
      title: "Installation of Decentralized Wastewater Treatment Systems (DWTS)",
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
    },
    {
      id: "partnerships",
      title: "Sanitation Projects and Partnerships",
      description: "Collaborating with government and private organizations to promote public health and hygiene nationwide.",
      image: PlaceHolderImages.find(img => img.id === "partnerships"),
      icon: <Users className="h-6 w-6" />
    }
  ];

  const whyChooseUs = [
    {
      title: "Comprehensive Coverage",
      description: "From collection to treatment, we handle every aspect of liquid waste management.",
      icon: <Globe className="h-6 w-6 text-primary" />
    },
    {
      title: "Eco-Friendly Solutions",
      description: "Our services are designed to promote environmental sustainability.",
      icon: <Leaf className="h-6 w-6 text-secondary" />
    },
    {
      title: "Customer-Centric Approach",
      description: "We prioritize your needs and provide customized solutions.",
      icon: <Users className="h-6 w-6 text-primary" />
    },
    {
      title: "Compliance and Safety",
      description: "Adherence to all regulatory standards ensures reliable and safe service delivery.",
      icon: <ShieldCheck className="h-6 w-6 text-secondary" />
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, i) => (
            <Card key={service.id} className="group overflow-hidden border-none shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative h-64 overflow-hidden bg-muted">
                {service.image?.imageUrl && (
                  <Image
                    src={service.image.imageUrl}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    data-ai-hint={service.image.imageHint}
                  />
                )}
                <div className="absolute top-4 left-4 h-12 w-12 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-primary shadow-lg">
                  {service.icon}
                </div>
              </div>
              <CardHeader>
                <CardTitle className="font-headline text-xl lg:text-2xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Why Choose Us Section */}
        <div className="mt-32 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold font-headline">Why Choose SANEX?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We combine technical excellence with a deep commitment to Rwanda's environmental health.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, i) => (
              <div key={i} className="p-8 rounded-2xl bg-muted/30 border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="h-12 w-12 rounded-xl bg-background border flex items-center justify-center mb-6 shadow-sm">
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold font-headline mb-3">{item.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 lg:p-12 rounded-3xl bg-primary text-primary-foreground relative overflow-hidden">
            <Sparkles className="absolute top-4 right-4 h-24 w-24 opacity-10 rotate-12" />
            <div className="max-w-3xl relative z-10">
              <p className="text-xl lg:text-2xl font-medium leading-relaxed italic">
                "With SANEX, you’re not just choosing a service provider – you’re partnering with a company committed to building a cleaner, healthier, and more sustainable Rwanda."
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="h-1 w-12 bg-secondary rounded-full" />
                <span className="font-bold tracking-widest uppercase text-sm">The SANEX Partnership</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
